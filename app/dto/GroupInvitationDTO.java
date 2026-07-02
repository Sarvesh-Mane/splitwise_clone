package dto;

public class GroupInvitationDTO {
    private Long id;
    private Long groupId;
    private String groupName;
    private UserDTO inviter;
    private UserDTO invitee;      // null if user hasn't registered
    private String inviteeEmail;
    private String status;        // "PENDING" | "ACCEPTED" | "DECLINED"
    private String createdAt;

    public GroupInvitationDTO() {
    }

    public GroupInvitationDTO(Long id, Long groupId, String groupName, UserDTO inviter, UserDTO invitee, String inviteeEmail, String status, String createdAt) {
        this.id = id;
        this.groupId = groupId;
        this.groupName = groupName;
        this.inviter = inviter;
        this.invitee = invitee;
        this.inviteeEmail = inviteeEmail;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public UserDTO getInviter() {
        return inviter;
    }

    public void setInviter(UserDTO inviter) {
        this.inviter = inviter;
    }

    public UserDTO getInvitee() {
        return invitee;
    }

    public void setInvitee(UserDTO invitee) {
        this.invitee = invitee;
    }

    public String getInviteeEmail() {
        return inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
