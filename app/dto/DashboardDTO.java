package dto;

import java.util.List;

public class DashboardDTO {
    private List<GroupDTO> myGroups;
    private List<GroupInvitationDTO> pendingInvitations;
    private List<BalanceSummaryDTO> balances;

    public DashboardDTO() {
    }

    public DashboardDTO(List<GroupDTO> myGroups, List<GroupInvitationDTO> pendingInvitations, List<BalanceSummaryDTO> balances) {
        this.myGroups = myGroups;
        this.pendingInvitations = pendingInvitations;
        this.balances = balances;
    }

    public List<GroupDTO> getMyGroups() {
        return myGroups;
    }

    public void setMyGroups(List<GroupDTO> myGroups) {
        this.myGroups = myGroups;
    }

    public List<GroupInvitationDTO> getPendingInvitations() {
        return pendingInvitations;
    }

    public void setPendingInvitations(List<GroupInvitationDTO> pendingInvitations) {
        this.pendingInvitations = pendingInvitations;
    }

    public List<BalanceSummaryDTO> getBalances() {
        return balances;
    }

    public void setBalances(List<BalanceSummaryDTO> balances) {
        this.balances = balances;
    }


}
