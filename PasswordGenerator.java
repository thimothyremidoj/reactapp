import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("BCrypt Password Hashes:");
        System.out.println("admin123: " + encoder.encode("admin123"));
        System.out.println("user123: " + encoder.encode("user123"));
        
        // Test verification
        String hash = "$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyrdF.RoFGi";
        System.out.println("Verify admin123: " + encoder.matches("admin123", hash));
        System.out.println("Verify user123: " + encoder.matches("user123", hash));
    }
}