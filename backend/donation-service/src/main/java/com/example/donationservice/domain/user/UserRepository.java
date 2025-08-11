package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.dto.UserInfoProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
  
    List<User> findByEmailIn(List<String> emails);
  
    List<User> findByIdIn(List<Long> userIds);
  
    @Query("""
    select 
        u.id as userId,
        u.email as email,
        u.username as username,
        u.nickName as nickName,
        u.profileImageUrl as profileImageUrl,
        u.userRole as userRole,
        u.points as points,
        t.name as teamName,
        coalesce(sum(d.point), 0) as totalDonationAmount,
        count(d) as donationCount
    from User u
    left join Team t on t.user.id = u.id
    left join Donation d on d.user.id = u.id
    where u.id = :userId
    group by u.id, u.email, u.username, u.nickName, u.userRole, u.points, t.name
    """)
    Optional<UserInfoProjection> findUserInfoById(@Param("userId") Long userId);
}
