package ninja.cero.store.store;

import io.micrometer.observation.ObservationRegistry;
import ninja.cero.store.cart.client.CartClient;
import ninja.cero.store.item.client.ItemClient;
import ninja.cero.store.order.client.OrderClient;
import ninja.cero.store.stock.client.StockClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class StoreConfig {
    @Bean
    RestClient restClient(ObservationRegistry observationRegistry) {
        return RestClient.builder()
                .observationRegistry(observationRegistry)
                .build();
    }

    @Bean
    ItemClient itemClient(RestClient restClient, @Value("${store.urls.item}") String baseUrl) {
        return new ItemClient(restClient, baseUrl);
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
    OrderClient orderClient(RestClient restClient, @Value("${store.urls.order}") String baseUrl) {
        return new OrderClient(restClient, baseUrl);
    }
}
