package services;

import models.Settlement;

import java.util.List;

public interface SettlementService {
    List<Settlement> simplifySettlements(Long groupId);
}
