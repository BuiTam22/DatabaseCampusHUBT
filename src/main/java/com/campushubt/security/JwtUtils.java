package com.campushubt.security;

import com.campushubt.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import jakarta.annotation.PostConstruct;
import java.util.Map;
import java.util.HashMap;
import org.springframework.security.core.userdetails.UserDetails;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        // Generate a secure key suitable for HS512
        key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("authorities", userDetails.getAuthorities());
        
        return createToken(claims, userDetails.getUsername());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        
        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            logger.error("Error getting username from token: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null) return false;
            
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }

    public String getUserIdFromJwtToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                logger.error("Token is null or empty");
                throw new IllegalArgumentException("Token cannot be null or empty");
            }

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userId = claims.getSubject();
            if (userId == null || userId.isEmpty()) {
                logger.error("User ID not found in token claims");
                throw new IllegalArgumentException("User ID not found in token");
            }

            return userId;
        } catch (Exception e) {
            logger.error("Error extracting user ID from token: {}", e.getMessage());
            throw new IllegalArgumentException("Error processing token: " + e.getMessage());
        }
    }

    public boolean validateJwtToken(String authToken) {
        if (authToken == null || authToken.isEmpty()) {
            logger.error("Token is null or empty");
            return false;
        }

        try {
            String token = authToken.replace("Bearer ", "");
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            // Check expiration
            if (claims.getExpiration() == null || claims.getExpiration().before(new Date())) {
                logger.error("Token is expired");
                return false;
            }

            // Validate user ID
            String subject = claims.getSubject();
            if (subject == null || subject.isEmpty()) {
                logger.error("Token has no subject (user ID)");
                return false;
            }

            try {
                Long userId = Long.parseLong(subject);
                if (userId <= 0) {
                    logger.error("Invalid user ID value in token: {}", userId);
                    return false;
                }
                logger.debug("Successfully validated token for user ID: {}", userId);
                return true;
            } catch (NumberFormatException e) {
                logger.error("Invalid user ID format in token: {}", subject);
                return false;
            }

        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token format: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Error validating JWT token: {}", e.getMessage());
        }
        
        return false;
    }
}