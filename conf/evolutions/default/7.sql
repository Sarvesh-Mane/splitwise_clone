# --- !Ups

create table group_invitations
(
    id            bigint auto_increment not null,
    group_id      bigint       not null,
    inviter_id    bigint       not null,
    invitee_id    bigint,
    invitee_email varchar(255) not null,
    status        varchar(20)  not null default 'PENDING',
    created_at    datetime(6) not null default current_timestamp(6),
    constraint pk_group_invitations primary key (id),
    constraint fk_gi_group foreign key (group_id) references user_groups (id),
    constraint fk_gi_inviter foreign key (inviter_id) references users (id),
    constraint fk_gi_invitee foreign key (invitee_id) references users (id)

);

create index idx_gi_invitee_email on group_invitations (invitee_email);
create index idx_gi_group_id on group_invitations (group_id);
create index idx_gi_invitee_id on group_invitations (invitee_id);

# --- !Downs

drop table if exists group_invitations;