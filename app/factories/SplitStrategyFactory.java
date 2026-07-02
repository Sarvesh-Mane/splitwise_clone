package factories;

import enums.SplitType;
import strategies.EqualSplitStrategy;
import strategies.ExactSplitStrategy;
import strategies.PercentageSplitStrategy;
import strategies.SplitStrategy;

public class SplitStrategyFactory {

    //yaha pe confusion tha ki how does a method return interface
    //cleared
    //When a method declares an interface as its return type,
    // it means the method will return an instance of any concrete class that
    // implements that specific interface.
    // You cannot instantiate the interface directly,
    // but you can pass back a real object underneath.

    // earlier was getting a red line under SplitStrategy but when I returned EqualSplitStrategy it got resolved.

    public static SplitStrategy getStrategy(SplitType splitType) {
        switch (splitType) {
            case EQUAL:
                return new EqualSplitStrategy();
            case EXACT:
                return new ExactSplitStrategy();
            case PERCENTAGE:
                return new PercentageSplitStrategy();
            default:
                throw new IllegalArgumentException("Invalid split type: " + splitType);
        }
    }
}
