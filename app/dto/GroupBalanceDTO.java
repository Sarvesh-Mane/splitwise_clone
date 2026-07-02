package dto;

public class GroupBalanceDTO {
    private UserDTO debtor;
    private UserDTO creditor;
    private Double amount;

    public GroupBalanceDTO() {
    }

    public GroupBalanceDTO(UserDTO debtor, UserDTO creditor, Double amount) {
        this.debtor = debtor;
        this.creditor = creditor;
        this.amount = amount;
    }

    public UserDTO getDebtor() {
        return debtor;
    }

    public UserDTO getCreditor() {
        return creditor;
    }

    public Double getAmount() {
        return amount;
    }
}
