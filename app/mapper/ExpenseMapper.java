package mapper;

import dto.ExpenseDTO;
import dto.ExpenseDetailDTO;
import dto.SplitDTO;
import dto.UserDTO;
import models.Expense;

import java.util.List;
import java.util.stream.Collectors;

//static becoz they are kind of utility functions and have no state of their own
public class ExpenseMapper {
    public static ExpenseDTO toDTO(Expense expense) {
        UserDTO paidBy = UserMapper.toDTO(expense.getPaidBy());
        return new ExpenseDTO(expense.getId(), expense.getExpenseName(), expense.getAmount(), paidBy, expense.getSplitType(), expense.getCategory());
    }

    //adding more details for expense detail page
    public static ExpenseDetailDTO toDetailDTO(Expense expense) {
        UserDTO paidBy = UserMapper.toDTO(expense.getPaidBy());

        List<SplitDTO> splits = expense.getSplits().stream()
                .map(split -> new SplitDTO(UserMapper.toDTO(split.getUser()), split.getAmount()))
                .collect(Collectors.toList());

        return new ExpenseDetailDTO(
                expense.getId(), expense.getExpenseName(), expense.getAmount(),
                paidBy, expense.getSplitType(), expense.getGroup().getId(),
                splits, expense.getCategory()
        );
    }


}
