package mg.exchange.utils;

import java.util.Map;

public interface FirestoreSyncable {
    Map<String, Object> toFirestoreMap();

    String getFirestoreCollectionName();
}