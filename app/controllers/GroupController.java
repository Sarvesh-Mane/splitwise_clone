package controllers;

import com.google.inject.Inject;
import dto.AddMemberRequestDTO;
import dto.ExpenseDTO;
import dto.GroupCreateRequestDTO;
import dto.GroupDTO;
import mapper.ExpenseMapper;
import mapper.GroupMapper;
import models.Group;
import models.Settlement;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import security.RequestLoggingAction;
import security.SecuredAction;
import services.GroupService;
import services.SettlementService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@With({RequestLoggingAction.class, SecuredAction.class})
public class GroupController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

    private final GroupService groupService;
    private final SettlementService settlementService;

    //i needed settlement service here because i wanted to send settlemetns as well in the group detail DTO
    @Inject
    public GroupController(GroupService groupService, SettlementService settlementService) {
        this.groupService = groupService;
        this.settlementService = settlementService;
    }

    public Result getGroups(Http.Request request) {
        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        
        if (currentUser == null) {
            logger.warn("currentUser is null in getGroups request");
            return unauthorized("User not authenticated");
        }
        
        logger.debug("Fetching groups for userId={}", currentUser.getId());
        
        try {
            List<GroupDTO> groups = groupService.getGroupsForUser(currentUser.getId()).stream()
                    .map(GroupMapper::toDTO)
                    .collect(Collectors.toList());

            logger.debug("Fetched {} groups for userId={}", groups.size(), currentUser.getId());
            return ok(Json.toJson(groups));
        } catch (Exception e) {
            logger.error("Error fetching groups for userId={}: {}", currentUser.getId(), e.getMessage(), e);
            return internalServerError("Failed to fetch groups");
        }
    }

    public Result getGroupById(Long id, Http.Request request) {
        logger.debug("Fetching group: groupId={}", id);

        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        Group group = groupService.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized access attempt: userId={}, groupId={}", currentUser.getId(), id);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        return ok(Json.toJson(GroupMapper.toDTO(group)));
    }

    public Result getGroupDetail(Long id, Http.Request request) {
        logger.debug("Fetching group detail: groupId={}", id);

        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        Group group = groupService.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized access attempt: userId={}, groupId={}", currentUser.getId(), id);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        List<Settlement> settlements = settlementService.simplifySettlements(id);
        return ok(Json.toJson(GroupMapper.toDetailDTO(group, settlements)));
    }

    public Result createGroup(Http.Request request) {
        GroupCreateRequestDTO dto = Json.fromJson(request.body().asJson(), GroupCreateRequestDTO.class);
        logger.info("Creating group: name={}", dto.getName());
        Group group = groupService.createGroupWithMembers(dto);
        logger.info("Group created: groupId={}, name={}", group.getId(), group.getName());
        return created(Json.toJson(GroupMapper.toDTO(group)));
    }

    public Result addMember(Http.Request request, Long groupId) {
        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        Group group = groupService.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member (has permission to add members)
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized add member attempt: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        AddMemberRequestDTO dto = Json.fromJson(request.body().asJson(), AddMemberRequestDTO.class);
        logger.info("Adding member: groupId={}, userId={}", groupId, dto.getUserId());
        groupService.addMemberById(groupId, dto.getUserId());
        return ok(Json.toJson("Member added"));
    }

    public Result deleteGroup(Long id, Http.Request request) {
        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        Group group = groupService.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member (has permission to delete)
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized delete group attempt: userId={}, groupId={}", currentUser.getId(), id);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        logger.info("Deleting group: groupId={}", id);
        groupService.delete(id);
        return ok(Json.toJson("Group deleted"));
    }

    public Result getExpenses(Long groupId, Http.Request request) {
        User currentUser = request.attrs().get(security.AuthAttributes.USER);
        Group group = groupService.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized expense access attempt: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        logger.debug("Fetching expenses for groupId={}", groupId);
        List<ExpenseDTO> expenses = groupService.getExpenses(groupId).stream()
                .map(ExpenseMapper::toDTO)
                .collect(Collectors.toList());
        logger.debug("Fetched {} expenses for groupId={}", expenses.size(), groupId);
        return ok(Json.toJson(expenses));
    }
}
