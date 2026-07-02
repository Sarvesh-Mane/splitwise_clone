package dto;

import java.util.List;

public class GroupDetailDTO {
    private Long id;
    private String name;
    private List<UserDTO> members;
    private List<ExpenseDTO> expenses;
    private List<GroupBalanceDTO> groupBalances;
    private List<SettlementDTO> settlements;

    public GroupDetailDTO() {
    }

    public GroupDetailDTO(Long id, String name, List<UserDTO> members, List<ExpenseDTO> expenses, List<GroupBalanceDTO> groupBalances, List<SettlementDTO> settlements) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = expenses;
        this.groupBalances = groupBalances;
        this.settlements = settlements;

    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<UserDTO> getMembers() {
        return members;
    }

    public List<ExpenseDTO> getExpenses() {
        return expenses;
    }

    public List<GroupBalanceDTO> getGroupBalances() {
        return groupBalances;
    }

    public List<SettlementDTO> getSettlements() {
        return settlements;
    }
}
