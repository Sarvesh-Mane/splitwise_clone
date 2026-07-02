# --- !Ups
create table users
(
    id    bigint auto_increment not null,
    name  varchar(255),
    email varchar(255),
    constraint pk_users primary key (id)
);

create table user_groups
(
    id   bigint auto_increment not null,
    name varchar(255),
    constraint pk_user_groups primary key (id)
);

create table user_groups_users
(
    user_groups_id bigint not null,
    users_id       bigint not null,
    constraint pk_user_groups_users primary key (user_groups_id, users_id),
    constraint fk_user_groups_users_group foreign key (user_groups_id) references user_groups (id),
    constraint fk_user_groups_users_user foreign key (users_id) references users (id)
);


# --- !Downs

drop table if exists user_groups_users;

drop table if exists user_groups;

drop table if exists users;
