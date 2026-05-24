package ee.kontrolltoo.backend.controller;

import ee.kontrolltoo.backend.entity.Product;
import ee.kontrolltoo.backend.repository.ProductRepository;
import ee.kontrolltoo.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    @GetMapping("products")
    public Page<Product> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable
    ) {
        if (search == null) {
            search = "";
        }

        if (category == null || category.equals("all")) {
            category = "";
        }

        return productRepository.findByTitleContainingIgnoreCaseAndCategoryContainingIgnoreCase(search, category, pageable);
    }

    @PostMapping("products")
    public Product addProduct(@RequestBody Product product) {
        if (product.getId() != null) {
            throw new RuntimeException("Cannot add product with id");
        }
        if (product.getPrice() < 0) {
            throw new RuntimeException("Product price cannot be negative");
        }

        productService.validate(product);
        return productRepository.save(product);
    }

    @PutMapping("products")
    public Product editProduct(@RequestBody Product product) {
        if (product.getId() == null) {
            throw new RuntimeException("Cannot add product without id");
        }
        productService.validate(product);
        return productRepository.save(product);
    }

    @DeleteMapping("products/{id}")
    public List<Product> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return productRepository.findAll();
    }

    @GetMapping("products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow();
    }
}
