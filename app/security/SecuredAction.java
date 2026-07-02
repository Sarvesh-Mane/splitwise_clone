package security;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;


//applied middleware concept of playframework
public class SecuredAction extends Action.Simple {

    private static final Logger logger = LoggerFactory.getLogger(SecuredAction.class);

    @Override
    public CompletionStage<Result> call(Http.Request request) {

        // Security check
        String header = request.header("Authorization").orElse(null);
        if (header == null || !header.startsWith("Bearer")) {

            //logging the error - missing header
            logger.warn("Auth failed: missing or invalid Authorization header for {} {}", request.method(), request.path());
            ObjectNode error = Json.newObject();

            error.put("error", "Missing or invalid Authorization header");
            return CompletableFuture.completedFuture(unauthorized(error));
        }
        //first 6 char is bearer so our token begins from index 7

        String token = header.substring(7);
        // implementing try catch to verify the token
        try {
            JwtUtil.verifyToken(token);
        } catch (Exception e) {

            // logging the error - invalid or expired token
            logger.warn("Auth failed: invalid or expired token for {} {} - {}", request.method(), request.path(), e.getMessage());
            ObjectNode error = Json.newObject();

            error.put("error", "Invalid or expired token");
            return CompletableFuture.completedFuture(unauthorized(error));
        }

        Long userId = JwtUtil.getUserId(token);
        User user = User.find.byId(userId);

        if (user == null) {
            //logging - user not found
            logger.warn("Auth failed: user not found for userId={}", userId);
            ObjectNode error = Json.newObject();

            error.put("error", "User not found");
            return CompletableFuture.completedFuture(unauthorized(error));
        }

        logger.debug("Auth successful: userId={}, email={}", user.getId(), user.getEmail());


        //here we add the attribute that the user is authenticated
        //avoiding code duplicaton
        Http.Request authenticatedRequest = request.addAttr(AuthAttributes.USER, user);


        return delegate.call(authenticatedRequest);

    }

}