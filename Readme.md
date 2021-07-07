#URL
curl -u user:password http://localhost:8082/api/categories

#SQL
drop table databasechangelog;
drop table databasechangeloglock;

drop table products;
drop table categories;
drop table user_roles;
drop table rolesauthorities;
drop table users;
drop table roles;
drop table authorities;

drop sequence categories_seq;
drop sequence products_seq;
drop sequence roles_seq;
drop sequence users_seq;
drop sequence user_roles_seq;
drop sequence authorities_seq;
drop sequence rolesauthorities_seq;