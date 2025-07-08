package com.example.bffinder.boyfriends;

import com.example.bffinder.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uniq_userid_puuid",         // 인덱스 이름(원하는 대로)
                        columnNames = {"user_id", "puuid"}  // 유니크 제약 걸 조합
                )
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Boyfriend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String puuid;           // 롤 계정의 puuid

    @Column(nullable = false)
    private String alias;            // 별명

    @Column(nullable = false, updatable = false)
    private LocalDateTime savedAt;  // 저장 시각

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
