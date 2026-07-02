package controllers;

import com.google.inject.Inject;
import dto.ExpenseRequestDTO;
import mapper.ExpenseMapper;
import models.Expense;
import models.Group;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import security.AuthAttributes;
import security.RequestLoggingAction;
import security.SecuredAction;
import services.ExpenseService;
import services.GroupService;

import java.util.NoSuchElementException;

@With({RequestLoggingAction.class, SecuredAction.class})
public class ExpenseController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseService expenseService;
    private final GroupService groupService;

    @Inject
    public ExpenseController(ExpenseService expenseService, GroupService groupService) {
        this.expenseService = expenseService;
        this.groupService = groupService;
    }

    public Result getExpenseById(Long id, Http.Request request) {
        logger.debug("Fetching expense: expenseId={}", id);
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Expense expense = expenseService.findById(id).orElseThrow(() -> new NoSuchElementException("Expense not found"));

        // Check if user is a member of the group
        if (!expense.getGroup().getMembers().contains(currentUser)) {
            logger.warn("Unauthorized expense access: userId={}, expenseId={}, groupId={}", currentUser.getId(), id, expense.getGroup().getId());
            return forbidden(Json.toJson("You don't have access to this expense"));
        }

        return ok(Json.toJson(ExpenseMapper.toDetailDTO(expense)));
    }

    public Result createExpense(Http.Request request, Long groupId) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId).orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized create expense attempt: userId={}, groupId={}", currentUser.getId(), groupId);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        ExpenseRequestDTO dto = Json.fromJson(request.body().asJson(), ExpenseRequestDTO.class);
        logger.info("Creating expense: groupId={}, name={}, amount={}", groupId, dto.getExpenseName(), dto.getAmount());
        Expense expense = expenseService.createExpense(group, dto);
        logger.info("Expense created: expenseId={}, groupId={}", expense.getId(), groupId);
        return created(Json.toJson(ExpenseMapper.toDTO(expense)));
    }

    public Result updateExpense(Http.Request request, Long groupId, Long id) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId).orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized update expense attempt: userId={}, groupId={}, expenseId={}", currentUser.getId(), groupId, id);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        logger.info("Updating expense: expenseId={}, groupId={}", id, groupId);
        ExpenseRequestDTO dto = Json.fromJson(request.body().asJson(), ExpenseRequestDTO.class);
        Expense expense = expenseService.updateExpense(id, dto);
        logger.info("Expense updated: expenseId={}, groupId={}", id, groupId);
        return ok(Json.toJson(ExpenseMapper.toDTO(expense)));
    }

    public Result deleteExpense(Long groupId, Long id, Http.Request request) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        Group group = groupService.findById(groupId).orElseThrow(() -> new NoSuchElementException("Group not found"));

        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            logger.warn("Unauthorized delete expense attempt: userId={}, groupId={}, expenseId={}", currentUser.getId(), groupId, id);
            return forbidden(Json.toJson("You don't have access to this group"));
        }

        logger.info("Deleting expense: expenseId={}, groupId={}", id, groupId);
        expenseService.delete(id);
        return ok(Json.toJson("Expense deleted"));
    }
}
