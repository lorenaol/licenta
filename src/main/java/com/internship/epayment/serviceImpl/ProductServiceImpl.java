package com.internship.epayment.serviceImpl;

import com.internship.epayment.entity.Product;
import com.internship.epayment.repository.ProductRepository;
import com.internship.epayment.service.ProductService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getAll() {
        List<Product> list = new ArrayList<Product>();
        productRepository.findAll().forEach(list::add);
        return list;
    }

    @Override
    public Product findById(Long id) throws NotFoundException {
        return productRepository.findById(id).orElseThrow(() -> new NotFoundException("Nu exista!"));
    }

    @Override
    public List<Product> findByCode(String code) {
        return productRepository.findProductsByCode(code);
    }

    @Override
    public List<Product> findBySku(String sku) {
        return productRepository.findProductsBySku(sku);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> findByName(String name) {
        return productRepository.findProductsByName(name);
    }

    @Override
    public void deleteProduct(Product product) {
        productRepository.delete(product);
    }
}