package strategies;

import models.Split;
import models.User;

import java.util.ArrayList;
import java.util.List;

public class EqualSplitStrategy implements SplitStrategy {
    @Override
    public List<Split> calculateSplit(User paidBy, Double amount, List<User> participants, List<Double> values) {
        Double splitAmount = amount / participants.size();
        List<Split> splits = new ArrayList<>();

        for (User participant : participants) {
            if (participant.equals(paidBy)) {
                splits.add(new Split(participant, 0.0));
            } else
                splits.add(new Split(participant, splitAmount));
        }
        return splits;
    }
}
