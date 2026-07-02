package mapper;

import dto.SettlementDTO;
import dto.UserDTO;
import models.Settlement;

//static becoz they are kind of utility functions and have no state of their own
public class SettlementMapper {
    public static SettlementDTO toDTO(Settlement settlement) {
        UserDTO from = UserMapper.toDTO(settlement.getFrom());
        UserDTO to = UserMapper.toDTO(settlement.getTo());
        return new SettlementDTO(from, to, settlement.getAmount());
    }
}
