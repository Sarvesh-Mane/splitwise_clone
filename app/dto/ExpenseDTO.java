package dto;

import enums.Category;
import enums.SplitType;

public class ExpenseDTO {
    private Long id;
    private String expenseName;
    private Double amount;
    private UserDTO paidBy;
    private SplitType splitType;
    private Category category;

    public ExpenseDTO() {
    }

    ;

    public ExpenseDTO(Long id, String expenseName, Double amount, UserDTO paidBy, SplitType splitType, Category category) {
        this.id = id;
        this.expenseName = expenseName;
        this.amount = amount;
        this.paidBy = paidBy;
        this.splitType = splitType;
        this.category = category;
    }

    public Category getCategory() {
        return category;
    }

    public Long getId() {
        return id;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public Double getAmount() {
        return amount;
    }

    public UserDTO getPaidBy() {
        return paidBy;
    }

    public SplitType getSplitType() {
        return splitType;
    }
}
