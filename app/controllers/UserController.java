package controllers;

import com.google.inject.Inject;
import dto.UserCreateRequestDTO;
import dto.UserDTO;
import mapper.UserMapper;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import security.RequestLoggingAction;
import security.SecuredAction;
import services.UserService;

import java.util.List;
import java.util.stream.Collectors;


@With({RequestLoggingAction.class, SecuredAction.class})
public class UserController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @Inject
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public Result getUsers() {
        List<UserDTO> users = userService.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
        logger.debug("Fetched {} users", users.size());
        return ok(Json.toJson(users));
    }

    public Result createUser(Http.Request request) {
        UserCreateRequestDTO dto = Json.fromJson(request.body().asJson(), UserCreateRequestDTO.class);
        logger.info("Creating user: name={}, email={}", dto.getName(), dto.getEmail());
        User user = userService.createUser(dto);
        logger.info("User created: userId={}, email={}", user.getId(), user.getEmail());
        return created(Json.toJson(UserMapper.toDTO(user)));
    }
}
