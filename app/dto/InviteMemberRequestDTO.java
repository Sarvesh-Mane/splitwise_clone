package dto;

public class InviteMemberRequestDTO {
    private String email;

    public InviteMemberRequestDTO() {
    }

    public InviteMemberRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
