package com.tka.campussync.api.config;

import com.tka.campussync.api.dao.UserDao;
import com.tka.campussync.api.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrationRunner implements CommandLineRunner {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running password BCrypt migration check...");
        try {
            List<User> users = userDao.getAllUser();
            if (users != null) {
                int migratedCount = 0;
                for (User user : users) {
                    String password = user.getPassword();
                    if (password != null && !password.trim().isEmpty() && !password.startsWith("$2a$")) {
                        String hashedPassword = passwordEncoder.encode(password.trim());
                        user.setPassword(hashedPassword);
                        userDao.updateUser(user);
                        migratedCount++;
                        System.out.println("Migrated password for user: " + user.getUsername());
                    }
                }
                if (migratedCount > 0) {
                    System.out.println("Successfully migrated " + migratedCount + " plain-text user passwords to BCrypt hashes.");
                } else {
                    System.out.println("No plain-text passwords found. Database is already secured.");
                }
            }
        } catch (Exception e) {
            System.err.println("Error running password migration: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
