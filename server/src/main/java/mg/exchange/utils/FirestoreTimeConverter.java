package mg.exchange.utils;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import com.google.cloud.Timestamp;
import org.springframework.stereotype.Component;

@Component
public class FirestoreTimeConverter {
    public static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return LocalDateTime.ofInstant(timestamp.toDate().toInstant(), ZoneId.systemDefault());
    }

    public static Timestamp toTimestamp(LocalDateTime localDateTime) {
        return Timestamp.of(Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant()));
    }
}