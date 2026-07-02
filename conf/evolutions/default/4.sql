# --- !Ups
alter table expenses
    add column category varchar(30) default 'OTHER';

# --- !Downs
alter table expenses drop column category;
