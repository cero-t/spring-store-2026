package ninja.cero.store.cart.client;

import ninja.cero.store.cart.domain.CartDetail;
import ninja.cero.store.cart.domain.CartEvent;
import ninja.cero.store.cart.domain.CartOverview;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;

public class CartClient {
    RestClient restClient;

    String baseUrl;

    ParameterizedTypeReference<List<CartOverview>> type = new ParameterizedTypeReference<>() {
    };

    public CartClient(RestClient restClient, String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public List<CartOverview> findAll() {
        return restClient.get()
                .uri(baseUrl)
                .retrieve()
                .body(type);
    }

    public CartOverview findCartById(String cartId) {
        return restClient.get()
                .uri(baseUrl + "/" + cartId)
                .retrieve()
                .body(CartOverview.class);
    }

    public CartDetail findCartDetailById(String cartId) {
        return restClient.get()
                .uri(baseUrl + "/" + cartId + "/detail")
                .retrieve()
                .body(CartDetail.class);
    }

    public CartOverview createCart() {
        return restClient.post()
                .uri(baseUrl)
                .retrieve()
                .body(CartOverview.class);
    }

    public CartOverview addItem(String cartId, CartEvent cartEvent) {
        return restClient.post()
                .uri(baseUrl + "/" + cartId)
                .body(cartEvent)
                .retrieve()
                .body(CartOverview.class);
    }

    public void removeItem(String cartId, Long itemId) {
        restClient.delete()
                .uri(baseUrl + "/" + cartId + "/" + "items" + "/" + itemId)
                .retrieve()
                .toBodilessEntity();
    }
}
