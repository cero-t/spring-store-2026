package ninja.cero.store.stock.client;

import ninja.cero.store.stock.domain.Stock;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class StockClient {
    RestClient restClient;

    String baseUrl;

    ParameterizedTypeReference<List<Stock>> type = new ParameterizedTypeReference<>() {
    };

    public StockClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public List<Stock> findAll() {
        return restClient.get()
                .uri(baseUrl)
                .retrieve()
                .body(type);
    }

    public List<Stock> findByIds(Collection<Long> ids) {
        String idString = ids.stream().map(Object::toString).collect(Collectors.joining(","));
        return restClient.get()
                .uri(baseUrl + "/" + idString)
                .retrieve()
                .body(type);
    }

    public void keepStock(List<Stock> keeps) {
        restClient.post()
                .uri(baseUrl)
                .body(keeps)
                .retrieve()
                .toBodilessEntity();
    }
}
