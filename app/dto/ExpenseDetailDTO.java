package dto;

import enums.Category;
import enums.SplitType;

import java.util.List;

public class ExpenseDetailDTO {
    private Long id;
    private String expenseName;
    private Double amount;
    private UserDTO paidBy;
    private SplitType splitType;
    private Long groupId;
    private List<SplitDTO> splits;
    private Category category;

    public ExpenseDetailDTO() {
    }

    public ExpenseDetailDTO(Long id, String expenseName, Double amount, UserDTO paidBy, SplitType splitType, Long groupId, List<SplitDTO> splits, Category category) {
        this.id = id;
        this.expenseName = expenseName;
        this.amount = amount;
        this.paidBy = paidBy;
        this.splitType = splitType;
        this.groupId = groupId;
        this.splits = splits;
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

    public Long getGroupId() {
        return groupId;
    }

    public List<SplitDTO> getSplits() {
        return splits;
    }
}
