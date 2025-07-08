package com.example.bffinder.boyfriends;

import com.example.bffinder.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BoyfriendRepository extends JpaRepository<Boyfriend, Long> {
    List<Boyfriend> findAllByUser(User user);
    boolean existsByUserAndPuuid(User user, String puuid);
    long countByUser(User user);
    Optional<Boyfriend> findByIdAndUser(Long id, User user);
}
