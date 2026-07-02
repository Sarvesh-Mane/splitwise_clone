package models;

import io.ebean.Finder;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "group_balances")
public class GroupBalance extends BaseModel {
    public static final Finder<Long, GroupBalance> find = new Finder<>(GroupBalance.class);

    @ManyToOne
    private Group group;
    @ManyToOne
    private User debtor;
    @ManyToOne
    private User creditor;

    private Double amount;

    public GroupBalance() {

    }

    public GroupBalance(Group group, User debtor, User creditor, Double amount) {
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
