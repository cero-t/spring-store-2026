package ninja.cero.store.order;

import io.micrometer.observation.ObservationRegistry;
import ninja.cero.store.cart.client.CartClient;
import ninja.cero.store.order.client.OrderProcessClient;
import ninja.cero.store.payment.client.PaymentClient;
import ninja.cero.store.stock.client.StockClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class OrderConfig {
    @Bean
    RestClient restClient(ObservationRegistry observationRegistry) {
        return RestClient.builder()
                .observationRegistry(observationRegistry)
                .build();
    }

    @Bean
    StockClient stockClient(RestClient restClient, @Value("${store.urls.stock}") String baseUrl) {
        return new StockClient(restClient, baseUrl);
    }

    @Bean
    CartClient cartClient(RestClient restClient, @Value("${store.urls.cart}") String baseUrl) {
        return new CartClient(restClient, baseUrl);
    }

    @Bean
    PaymentClient paymentClient(RestClient restClient, @Value("${store.urls.payment}") String baseUrl) {
        return new PaymentClient(restClient, baseUrl);
    }

    @Bean
    OrderProcessClient orderProcessClient(RestClient restClient, @Value("${store.urls.order-process}") String baseUrl) {
        return new OrderProcessClient(restClient, baseUrl);
    }
}
