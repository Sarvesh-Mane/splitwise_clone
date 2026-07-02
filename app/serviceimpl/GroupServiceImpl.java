package serviceimpl;

import dto.GroupCreateRequestDTO;
import models.Expense;
import models.Group;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.GroupService;
import services.UserService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.NoSuchElementException;

@Singleton
public class GroupServiceImpl extends BaseServiceImpl<Group, Long> implements GroupService {
    private static final Logger logger = LoggerFactory.getLogger(GroupServiceImpl.class);
    private final UserService userService;

    //dependency injection, i will be using userService in this impl
    @Inject
    public GroupServiceImpl(UserService userService) {
        super(Group.find);
        this.userService = userService;
    }

    @Override
    public Group createGroup(String name) {

        logger.debug("Creating group: name={}", name);
        Group group = new Group(name);
        //saving the group to db
        group.save();
        logger.info("Group created: groupId={}, name={}", group.getId(), name);

        return group;
    }

    @Override
    public Group createGroupWithMembers(GroupCreateRequestDTO request) {
        Group group = createGroup(request.getName());

        if (request.getMemberIds() != null) {
            for (Long userId : request.getMemberIds()) {
                User user = userService.findById(userId).orElse(null);
                if (user != null) addMember(group.getId(), user); //using the addMember method to add users

            }
            // Refresh to get updated members
            group = findById(group.getId()).orElse(group);
        }

        return group;
    }

    @Override
    public void addMember(Long groupId, User user) {
        Group group = Group.find.byId(groupId);
        if (group == null) throw new NoSuchElementException("Group with id " + groupId + " not found");

        group.addMember(user);  // remember not recursion, we are using the group model's method
        //check the parameter is user object
        group.save();
        logger.info("Member added: groupId={}, userId={}", groupId, user.getId());
    }

    @Override
    public void addMemberById(Long groupId, Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        addMember(groupId, user); // using the above Method
    }


    @Override
    public List<Expense> getExpenses(Long groupId) {
        Group group = Group.find.byId(groupId);
        if (group == null) throw new NoSuchElementException("Group with id " + groupId + " not found");
        return group.getExpenses();
    }

    @Override
    public List<Group> getGroupsForUser(Long userId) {
        if (userId == null) {
            logger.warn("userId is null in getGroupsForUser");
            return new java.util.ArrayList<>();
        }
        
        logger.debug("Fetching groups for userId={}", userId);
        
        try {
            // Query: Get all groups where the user is a member via the junction table
            List<Group> groups = Group.find.query()
                    .where()
                    .raw("id in (select user_groups_id from user_groups_users where users_id = ?)", userId)
                    .order("id desc")
                    .findList();
            
            logger.debug("Found {} groups for userId={}", groups.size(), userId);
            return groups;
        } catch (Exception e) {
            logger.error("Error fetching groups for userId={}: {}", userId, e.getMessage(), e);
            return new java.util.ArrayList<>();
        }
    }
}
