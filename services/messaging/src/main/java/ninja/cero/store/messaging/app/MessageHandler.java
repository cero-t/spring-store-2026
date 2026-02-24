package ninja.cero.store.messaging.app;

import ninja.cero.store.messaging.StoreMessaging;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class MessageHandler {
    RestClient restClient;

    StoreMessaging storeMessaging;

    public MessageHandler(RestClient restClient, StoreMessaging storeMessaging) {
        this.restClient = restClient;
        this.storeMessaging = storeMessaging;
    }

    @RabbitListener(queues = "messaging")
    void listen(Message message) {
        try {
            String type = (String) message.getMessageProperties().getHeaders().get("type");
            List<String> destinations = storeMessaging.destinations().get(type);
            if (destinations == null || destinations.isEmpty()) {
                return;
            }
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);

            destinations.forEach(destination -> restClient.post()
                    .uri(destination)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity());
        } catch (RuntimeException ex) {
            // ignore
            ex.printStackTrace();
        }
    }
}
