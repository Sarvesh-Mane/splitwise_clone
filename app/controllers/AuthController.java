package controllers;

import com.google.inject.Inject;
import dto.AuthenticationDTOs.AuthResponseDTO;
import dto.AuthenticationDTOs.LoginRequestDTO;
import dto.AuthenticationDTOs.RegisterRequestDTO;
import dto.ChangePasswordRequestDTO;
import mapper.UserMapper;
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
import services.AuthService;


public class AuthController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    @Inject
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @With(RequestLoggingAction.class)
    public Result register(Http.Request request) {
        //convert to DTO
        RegisterRequestDTO requestDTO = Json.fromJson(request.body().asJson(), RegisterRequestDTO.class);
        logger.info("Registration attempt for email={}", requestDTO.getEmail());
        User user = authService.register(requestDTO);
        logger.info("Registration successful: userId={}, email={}", user.getId(), user.getEmail());
        return created(Json.toJson(user));
    }

    @With(RequestLoggingAction.class)
    public Result login(Http.Request request) {
        //convert to DTO
        LoginRequestDTO requestDTO = Json.fromJson(request.body().asJson(), LoginRequestDTO.class);

        logger.info("Login attempt for email={}", requestDTO.getEmail());

        AuthResponseDTO response = authService.login(requestDTO);
        logger.info("Login successful for email={}", requestDTO.getEmail());
        return ok(Json.toJson(response));
    }

    @With({RequestLoggingAction.class, SecuredAction.class})
    public Result me(Http.Request request) {
        //we don't need to validate here because we are using SecuredAction,
        // so the user will be authenticated anf have the authenticated User aattribute
        User user = request.attrs().get(AuthAttributes.USER);

        logger.debug("Fetching profile for userId={}", user.getId());
        //we are returning the user data
        return ok(Json.toJson(UserMapper.toDTO(user)));
    }

    @With({RequestLoggingAction.class, SecuredAction.class})
    public Result changePassword(Http.Request request) {
        User user = request.attrs().get(AuthAttributes.USER);
        ChangePasswordRequestDTO dto = Json.fromJson(request.body().asJson(), ChangePasswordRequestDTO.class);

        logger.info("Password change attempt for userId={}", user.getId());
        authService.changePassword(user.getId(), dto);
        logger.info("Password changed successfully for userId={}", user.getId());
        return ok(Json.toJson("Password changed successfully"));
    }
}

