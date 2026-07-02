package security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

// Kept everything static because JwtUtil doesn't store any state
//It just provides us the functionalities(utility)
public class JwtUtil {
    private static final String SECRET = "splitwise-secret-key";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
    private static final long EXPIRATION_TIME = 1000L * 60 * 60; //1 hour time

    public static String generateToken(Long id, String email) {
        return JWT.create().withSubject(email).withClaim("id", id).withIssuedAt(new Date()).withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).sign(ALGORITHM);
    }

    public static DecodedJWT verifyToken(String token) {
        return JWT.require(ALGORITHM).build().verify(token);
    }

    public static Long getUserId(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        return decodedJWT.getClaim("id").asLong();
    }

    public static String getEmail(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        return decodedJWT.getSubject();
    }
}
