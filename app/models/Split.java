package models;

import io.ebean.Finder;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "splits")
public class Split extends BaseModel {

    public static final Finder<Integer, Split> find = new Finder<>(Split.class);
    @ManyToOne
    private User user;
    private Double amount;

    public Split() {
    }

    public Split(User user, Double amount) {

        this.user = user;
        this.amount = amount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}