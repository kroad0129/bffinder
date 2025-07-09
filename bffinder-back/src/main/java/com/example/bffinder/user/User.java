package com.example.bffinder.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER"; // 기본값 USER

    @Column(nullable = false)
    @Builder.Default
    private boolean isEmailVerified = false; // 기본값 false

    // 이메일 인증용 토큰(랜덤 UUID 등)
    @Column(length = 100)
    private String emailVerificationToken;

    // 토큰 만료 시간 (예: 30분)
    private LocalDateTime tokenExpiry;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
