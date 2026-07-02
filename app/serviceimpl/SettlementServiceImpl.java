package serviceimpl;

import models.GroupBalance;
import models.Settlement;
import models.User;
import models.UserBalance;
import services.GroupBalanceService;
import services.SettlementService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.*;

@Singleton
public class SettlementServiceImpl implements SettlementService {

    private final GroupBalanceService groupBalanceService;

    @Inject
    public SettlementServiceImpl(GroupBalanceService groupBalanceService) {
        this.groupBalanceService = groupBalanceService;
    }


    public List<Settlement> simplifySettlements(Long groupId) {
        List<GroupBalance> balances = groupBalanceService.getGroupBalances(groupId);

        Map<User, Double> netBalances = new HashMap<>();

        for (GroupBalance balance : balances) {
            User debtor = balance.getDebtor();
            User creditor = balance.getCreditor();
            Double amount = balance.getAmount();
            netBalances.put(debtor, netBalances.getOrDefault(debtor, 0.0) - amount);

            netBalances.put(creditor, netBalances.getOrDefault(creditor, 0.0) + amount);
        }


        PriorityQueue<UserBalance> creditors = new PriorityQueue<>((a, b) -> Double.compare(b.getAmount(), a.getAmount()));
        PriorityQueue<UserBalance> debtors = new PriorityQueue<>((a, b) -> Double.compare(b.getAmount(), a.getAmount()));

        for (User user : netBalances.keySet()) {
            Double amount = netBalances.get(user);
            if (amount < 0) {
                debtors.offer(new UserBalance(user, -amount));
            } else if (amount > 0) {
                creditors.offer(new UserBalance(user, amount));

            }

        }
        List<Settlement> settlements = new ArrayList<>();

        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            UserBalance creditor = creditors.poll(); //poll for top element  like .top() stack in C++ or .front() in queue C++
            UserBalance debtor = debtors.poll();

            Double settlementAmount = Math.min(debtor.getAmount(), creditor.getAmount());  // min lena hai , humne already positive karke rakha hai debt amount
            settlements.add(new Settlement(debtor.getUser(), creditor.getUser(), settlementAmount));
            creditor.setAmount(creditor.getAmount() - settlementAmount);
            debtor.setAmount(debtor.getAmount() - settlementAmount);
            if (creditor.getAmount() > 0) {
                creditors.offer(creditor);
            }
            if (debtor.getAmount() > 0) {
                debtors.offer(debtor);
            }
        }
        return settlements;
    }
}
