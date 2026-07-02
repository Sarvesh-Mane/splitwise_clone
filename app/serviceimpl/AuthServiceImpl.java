package serviceimpl;

import dto.AuthenticationDTOs.AuthResponseDTO;
import dto.AuthenticationDTOs.LoginRequestDTO;
import dto.AuthenticationDTOs.RegisterRequestDTO;
import dto.ChangePasswordRequestDTO;
import mapper.UserMapper;
import models.User;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import security.JwtUtil;
import services.AuthService;

import javax.inject.Singleton;
import java.util.NoSuchElementException;


@Singleton
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        logger.debug("Looking up user by email={}", request.getEmail());
        User user = User.find.query().where().eq("email", request.getEmail()).findOne();

        //search first if email is present or not
        if (user == null) {
            logger.warn("Login failed: no user found for email={}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        //check Password
        boolean valid = BCrypt.checkpw(request.getPassword(), user.getPassword());
        if (!valid) {
            logger.warn("Login failed: invalid password for email={}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
        String accessToken = JwtUtil.generateToken(user.getId(), user.getEmail());
        logger.info("JWT token generated for userId={}", user.getId());


        AuthResponseDTO authResponseDTO = new AuthResponseDTO(accessToken, "", UserMapper.toDTO(user));
        return authResponseDTO;

    }

    @Override
    public User register(RegisterRequestDTO request) {
        logger.debug("Checking if email already exists: email={}", request.getEmail());
        User existing = User.find.query().where().eq("email", request.getEmail()).findOne();
        if (existing != null) {
            logger.warn("Registration failed: email already exists email={}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        //saving the user to db

        User user = new User(request.getName(), request.getEmail(), hashedPassword);
        user.save();


        logger.info("User registered: userId={}, email={}", user.getId(), user.getEmail());

        return user;
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequestDTO request) {
        User user = User.find.byId(userId);
        if (user == null) throw new NoSuchElementException("User not found");

        // Verify current password
        if (!BCrypt.checkpw(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt()));
        user.save();

        logger.info("Password changed for userId={}", userId);
    }
}