package dto.AuthenticationDTOs;

import dto.UserDTO;

public class AuthResponseDTO {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String accessToken, String refreshToken, UserDTO user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public UserDTO getUser() {
        return user;
    }

}
