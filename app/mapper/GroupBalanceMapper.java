package mapper;

import dto.GroupBalanceDTO;
import dto.UserDTO;
import models.GroupBalance;

public class GroupBalanceMapper {
    public static GroupBalanceDTO toDTO(GroupBalance groupBalance) {
        UserDTO debtor = UserMapper.toDTO(groupBalance.getDebtor());
        UserDTO creditor = UserMapper.toDTO(groupBalance.getCreditor());
        return new GroupBalanceDTO(debtor, creditor, groupBalance.getAmount());
    }
}
