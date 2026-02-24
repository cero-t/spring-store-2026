package ninja.cero.store.cart;

import io.micrometer.observation.ObservationRegistry;
import ninja.cero.store.item.client.ItemClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class CartConfig {
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
}
