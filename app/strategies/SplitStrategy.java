package strategies;

import models.Split;
import models.User;

import java.util.List;

public interface SplitStrategy {
    List<Split> calculateSplit(User paidBy, Double amount, List<User> participants, List<Double> values);
}
