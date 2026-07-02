package services;

import dto.DashboardDTO;

public interface DashboardService {
    DashboardDTO getDashboard(Long userId);
}
