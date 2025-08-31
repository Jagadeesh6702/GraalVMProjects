package com.example.tourguide.controller;
import com.example.tourguide.model.User;
import com.example.tourguide.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds, HttpSession session) {
        String email = creds.get("email");
        String password = creds.get("password");
        User user = service.findByEmail(email); 
        if (user != null && user.getPassword().equals(password)) {
            session.setAttribute("username", user.getUsername());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username != null) {
            return ResponseEntity.ok(Map.of("username", username));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
