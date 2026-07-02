# --- !Ups

create unique index idx_users_email on users (email);

create index idx_expenses_group_id on expenses (group_id);

create index idx_group_balances_group_id on group_balances (group_id);

create index idx_group_balances_group_creditor_debtor on group_balances (group_id, creditor_id, debtor_id);

create index idx_splits_expense_id on splits (expense_id);

create index idx_expenses_paid_by_id on expenses (paid_by_id);

create index idx_splits_user_id on splits (user_id);

create index idx_group_balances_debtor_id on group_balances (debtor_id);

create index idx_group_balances_creditor_id on group_balances (creditor_id);

create index idx_user_groups_users_user_id on user_groups_users (users_id);

# --- !Downs

drop index idx_users_email on users;

drop index idx_expenses_group_id on expenses;

drop index idx_group_balances_group_id on group_balances;

drop index idx_group_balances_group_creditor_debtor on group_balances;

drop index idx_splits_expense_id on splits;

drop index idx_expenses_paid_by_id on expenses;

drop index idx_splits_user_id on splits;

drop index idx_group_balances_debtor_id on group_balances;

drop index idx_group_balances_creditor_id on group_balances;

drop index idx_user_groups_users_user_id on user_groups_users;