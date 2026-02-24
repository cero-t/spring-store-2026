package ninja.cero.store.order.client;

import ninja.cero.store.order.domain.OrderEvent;
import ninja.cero.store.order.domain.OrderRequest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;

public class OrderClient {
    RestClient restClient;

    String baseUrl;

    ParameterizedTypeReference<List<OrderEvent>> type = new ParameterizedTypeReference<>() {
    };

    public OrderClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public void createOrder(OrderRequest order) {
        restClient.post()
                .uri(baseUrl)
                .body(order)
                .retrieve()
                .toBodilessEntity();
    }

    public void createEvent(OrderEvent orderEvent) {
        restClient.post()
                .uri(baseUrl + "/" + orderEvent.orderId() + "/event")
                .body(orderEvent)
                .retrieve()
                .toBodilessEntity();
    }

    public List<OrderEvent> findAllEvents() {
        return restClient.get()
                .uri(baseUrl + "/events")
                .retrieve()
                .body(type);
    }
}
