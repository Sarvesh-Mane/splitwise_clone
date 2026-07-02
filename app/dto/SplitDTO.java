package dto;

public class SplitDTO {
    private UserDTO user;
    private Double amount;

    public SplitDTO() {
    }

    public SplitDTO(UserDTO user, Double amount) {
        this.user = user;
        this.amount = amount;
    }

    public UserDTO getUser() {
        return user;
    }

    public Double getAmount() {
        return amount;
    }
}
