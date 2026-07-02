# --- !Ups
create table expenses
(
    id           bigint auto_increment not null,
    group_id     bigint,
    expense_name varchar(255),
    paid_by_id   bigint,
    amount double,
    split_type   varchar(20),
    constraint pk_expenses primary key (id),
    constraint fk_expenses_group foreign key (group_id) references user_groups (id),
    constraint fk_expenses_paid_by foreign key (paid_by_id) references users (id)
);

create table splits
(
    id         bigint auto_increment not null,
    expense_id bigint,
    user_id    bigint,
    amount double,
    constraint pk_splits primary key (id),
    constraint fk_splits_expense foreign key (expense_id) references expenses (id),
    constraint fk_splits_user foreign key (user_id) references users (id)
);


# --- !Downs

drop table if exists splits;

drop table if exists expenses;
