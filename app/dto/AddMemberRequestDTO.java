package dto;

public class AddMemberRequestDTO {
    private Long userId;

    public AddMemberRequestDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
