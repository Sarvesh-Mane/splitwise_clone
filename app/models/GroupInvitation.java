package models;


import enums.InvitationStatus;
import io.ebean.Finder;
import io.ebean.annotation.WhenCreated;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "group_invitations")
public class GroupInvitation extends BaseModel {
    public static final Finder<Long, GroupInvitation> find = new Finder<>(GroupInvitation.class);

    @ManyToOne
    private Group group;
    @ManyToOne
    private User inviter;
    @ManyToOne
    private User invitee;  // nullable — user may not exist yet

    private String inviteeEmail;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status = InvitationStatus.PENDING;

    @WhenCreated
    private Timestamp createdAt;

    public GroupInvitation() {
    }

    public GroupInvitation(Group group, User inviter, User invitee, String inviteeEmail) {
        this.group = group;
        this.inviter = inviter;
        this.invitee = invitee;
        this.inviteeEmail = inviteeEmail;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getInviter() {
        return inviter;
    }

    public void setInviter(User inviter) {
        this.inviter = inviter;
    }

    public User getInvitee() {
        return invitee;
    }

    public void setInvitee(User invitee) {
        this.invitee = invitee;
    }

    public String getInviteeEmail() {
        return inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
