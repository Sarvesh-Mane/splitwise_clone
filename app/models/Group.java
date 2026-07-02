package models;

import io.ebean.Finder;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_groups")  //user_groups rakha naam to avoid clashing with GROUP keyword in MySQL
public class Group extends BaseModel {


    public static final Finder<Long, Group> find = new Finder<>(Group.class);
    private String name;
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<Expense> expenses = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "user_groups_users",
            joinColumns = @JoinColumn(name = "user_groups_id"),
            inverseJoinColumns = @JoinColumn(name = "users_id")
    )
    private List<User> members = new ArrayList<>();
    @OneToMany(mappedBy = "group")
    private List<GroupBalance> balances;

    public Group() {
    }

    public Group(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public void addMember(User user) {
        members.add(user);
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public List<GroupBalance> getBalances() {
        return balances;
    }

    public void setBalances(List<GroupBalance> balances) {
        this.balances = balances;
    }


}