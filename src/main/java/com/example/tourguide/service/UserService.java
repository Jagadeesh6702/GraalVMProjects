package com.example.tourguide.service;

import com.example.tourguide.model.User;
import com.example.tourguide.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User registerUser(User user) {
        return repo.save(user);
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email);
    }
}
