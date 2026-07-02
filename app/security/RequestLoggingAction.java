package security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import java.util.UUID;
import java.util.concurrent.CompletionStage;


public class RequestLoggingAction extends Action.Simple {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingAction.class);

    @Override
    public CompletionStage<Result> call(Http.Request request) {
        long startTime = System.currentTimeMillis();


        String requestId = UUID.randomUUID().toString().substring(0, 8);

        // Set MDC context for this request
        MDC.put("requestId", requestId);
        MDC.put("method", request.method());
        MDC.put("path", request.path());

        // Extract userId from Authorization header if present
        try {

            String header = request.header("Authorization").orElse(null);


            if (header != null && header.startsWith("Bearer")) {
                String token = header.substring(7);
                Long userId = JwtUtil.getUserId(token);
                MDC.put("userId", String.valueOf(userId));
            }
        } catch (Exception ignored) {
            // Token might be invalid — that's fine, securedAction will handle it
        }

        logger.info("Request started: {} {}", request.method(), request.path());


        return delegate.call(request).thenApply(result -> {
            long duration = System.currentTimeMillis() - startTime;
            logger.info("Request completed: {} {} -> {} ({}ms)", request.method(), request.path(), result.status(), duration);
            // Clean up the MDC after request
            MDC.clear();
            return result;
        });
    }
}
