package dto;

import models.Group;
import models.User;

public class TransactionDTO {
    private Group group;
    private User debtor;
    private User creditor;
    private Double amount;

    public TransactionDTO() {

    }

    public TransactionDTO(Group group, User debtor, User creditor, Double amount) {
        this.group = group;
        this.debtor = debtor;
        this.creditor = creditor;
        this.amount = amount;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getDebtor() {
        return debtor;
    }

    public void setDebtor(User debtor) {
        this.debtor = debtor;
    }

    public User getCreditor() {
        return creditor;
    }

    public void setCreditor(User creditor) {
        this.creditor = creditor;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
