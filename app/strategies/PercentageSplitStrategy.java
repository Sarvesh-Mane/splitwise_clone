package strategies;

import models.Split;
import models.User;

import java.util.ArrayList;
import java.util.List;

public class PercentageSplitStrategy implements SplitStrategy {
    @Override
    public List<Split> calculateSplit(User paidBy, Double amount, List<User> participants, List<Double> percentages) {
        List<Split> splits = new ArrayList<>();
        Double sum = 0.0;
        for (Double p : percentages) sum += p;
        if (!sum.equals(100.0)) {
            throw new IllegalArgumentException("Percentages must add up to 100");
        }
        for (int i = 0; i < participants.size(); i++) {
            splits.add(new Split(participants.get(i), amount * percentages.get(i) / 100));
        }
        return splits;
    }
}
