import com.google.inject.AbstractModule;
import serviceimpl.*;
import services.*;

public class Module extends AbstractModule {

    @Override
    protected void configure() {
        bind(UserService.class).to(UserServiceImpl.class);
        bind(GroupService.class).to(GroupServiceImpl.class);
        bind(ExpenseService.class).to(ExpenseServiceImpl.class);
        bind(GroupBalanceService.class).to(GroupBalanceServiceImpl.class);
        bind(SettlementService.class).to(SettlementServiceImpl.class);
        bind(AuthService.class).to(AuthServiceImpl.class);
        bind(InvitationService.class).to(InvitationServiceImpl.class);
        bind(DashboardService.class).to(DashboardServiceImpl.class);
    }
}
