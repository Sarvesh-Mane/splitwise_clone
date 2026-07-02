package serviceimpl;

import enums.InvitationStatus;
import models.Group;
import models.GroupInvitation;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.GroupService;
import services.InvitationService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.NoSuchElementException;

@Singleton
public class InvitationServiceImpl implements InvitationService {

    private static final Logger logger = LoggerFactory.getLogger(InvitationServiceImpl.class);
    private final GroupService groupService;

    @Inject
    public InvitationServiceImpl(GroupService groupService) {
        this.groupService = groupService;
    }

    @Override
    public GroupInvitation inviteMember(Long groupId, Long inviterId, String email) {
        Group group = Group.find.byId(groupId);
        if (group == null) throw new NoSuchElementException("Group not found");

        User inviter = User.find.byId(inviterId);
        if (inviter == null) throw new NoSuchElementException("Inviter not found");

        // Check if email user is already a member of the group
        boolean alreadyMember = group.getMembers().stream()
                .anyMatch(m -> m.getEmail().equalsIgnoreCase(email));
        if (alreadyMember) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        // Check if there's already a PENDING invitation for this email in this group
        GroupInvitation existing = GroupInvitation.find.query().where()
                .eq("group", group)
                .ieq("inviteeEmail", email)
                .eq("status", InvitationStatus.PENDING)
                .findOne();
        if (existing != null) {
            throw new IllegalArgumentException("An invitation is already pending for this email");
        }

        // Check if the invited user exists in the system
        User invitee = User.find.query().where().ieq("email", email).findOne();
        if (invitee == null) {
            throw new IllegalArgumentException("User with this email does not exist");
        }

        GroupInvitation invitation = new GroupInvitation(group, inviter, invitee, email);
        invitation.save();

        logger.info("Invitation sent: groupId={}, inviterId={}, inviteeEmail={}", groupId, inviterId, email);
        return invitation;
    }

    @Override
    public void acceptInvitation(Long invitationId, Long userId) {
        GroupInvitation invitation = GroupInvitation.find.byId(invitationId);
        if (invitation == null) throw new NoSuchElementException("Invitation not found");

        User user = User.find.byId(userId);
        if (user == null) throw new NoSuchElementException("User not found");

        // Verify the invitation belongs to this user (by email match)
        if (!user.getEmail().equalsIgnoreCase(invitation.getInviteeEmail())) {
            throw new IllegalArgumentException("This invitation is not for you");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("Invitation is no longer pending");
        }

        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setInvitee(user);
        invitation.save();

        // Add user to the group
        groupService.addMember(invitation.getGroup().getId(), user);

        logger.info("Invitation accepted: invitationId={}, userId={}, groupId={}",
                invitationId, userId, invitation.getGroup().getId());
    }

    @Override
    public void declineInvitation(Long invitationId, Long userId) {
        GroupInvitation invitation = GroupInvitation.find.byId(invitationId);
        if (invitation == null) throw new NoSuchElementException("Invitation not found");

        User user = User.find.byId(userId);
        if (user == null) throw new NoSuchElementException("User not found");

        // Verify the invitation belongs to this user
        if (!user.getEmail().equalsIgnoreCase(invitation.getInviteeEmail())) {
            throw new IllegalArgumentException("This invitation is not for you");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("Invitation is no longer pending");
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setInvitee(user);
        invitation.save();

        logger.info("Invitation declined: invitationId={}, userId={}", invitationId, userId);
    }

    @Override
    public List<GroupInvitation> getPendingInvitationsForUser(Long userId) {
        User user = User.find.byId(userId);
        if (user == null) throw new NoSuchElementException("User not found");

        // Find invitations matching the user's email that are still PENDING
        return GroupInvitation.find.query().where()
                .ieq("inviteeEmail", user.getEmail())
                .eq("status", InvitationStatus.PENDING)
                .findList();
    }

    @Override
    public List<GroupInvitation> getInvitationsForGroup(Long groupId) {
        return GroupInvitation.find.query().where()
                .eq("group.id", groupId)
                .findList();
    }
}
