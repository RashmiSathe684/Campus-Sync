package com.tka.campussync.api.config;

import com.tka.campussync.api.dao.UserDao;
import com.tka.campussync.api.dao.SubjectDao;
import com.tka.campussync.api.dao.StudentDao;
import com.tka.campussync.api.entity.User;
import com.tka.campussync.api.entity.Subject;
import com.tka.campussync.api.entity.Student;
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
    private SubjectDao subjectDao;

    @Autowired
    private StudentDao studentDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running database initialization and password BCrypt check...");
        try {
            // 1. Seed Users
            List<User> users = userDao.getAllUser();
            if (users == null || users.isEmpty()) {
                System.out.println("No users found. Seeding default database users...");
                
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@example.com");
                admin.setRole("admin");
                userDao.registerUser(admin);
                
                User faculty = new User();
                faculty.setUsername("faculty");
                faculty.setPassword(passwordEncoder.encode("admin123"));
                faculty.setFirstName("Faculty");
                faculty.setLastName("User");
                faculty.setEmail("faculty@example.com");
                faculty.setRole("faculty");
                userDao.registerUser(faculty);
                
                System.out.println("Default users successfully seeded.");
            } else {
                // Perform password migration to BCrypt for any plain-text passwords
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

            // 2. Seed Subjects
            List<Subject> subjects = subjectDao.getAllSubjects();
            if (subjects == null || subjects.isEmpty()) {
                System.out.println("No subjects found. Seeding default subjects...");
                
                String[] defaultSubjects = {"Java Programming", "Database Management", "Web Development", "Operating Systems"};
                for (String name : defaultSubjects) {
                    Subject subject = new Subject();
                    subject.setName(name);
                    subjectDao.createSubject(subject);
                }
                System.out.println("Default subjects successfully seeded.");
            }

            // 3. Seed Students
            List<Student> students = studentDao.getAllStudents();
            if (students == null || students.isEmpty()) {
                System.out.println("No students found. Seeding default students...");
                
                String[][] defaultStudents = {
                    {"Rahul Sharma", "rahul.sharma@example.com"},
                    {"Aishwarya Patil", "aishwarya.patil@example.com"},
                    {"Amit Verma", "amit.verma@example.com"},
                    {"Pooja Joshi", "pooja.joshi@example.com"},
                    {"Vikram Singh", "vikram.singh@example.com"}
                };
                for (String[] data : defaultStudents) {
                    Student student = new Student();
                    student.setName(data[0]);
                    student.setEmail(data[1]);
                    studentDao.createStudent(student);
                }
                System.out.println("Default students successfully seeded.");
            }

        } catch (Exception e) {
            System.err.println("Error running database initialization/migration: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

