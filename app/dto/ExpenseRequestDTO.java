package dto;

import enums.Category;
import enums.SplitType;

import java.util.List;

public class ExpenseRequestDTO {
    private Long paidByID;
    private Double amount;
    private SplitType splitType;
    private List<Long> participantIDs;
    private List<Double> values;
    private String expenseName;
    private Category category;

    public ExpenseRequestDTO() {

    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Long getPaidByID() {
        return paidByID;
    }

    public void setPaidByID(Long paidByID) {
        this.paidByID = paidByID;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }

    public List<Long> getParticipantIDs() {
        return participantIDs;

    }

    public void setParticipantIDs(List<Long> participantIDs) {
        this.participantIDs = participantIDs;
    }

    public List<Double> getValues() {
        return values;
    }

    public void setValues(List<Double> values) {
        this.values = values;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

}
