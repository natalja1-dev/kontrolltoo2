package ee.kontrolltoo.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
public class ShopsController {

    @GetMapping("shops")
    public Object getShops() {
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForObject(
                "https://jsonplaceholder.typicode.com/todos",
                Object.class
        );
    }
}