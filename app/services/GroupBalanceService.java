package services;

import dto.TransactionDTO;
import models.Group;
import models.GroupBalance;

import java.util.List;

public interface GroupBalanceService extends BaseService<GroupBalance, Long> {
    void addTransaction(TransactionDTO transactionDTO);

    List<GroupBalance> getGroupBalances(Long groupId);

    void recalculateGroupBalances(Group group);  // if some expense is added or deleted we need to update it
}
