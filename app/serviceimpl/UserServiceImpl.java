package serviceimpl;

import dto.UserCreateRequestDTO;
import models.User;
import services.UserService;

import javax.inject.Singleton;

@Singleton
public class UserServiceImpl extends BaseServiceImpl<User, Long> implements UserService {

    public UserServiceImpl() {
        super(User.find);
    }


    //ideally create user shouldn't be there but since I want to show demo and replicating
    //splitwise model of connecting authenticated users using some link sharing
    //I felt was very difficult
    @Override
    public User createUser(UserCreateRequestDTO request) {
        String name = request.getName();
        String email = request.getEmail();
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty.");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty.");
        }
        email = email.trim();
        name = name.trim();

        // let us Check for duplicate email
        String finalEmail = email;
        if (findAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(finalEmail))) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
        //since i I am creating a dummy splitwise app, so I don't want to keep on creating
        //authenticated user and develop some link sharing system like actual splitwise
        //So I added option to create user here itself with blank password , so that we can see the
        //working of app
        User user = new User(name, email, ""); //empty password here , since it is a required field
        user.save();
        return user;
    }
}
