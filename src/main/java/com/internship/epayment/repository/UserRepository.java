package com.internship.epayment.repository;

import com.internship.epayment.entity.Role;
import com.internship.epayment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long>, JpaRepository<User, Long> {
    Optional<User> findUserByName(String name);

    User findUserByEmail(String email);
}
