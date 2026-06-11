package com.bookexchange.backend.controller;

import com.bookexchange.backend.model.User;
import com.bookexchange.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {

        return userService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
    }
}