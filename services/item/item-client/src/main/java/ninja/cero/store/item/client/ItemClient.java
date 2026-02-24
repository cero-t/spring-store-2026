package ninja.cero.store.item.client;

import ninja.cero.store.item.domain.Item;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class ItemClient {
    RestClient restClient;

    String baseUrl;

    ParameterizedTypeReference<List<Item>> type = new ParameterizedTypeReference<>() {
    };

    public ItemClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public List<Item> findAll() {
        return restClient.get()
                .uri(baseUrl)
                .retrieve()
                .body(type);
    }

    public List<Item> findByIds(Collection<Long> ids) {
        String idString = ids.stream().map(Object::toString)
                .collect(Collectors.joining(","));
        return restClient.get()
                .uri(baseUrl + "/" + idString)
                .retrieve()
                .body(type);
    }
}
