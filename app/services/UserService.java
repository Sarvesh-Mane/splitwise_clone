package services;

import dto.UserCreateRequestDTO;
import models.User;

public interface UserService extends BaseService<User, Long> {

    User createUser(UserCreateRequestDTO request);
}
