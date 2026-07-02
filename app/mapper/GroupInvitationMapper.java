package mapper;

import dto.GroupInvitationDTO;
import dto.UserDTO;
import models.GroupInvitation;

public class GroupInvitationMapper {
    public static GroupInvitationDTO toDTO(GroupInvitation inv) {
        Long groupId = inv.getGroup().getId();
        String groupName = inv.getGroup().getName();
        UserDTO inviter = UserMapper.toDTO(inv.getInviter());
        // invitee can be null if user hasn't registered yet
        UserDTO invitee = inv.getInvitee() != null ? UserMapper.toDTO(inv.getInvitee()) : null;
        String inviteeEmail = inv.getInviteeEmail();
        String status = inv.getStatus().name();
        String createdAt = inv.getCreatedAt() != null ? inv.getCreatedAt().toString() : null;

        return new GroupInvitationDTO(inv.getId(), groupId, groupName, inviter, invitee, inviteeEmail, status, createdAt);
    }
}
