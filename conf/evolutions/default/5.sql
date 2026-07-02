# --- !Ups
alter table users
    add column password varchar(255);

# --- !Downs
alter table users drop column password;
