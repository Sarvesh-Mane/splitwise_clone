package strategies;

import models.Split;
import models.User;

import java.util.ArrayList;
import java.util.List;

public class ExactSplitStrategy implements SplitStrategy {
    @Override
    public List<Split> calculateSplit(User paidBy, Double amount, List<User> participants, List<Double> values) {
        List<Split> splits = new ArrayList<>();
        Double sum = 0.0;
        for (Double v : values) {
            sum += v;
        }
        if (!sum.equals(amount)) {
            throw new IllegalArgumentException("Check values, they don't add up to the amount!");
        }
        for (int i = 0; i < participants.size(); i++) {
            if (participants.get(i).getId().equals(paidBy.getId())) {
                splits.add(new Split(participants.get(i), 0.0));
            } else
                splits.add(new Split(participants.get(i), values.get(i)));
        }
        return splits;
    }


}
