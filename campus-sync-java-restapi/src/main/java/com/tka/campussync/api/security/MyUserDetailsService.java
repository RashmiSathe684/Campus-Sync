package com.tka.campussync.api.security;

import com.tka.campussync.api.dao.UserDao;
import com.tka.campussync.api.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

import org.springframework.context.annotation.Lazy;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    @Lazy
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.getUserByName(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Construct simple authority based on user role (e.g., ROLE_ADMIN, ROLE_FACULTY)
        String roleName = user.getRole();
        if (roleName != null) {
            roleName = roleName.toUpperCase();
            if (!roleName.startsWith("ROLE_")) {
                roleName = "ROLE_" + roleName;
            }
        } else {
            roleName = "ROLE_USER";
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }
}
