package ninja.cero.store.payment.client;

import ninja.cero.store.payment.domain.Payment;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;

public class PaymentClient {
    RestClient restClient;

    String baseUrl;

    ParameterizedTypeReference<List<Payment>> type = new ParameterizedTypeReference<>() {
    };

    public PaymentClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public void check(Payment payment) {
        restClient.post()
                .uri(baseUrl + "/check")
                .body(payment)
                .retrieve()
                .toBodilessEntity();
    }

    public void processPayment(Payment payment) {
        restClient.post()
                .uri(baseUrl)
                .body(payment)
                .retrieve()
                .toBodilessEntity();
    }

    public List<Payment> findAll() {
        return restClient.get()
                .uri(baseUrl)
                .retrieve()
                .body(type);
    }
}
