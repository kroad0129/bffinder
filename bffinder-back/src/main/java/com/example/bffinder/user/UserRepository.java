package com.example.bffinder.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // 이메일 인증 토큰으로 조회 (이메일 인증 처리에 필요)
    Optional<User> findByEmailVerificationToken(String token);
}
