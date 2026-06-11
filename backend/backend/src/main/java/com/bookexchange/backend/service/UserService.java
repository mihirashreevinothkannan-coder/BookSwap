package com.bookexchange.backend.service;

import com.bookexchange.backend.model.User;
import com.bookexchange.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user != null && encoder.matches(password, user.getPassword())) {
            return user;
        }

        throw new RuntimeException("Invalid credentials");
    }
}