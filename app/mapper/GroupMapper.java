package mapper;

import dto.*;
import models.Group;
import models.Settlement;

import java.util.List;
import java.util.stream.Collectors;


//static becoz they are kind of utility functions and have no state of their own
public class GroupMapper {
    public static GroupDTO toDTO(Group group) {
        //getting members
        List<UserDTO> members = group.getMembers().stream()
                .map(UserMapper::toDTO).collect(Collectors.toList());
        return new GroupDTO(group.getId(), group.getName(), members);
    }

    //adding extra details to the group dto for group details page

    public static GroupDetailDTO toDetailDTO(Group group, List<Settlement> settlements) {
        //getting members
        List<UserDTO> members = group.getMembers().stream()
                .map(UserMapper::toDTO).collect(Collectors.toList());
        //getting expenses
        List<ExpenseDTO> expenses = group.getExpenses().stream()
                .map(ExpenseMapper::toDTO).collect(Collectors.toList());
        //getting balances
        List<GroupBalanceDTO> balances = group.getBalances().stream()
                .map(GroupBalanceMapper::toDTO).collect(Collectors.toList());

        //settlements provided in argument
        List<SettlementDTO> settlementDTOs = settlements.stream()
                .map(SettlementMapper::toDTO).collect(Collectors.toList());

        return new GroupDetailDTO(group.getId(), group.getName(), members, expenses, balances, settlementDTOs);
    }
}
