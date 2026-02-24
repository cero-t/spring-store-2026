package ninja.cero.store.order.client;

import ninja.cero.store.order.domain.OrderProcess;
import org.springframework.web.client.RestClient;

public class OrderProcessClient {
    RestClient restClient;

    String baseUrl;

    public OrderProcessClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public void processOrder(OrderProcess order) {
        restClient.post()
                .uri(baseUrl)
                .body(order)
                .retrieve()
                .toBodilessEntity();
    }
}
