package services;

import dto.GroupCreateRequestDTO;
import models.Expense;
import models.Group;
import models.User;

import java.util.List;

public interface GroupService extends BaseService<Group, Long> {

    Group createGroup(String name);

    Group createGroupWithMembers(GroupCreateRequestDTO request);

    void addMember(Long groupId, User user);

    void addMemberById(Long groupId, Long userId);

    List<Expense> getExpenses(Long groupId);

    List<Group> getGroupsForUser(Long userId);
}