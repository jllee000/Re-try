package com.retry.retrybackend.controller.home;

import com.retry.retrybackend.entity.User;
import com.retry.retrybackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.retry.retrybackend.config.JwtUtil;
import com.retry.retrybackend.controller.home.dto.AuthResponse;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class HomeController {
    @Autowired
    private UserRepository userRepository;

    public HomeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ 루트 테스트용 엔드포인트
    @GetMapping("/")
    public String home() {
        return "Hello, Re:Try backend is running! 🚀";
    }

    // ✅ 유저 생성 API
    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestParam String name) {
        Optional<User> existingUser = userRepository.findByName(name);

        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setName(name);
            userRepository.save(user);
        }

        // JWT 발급
        String token = JwtUtil.generateToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(user, token));
    }


    // ✅ 유저 전체 조회
    @GetMapping("/user")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

}
