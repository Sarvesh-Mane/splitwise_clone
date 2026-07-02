package controllers;

import com.google.inject.Inject;
import dto.SettlementDTO;
import mapper.SettlementMapper;
import models.Group;
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
import services.SettlementService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@With({RequestLoggingAction.class, SecuredAction.class})
public class SettlementController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(SettlementController.class);

    private final SettlementService settlementService;
    private final GroupService groupService;

    @Inject
    public SettlementController(SettlementService settlementService, GroupService groupService) {
        this.settlementService = settlementService;
        this.groupService = groupService;
    }

    public Result getSettlements(Long groupId, Http.Request request) {
        logger.debug("Computing settlements for groupId={}", groupId);
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized settlements access: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        List<SettlementDTO> settlements = settlementService.simplifySettlements(groupId).stream()
                .map(SettlementMapper::toDTO)
                .collect(Collectors.toList());
        logger.debug("Computed {} settlements for groupId={}", settlements.size(), groupId);
        return ok(Json.toJson(settlements));
    }
}
