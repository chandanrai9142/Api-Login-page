
package com.example.Api.service;

import com.example.Api.dto.AuthResponse;
import com.example.Api.dto.ApiResponse;
import com.example.Api.dto.LoginRequest;
import com.example.Api.dto.RegisterRequest;
import com.example.Api.entity.User;
import com.example.Api.repository.UserRepository;
import com.example.Api.security.JwtService;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                "Email is already registered"
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException(
                "Passwords do not match"
            );
        }

        User user = new User(
            request.getName(),
            request.getEmail(),
            request.getPhoneNumber(),
            passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return new ApiResponse(true, "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userResult = request.getEmail() != null
                && !request.getEmail().isBlank()
            ? userRepository.findByEmail(request.getEmail())
            : request.getPhoneNumber() != null
                && !request.getPhoneNumber().isBlank()
            ? userRepository.findByPhoneNumber(request.getPhoneNumber())
            : Optional.empty();

        User user = userResult
            .orElseThrow(() -> new IllegalArgumentException(
                "Invalid email or password"
            ));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException(
                "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                true,
                "Login successful",
                token,
                "Bearer");
    }
}
