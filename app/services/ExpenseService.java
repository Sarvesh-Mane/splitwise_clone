package services;

import dto.ExpenseRequestDTO;
import models.Expense;
import models.Group;

public interface ExpenseService extends BaseService<Expense, Long> {
    Expense createExpense(Group group, ExpenseRequestDTO request);

    Expense updateExpense(Long id, ExpenseRequestDTO request);
}