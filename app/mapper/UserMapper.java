package mapper;

import dto.UserDTO;
import models.User;

//static becoz they are kind of utility functions and have no state of their own
public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }
}
