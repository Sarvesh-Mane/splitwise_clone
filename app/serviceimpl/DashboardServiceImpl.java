package serviceimpl;

import dto.BalanceSummaryDTO;
import dto.DashboardDTO;
import dto.GroupDTO;
import dto.GroupInvitationDTO;
import mapper.GroupInvitationMapper;
import mapper.GroupMapper;
import mapper.UserMapper;
import models.Group;
import models.GroupBalance;
import models.GroupInvitation;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.DashboardService;
import services.InvitationService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Singleton
public class DashboardServiceImpl implements DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);
    private final InvitationService invitationService;

    @Inject
    public DashboardServiceImpl(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @Override
    public DashboardDTO getDashboard(Long userId) {
        User user = User.find.byId(userId);
        if (user == null) throw new NoSuchElementException("User not found");

        logger.debug("Building dashboard for userId={}", userId);

        // 1. Get groups where the user is a member
        List<Group> myGroups = Group.find.query().where()
                .eq("members.id", userId)
                .findList();

        List<GroupDTO> groupDTOs = myGroups.stream()
                .map(GroupMapper::toDTO)
                .collect(Collectors.toList());

        // 2. Get pending invitations for this user
        List<GroupInvitation> pendingInvitations = invitationService.getPendingInvitationsForUser(userId);
        List<GroupInvitationDTO> invitationDTOs = pendingInvitations.stream()
                .map(GroupInvitationMapper::toDTO)
                .collect(Collectors.toList());

        // 3. Calculate balance summaries across all groups
        List<BalanceSummaryDTO> balances = new ArrayList<>();
        for (Group group : myGroups) {
            List<GroupBalance> groupBalances = GroupBalance.find.query().where()
                    .eq("group.id", group.getId())
                    .findList();

            for (GroupBalance gb : groupBalances) {
                if (gb.getCreditor().getId().equals(userId)) {
                    // Someone owes the user → positive amount
                    balances.add(new BalanceSummaryDTO(
                            group.getName(),
                            group.getId(),
                            UserMapper.toDTO(gb.getDebtor()),
                            gb.getAmount()
                    ));
                } else if (gb.getDebtor().getId().equals(userId)) {
                    // User owes someone → negative amount
                    balances.add(new BalanceSummaryDTO(
                            group.getName(),
                            group.getId(),
                            UserMapper.toDTO(gb.getCreditor()),
                            -gb.getAmount()
                    ));
                }
            }
        }

        logger.debug("Dashboard built: {} groups, {} invitations, {} balances",
                groupDTOs.size(), invitationDTOs.size(), balances.size());

        return new DashboardDTO(groupDTOs, invitationDTOs, balances);
    }
}
