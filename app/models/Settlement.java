package models;

public class Settlement {
    private User from;
    private User to;
    private Double amount;

    public Settlement() {

    }

    public Settlement(User from, User to, Double amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;

    }


    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
