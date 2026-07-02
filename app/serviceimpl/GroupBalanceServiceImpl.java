package serviceimpl;

import dto.TransactionDTO;
import models.*;
import services.GroupBalanceService;

import java.util.List;

public class GroupBalanceServiceImpl extends BaseServiceImpl<GroupBalance, Long> implements GroupBalanceService {

    public GroupBalanceServiceImpl() {
        super(GroupBalance.find);
    }

    // need to get net Transactions, so if same pair of users is seen, perform the required operations
    @Override
    public void addTransaction(TransactionDTO transactionDTO) {
        GroupBalance reverseBalance = GroupBalance.find.query().where().eq("group", transactionDTO.getGroup()).eq("creditor", transactionDTO.getDebtor()).eq("debtor", transactionDTO.getCreditor()).findOne();
        if (reverseBalance != null) {
            if (reverseBalance.getAmount() > transactionDTO.getAmount()) {
                reverseBalance.setAmount(reverseBalance.getAmount() - transactionDTO.getAmount());
                reverseBalance.update();
            } else if (reverseBalance.getAmount().equals(transactionDTO.getAmount())) {
                reverseBalance.delete();
            } else {
                Double amount = transactionDTO.getAmount() - reverseBalance.getAmount();
                reverseBalance.delete();
                GroupBalance balance = new GroupBalance(transactionDTO.getGroup(), transactionDTO.getDebtor(), transactionDTO.getCreditor(), amount);
                balance.save();

            }

        } else {
            GroupBalance groupBalance = GroupBalance.find.query().where().eq("group", transactionDTO.getGroup()).eq("creditor", transactionDTO.getCreditor()).eq("debtor", transactionDTO.getDebtor()).findOne();
            if (groupBalance == null) {
                groupBalance = new GroupBalance(transactionDTO.getGroup(), transactionDTO.getDebtor(), transactionDTO.getCreditor(), transactionDTO.getAmount());
                groupBalance.save();

            } else {
                groupBalance.setAmount(groupBalance.getAmount() + transactionDTO.getAmount());
                groupBalance.update();
            }
        }

    }

    public List<GroupBalance> getGroupBalances(Long groupId) {
        Group group = Group.find.byId(groupId);

        if (group == null) {
            throw new RuntimeException("Group not found");
        }

        return group.getBalances();

    }

    // if some new expense is added we need to recalculate everything
    //Because incremental updates are error-prone with edge cases
    // (editing amount, changing payer, removing participants).
    // Full recalculation is O(E×S) where E=expenses and S=splits per expense — small enough per group.
    @Override
    public void recalculateGroupBalances(Group group) {
        if (group == null) {
            return;
        }
        List<GroupBalance> existingBalances = GroupBalance.find.query().where().eq("group", group).findList();
        for (GroupBalance gb : existingBalances) {
            gb.delete();
        }

        List<Expense> expenses = Expense.find.query().where().eq("group", group).findList();
        for (Expense expense : expenses) {
            User paidBy = expense.getPaidBy();
            for (Split split : expense.getSplits()) {
                if (!split.getUser().equals(paidBy)) {
                    TransactionDTO transactionDTO = new TransactionDTO(group, split.getUser(), paidBy, split.getAmount());
                    addTransaction(transactionDTO);
                }
            }
        }
    }
}
