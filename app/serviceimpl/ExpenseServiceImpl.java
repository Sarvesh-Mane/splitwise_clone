package serviceimpl;

import com.google.inject.Inject;
import dto.ExpenseRequestDTO;
import factories.SplitStrategyFactory;
import models.Expense;
import models.Group;
import models.Split;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.ExpenseService;
import services.GroupBalanceService;
import strategies.SplitStrategy;

import javax.inject.Singleton;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class ExpenseServiceImpl extends BaseServiceImpl<Expense, Long> implements ExpenseService {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseServiceImpl.class);
    private final GroupBalanceService groupBalanceService;

    @Inject
    public ExpenseServiceImpl(GroupBalanceService groupBalanceService) {
        super(Expense.find);
        this.groupBalanceService = groupBalanceService;
    }

    @Override
    public Expense createExpense(Group group, ExpenseRequestDTO request) {

        //logging
        logger.debug("Creating expense in groupId={}: name={}, amount={}, splitType={}",
                group.getId(), request.getExpenseName(), request.getAmount(), request.getSplitType());


        User paidBy = User.find.byId(request.getPaidByID());
        Double amount = request.getAmount();
        List<User> participants = request.getParticipantIDs().stream()
                .map(User.find::byId)
                .collect(Collectors.toList());

        List<Double> values = request.getValues();
        String expenseName = request.getExpenseName();

        SplitStrategy strategy = SplitStrategyFactory.getStrategy(request.getSplitType());

        List<Split> splits = strategy.calculateSplit(paidBy, amount, participants, values);
        logger.debug("Calculated {} splits for expense", splits.size());

        Expense expense = new Expense(group, expenseName, paidBy, amount, splits, request.getSplitType());
        if (request.getCategory() != null) {
            expense.setCategory(request.getCategory());
        }
        expense.save();

        groupBalanceService.recalculateGroupBalances(group);
        logger.info("Expense saved: expenseId={}, groupId={}, amount={}", expense.getId(), group.getId(), amount);
        return expense;
    }

    @Override
    public Expense updateExpense(Long id, ExpenseRequestDTO request) {
        logger.debug("Updating expenseId={}", id);
        Expense expense = findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Expense not found"));
        Group group = expense.getGroup();

        User paidBy = User.find.byId(request.getPaidByID());
        Double amount = request.getAmount();
        List<User> participants = request.getParticipantIDs().stream()
                .map(User.find::byId)
                .collect(Collectors.toList());

        List<Double> values = request.getValues();
        String expenseName = request.getExpenseName();

        SplitStrategy strategy = SplitStrategyFactory.getStrategy(request.getSplitType());
        List<Split> splits = strategy.calculateSplit(paidBy, amount, participants, values);

        for (Split oldSplit : expense.getSplits()) {
            oldSplit.delete();
        }

        expense.setExpenseName(expenseName);
        expense.setPaidBy(paidBy);
        expense.setAmount(amount);
        expense.setSplitType(request.getSplitType());
        expense.setSplits(splits);
        if (request.getCategory() != null) {
            expense.setCategory(request.getCategory());
        }

        expense.update();
        //since a new expense is added we need to recalculate the balances
        groupBalanceService.recalculateGroupBalances(group);
        logger.info("Expense updated: expenseId={}, groupId={}", id, group.getId());
        return expense;
    }

    @Override
    public void delete(Long id) {
        logger.debug("Deleting expenseId={}", id);
        Expense expense = finder.byId(id);
        if (expense != null) {
            Group group = expense.getGroup();
            expense.delete();
            groupBalanceService.recalculateGroupBalances(group);
            logger.info("Expense deleted: expenseId={}, groupId={}", id, group.getId());
        } else {
            logger.warn("Attempted to delete non-existent expenseId={}", id);
        }
    }
}
