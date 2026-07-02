package dto;

public class BalanceSummaryDTO {
    private String groupName;
    private Long groupId;
    private UserDTO otherUser;
    private Double amount;

    public BalanceSummaryDTO() {
    }

    public BalanceSummaryDTO(String groupName, Long groupId, UserDTO otherUser, Double amount) {
        this.groupName = groupName;
        this.groupId = groupId;
        this.otherUser = otherUser;
        this.amount = amount;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public UserDTO getOtherUser() {
        return otherUser;
    }

    public void setOtherUser(UserDTO otherUser) {
        this.otherUser = otherUser;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

}
