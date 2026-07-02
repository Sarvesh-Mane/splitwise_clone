package services;

import dto.AuthenticationDTOs.AuthResponseDTO;
import dto.AuthenticationDTOs.LoginRequestDTO;
import dto.AuthenticationDTOs.RegisterRequestDTO;
import dto.ChangePasswordRequestDTO;
import models.User;

public interface AuthService {
    User register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);

    void changePassword(Long userId, ChangePasswordRequestDTO request);
}

