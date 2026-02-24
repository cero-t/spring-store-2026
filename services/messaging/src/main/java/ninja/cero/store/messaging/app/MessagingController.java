package ninja.cero.store.messaging.app;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageBuilderSupport;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Queue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
public class MessagingController {
    AmqpTemplate amqpTemplate;

    Queue queue;

    public MessagingController(AmqpTemplate amqpTemplate, Queue queue) {
        this.amqpTemplate = amqpTemplate;
        this.queue = queue;
    }

    @PostMapping(value = {"/{type}"})
    public void request(@PathVariable String type, @RequestBody String body) {
        MessageBuilderSupport<Message> builder = MessageBuilder.withBody(body.getBytes(StandardCharsets.UTF_8))
                .setContentType(MessageProperties.CONTENT_TYPE_JSON)
                .setHeader("type", type);
        Message message = builder.build();
        amqpTemplate.send("", queue.getName(), message);
    }
}
