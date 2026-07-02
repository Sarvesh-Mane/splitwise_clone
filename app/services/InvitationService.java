package services;

import models.GroupInvitation;

import java.util.List;

public interface InvitationService {
    GroupInvitation inviteMember(Long groupId, Long inviterId, String email);

    void acceptInvitation(Long invitationId, Long userId);

    void declineInvitation(Long invitationId, Long userId);

    List<GroupInvitation> getPendingInvitationsForUser(Long userId);

    List<GroupInvitation> getInvitationsForGroup(Long groupId);
}
