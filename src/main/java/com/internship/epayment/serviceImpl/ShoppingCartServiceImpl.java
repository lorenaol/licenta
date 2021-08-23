package com.internship.epayment.serviceImpl;

import com.internship.epayment.entity.Authority;
import com.internship.epayment.entity.Product;
import com.internship.epayment.entity.ShoppingCart;
import com.internship.epayment.entity.UserRole;
import com.internship.epayment.repository.ShoppingCartRepository;
import com.internship.epayment.repository.UserRepository;
import com.internship.epayment.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ShoppingCart> getAll() {
        List<ShoppingCart> list = new ArrayList<>();
        shoppingCartRepository.findAll().forEach(list::add);
        return list;
    }

    @Override
    public ShoppingCart addShoppingCart(ShoppingCart shoppingCart) {
        return shoppingCartRepository.save(shoppingCart);
    }

    @Override
    public List<ShoppingCart> findByUserId(Long id) {
        return shoppingCartRepository.findShoppingCartsByUserId(id);
    }

    @Override
    public List<ShoppingCart> findByName(String name) {
        Long id = userRepository.findUserByName(name).get().getId();
       return shoppingCartRepository.findShoppingCartsByUserId(id);
    }


    @Override
    public ShoppingCart updateShoppingCart(ShoppingCart shoppingCart) {
        return shoppingCartRepository.save(shoppingCart);
    }

    @Override
    @Transactional
    public void deleteShoppingCart(ShoppingCart shoppingCart) {
        shoppingCartRepository.delete(shoppingCart);
    }
}
