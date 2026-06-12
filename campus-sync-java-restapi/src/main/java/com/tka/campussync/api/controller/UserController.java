package com.tka.campussync.api.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tka.campussync.api.entity.User;
import com.tka.campussync.api.model.LoginRequest;
import com.tka.campussync.api.service.UserService;
import com.tka.campussync.api.security.JwtUtil;
import com.tka.campussync.api.security.MyUserDetailsService;

@RestController
@RequestMapping("/user")
@CrossOrigin("http://localhost:5173")
public class UserController {

	@Autowired
	private UserService service;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private MyUserDetailsService userDetailsService;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	// http://localhost:8091/user/login-user
	@PostMapping("/login-user")
	public Object loginUser(@RequestBody LoginRequest request) {
		System.out.println("Login Request: " + request);
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword().trim())
			);
		} catch (Exception e) {
			System.err.println("Authentication failed for " + request.getUsername() + ": " + e.getMessage());
			return null;
		}

		final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername().trim());
		final String jwt = jwtUtil.generateToken(userDetails);

		User user = service.getUserByName(request.getUsername().trim());
		if (user != null) {
			Map<String, Object> response = new HashMap<>();
			response.put("token", jwt);
			response.put("username", user.getUsername());
			response.put("role", user.getRole());
			response.put("firstName", user.getFirstName());
			response.put("lastName", user.getLastName());
			response.put("email", user.getEmail());
			return response;
		}
		return null;
	}

	@CrossOrigin(methods = RequestMethod.POST)
	@PostMapping("/register-user")
	public ResponseEntity<String> registerUser(@RequestBody User user) {
		if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
			user.setPassword(passwordEncoder.encode(user.getPassword().trim()));
		}
		User registerUser = service.registerUser(user);
		if (registerUser != null) {
			return new ResponseEntity<String>("Registered", HttpStatus.CREATED);
		} else {
			return new ResponseEntity<String>("Something Went Wrong", HttpStatus.OK);
		}
	}

	//localhost:8091/user/get-user-by-username/ram
	@GetMapping("/get-user-by-username/{username}")
	public User getUserById(@PathVariable String username) {
		return service.getUserByName(username);
	}

	@GetMapping("/get-all-user")
	public List<User> getAllUser() {
		return service.getAllUser();
	}
	
	@GetMapping("/get-all-admin")
	public List<User> getAllAdmins(){
		return service.getAllAdmins();
	}
	
	@GetMapping("/get-all-faculty")
	public List<User> getAllFaculties(){
		return service.getAllFaculties();
	}

	//localhost:8091/user/delete-user-by-username?username=ram
	@DeleteMapping("/delete-user-by-username")
	public String deleteUserById(@RequestParam String username) {
		return service.deleteUserById(username);
	}

	@PutMapping("/update-user")
	public User updateUser(@RequestBody User user) {
		if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
			user.setPassword(passwordEncoder.encode(user.getPassword().trim()));
		}
		return service.updateUser(user);
	}
}
