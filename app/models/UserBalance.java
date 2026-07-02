package models;

public class UserBalance {
    private User user;
    private Double amount;

    public UserBalance(User user, Double amount) {
        this.user = user;
        this.amount = amount;
    }

    public User getUser() {
        return user;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
