/* Replace with your SQL commands */

create table connection (
  id serial primary key,
  requestor text not null,
  target text not null,
  type text not null,
  unique(requestor, target, type),
  check (type = 'friend' or type='follow')
);

create index idx_friend_requestor on connection(requestor);
create index idx_friend_target on connection(target);

create table block_list (
  id serial primary key,
  blocker text not null,
  blockee text not null,
  unique(blocker, blockee)
);