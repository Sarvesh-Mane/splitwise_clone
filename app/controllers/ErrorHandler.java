package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.http.HttpErrorHandler;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;

import javax.inject.Singleton;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

@Singleton
public class  ErrorHandler implements HttpErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

    @Override
    public CompletionStage<Result> onClientError(Http.RequestHeader request, int statusCode, String message) {
        logger.warn("Client error: {} {} -> status={}, message={}",
                request.method(), request.path(), statusCode, message);
        ObjectNode json = Json.newObject();
        json.put("error", message);
        json.put("status", statusCode);
        return CompletableFuture.completedFuture(Results.status(statusCode, Json.toJson(json)));
    }

    @Override
    public CompletionStage<Result> onServerError(Http.RequestHeader request, Throwable exception) {
        // Unwrap CompletionException if needed
        Throwable cause = exception;
        if (exception.getCause() != null) {
            cause = exception.getCause();
        }

        ObjectNode json = Json.newObject();
        json.put("error", cause.getMessage());

        if (cause instanceof IllegalArgumentException) {
            logger.warn("Bad request: {} {} - {}", request.method(), request.path(), cause.getMessage());
            return CompletableFuture.completedFuture(Results.badRequest(Json.toJson(json)));
        }

        if (cause instanceof NoSuchElementException) {
            logger.warn("Not found: {} {} - {}", request.method(), request.path(), cause.getMessage());
            return CompletableFuture.completedFuture(Results.notFound(Json.toJson(json)));
        }

        logger.error("Internal server error: {} {} - {}", request.method(), request.path(), cause.getMessage(), cause);
        json.put("error", "Internal server error");
        return CompletableFuture.completedFuture(Results.internalServerError(Json.toJson(json)));
    }
}
