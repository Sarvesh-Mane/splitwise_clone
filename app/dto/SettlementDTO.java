package dto;

public class SettlementDTO {
    private UserDTO from;
    private UserDTO to;
    private Double amount;

    public SettlementDTO() {
    }

    ;

    public SettlementDTO(UserDTO from, UserDTO to, Double amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    public UserDTO getFrom() {
        return from;
    }

    public UserDTO getTo() {
        return to;
    }

    public Double getAmount() {
        return amount;
    }
}
