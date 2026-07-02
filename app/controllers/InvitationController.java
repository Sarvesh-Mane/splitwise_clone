package controllers;

import com.google.inject.Inject;
import dto.InviteMemberRequestDTO;
import mapper.GroupInvitationMapper;
import models.Group;
import models.GroupInvitation;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import security.AuthAttributes;
import security.RequestLoggingAction;
import security.SecuredAction;
import services.GroupService;
import services.InvitationService;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@With({RequestLoggingAction.class, SecuredAction.class})
public class InvitationController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(InvitationController.class);
    private final InvitationService invitationService;
    private final GroupService groupService;

    @Inject
    public InvitationController(InvitationService invitationService, GroupService groupService) {
        this.invitationService = invitationService;
        this.groupService = groupService;
    }

    public Result invite(Http.Request request, Long groupId) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized invite attempt: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        InviteMemberRequestDTO dto = Json.fromJson(request.body().asJson(), InviteMemberRequestDTO.class);

        logger.info("Inviting member: groupId={}, email={}, invitedBy={}",
                groupId, dto.getEmail(), currentUser.getId());

        GroupInvitation invitation = invitationService.inviteMember(groupId, currentUser.getId(), dto.getEmail());
        return created(Json.toJson(GroupInvitationMapper.toDTO(invitation)));
    }

    public Result getGroupInvitations(Http.Request request, Long groupId) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized invitations access: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        logger.debug("Fetching invitations for groupId={}", groupId);
        return ok(Json.toJson(
                invitationService.getInvitationsForGroup(groupId).stream()
                        .map(GroupInvitationMapper::toDTO)
                        .collect(Collectors.toList())
        ));
    }

    public Result getPendingInvitations(Http.Request request) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        logger.debug("Fetching pending invitations for userId={}", currentUser.getId());
        return ok(Json.toJson(
                invitationService.getPendingInvitationsForUser(currentUser.getId()).stream()
                        .map(GroupInvitationMapper::toDTO)
                        .collect(Collectors.toList())
        ));
    }

    public Result accept(Http.Request request, Long id) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        logger.info("Accepting invitation: invitationId={}, userId={}", id, currentUser.getId());
        invitationService.acceptInvitation(id, currentUser.getId());
        return ok(Json.toJson("Invitation accepted"));
    }

    public Result decline(Http.Request request, Long id) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        logger.info("Declining invitation: invitationId={}, userId={}", id, currentUser.getId());
        invitationService.declineInvitation(id, currentUser.getId());
        return ok(Json.toJson("Invitation declined"));
    }
}
