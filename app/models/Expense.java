package models;

import enums.Category;
import enums.SplitType;
import io.ebean.Finder;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "expenses")
public class Expense extends BaseModel {

    public static final Finder<Long, Expense> find = new Finder<>(Expense.class);
    @ManyToOne
    private Group group;
    @ManyToOne
    private User paidBy;
    private String expenseName;
    private Double amount;
    @Enumerated(EnumType.STRING)     //@Enumerated becoz  we are using enum
    private SplitType splitType;
    @OneToMany(cascade = CascadeType.ALL)
    //cascadetype all means ebean can keep track of all operations for this list of split object
    private List<Split> splits;
    @Enumerated(EnumType.STRING)
    private Category category;

    public Expense() {
    }

    public Expense(Group group, String expenseName, User paidBy, Double amount, List<Split> splits, SplitType splitType) {
        this.expenseName = expenseName;
        this.group = group;
        this.paidBy = paidBy;
        this.amount = amount;
        this.splits = splits;
        this.splitType = splitType;
        this.category = Category.OTHER;
    }

    public User getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(User paidBy) {
        this.paidBy = paidBy;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }

    public List<Split> getSplits() {
        return splits;
    }

    public void setSplits(List<Split> splits) {
        this.splits = splits;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


}