# --- !Ups
create table group_balances
(
    id          bigint auto_increment not null,
    group_id    bigint,
    debtor_id   bigint,
    creditor_id bigint,
    amount double,
    constraint pk_group_balances primary key (id),
    constraint fk_group_balances_group foreign key (group_id) references user_groups (id),
    constraint fk_group_balances_debtor foreign key (debtor_id) references users (id),
    constraint fk_group_balances_creditor foreign key (creditor_id) references users (id)
);


# --- !Downs

drop table if exists group_balances;