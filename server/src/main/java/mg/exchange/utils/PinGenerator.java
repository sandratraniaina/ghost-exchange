package mg.exchange.utils;

import java.util.Random;

public class PinGenerator {

    public static String generatePin(Long length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }

        Random random = new Random();
        StringBuilder pin = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int digit = random.nextInt(10); // Generates a random digit between 0 and 9
            pin.append(digit);
        }

        return pin.toString();
    }

}