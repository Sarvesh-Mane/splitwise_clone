package controllers;

import com.google.inject.Inject;
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
import services.DashboardService;

@With({RequestLoggingAction.class, SecuredAction.class})
public class DashboardController extends Controller {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    private final DashboardService dashboardService;

    @Inject
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    public Result getDashboard(Http.Request request) {
        User currentUser = request.attrs().get(AuthAttributes.USER);
        logger.debug("Fetching dashboard for userId={}", currentUser.getId());
        return ok(Json.toJson(dashboardService.getDashboard(currentUser.getId())));
    }
}
