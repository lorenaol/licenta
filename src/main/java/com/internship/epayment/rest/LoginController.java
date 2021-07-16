package com.internship.epayment.rest;

import com.internship.epayment.entity.User;
import com.internship.epayment.service.UserService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/login")
public class LoginController {

    @Autowired
    UserService userService;

    @GetMapping
    public User login () throws NotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
            System.out.println(currentUserName);
        return userService.findByName(currentUserName);
    }
}


