-- Prepared schema for a NEW, dedicated Antoni Tech project. Not applied yet.
-- No customer data or credentials belong in this file.
begin;
create table public.antoni_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(btrim(name)) between 2 and 60),
  audience text not null check (audience in ('client','visitor')),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(btrim(body)) between 20 and 1200),
  consent boolean not null check (consent is true),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create index antoni_reviews_published_date on public.antoni_reviews (created_at desc, id) where status = 'approved';
alter table public.antoni_reviews enable row level security;
revoke all on public.antoni_reviews from public, anon, authenticated;
grant select, insert, update, delete on public.antoni_reviews to service_role;

create table public.antoni_review_limits (
  scope text not null,
  day date not null,
  requests integer not null check (requests > 0),
  primary key (scope, day)
);
alter table public.antoni_review_limits enable row level security;
revoke all on public.antoni_review_limits from public, anon, authenticated;
grant select, insert, update, delete on public.antoni_review_limits to service_role;

create function public.antoni_submit_review(p_submission_id uuid,p_name text,p_audience text,p_rating smallint,p_body text,p_client_hash text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare result_id uuid; request_count integer;
begin
  select id into result_id from public.antoni_reviews where submission_id = p_submission_id;
  if result_id is not null then return result_id; end if;
  if p_client_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_client'; end if;
  delete from public.antoni_review_limits where day < current_date - 2;
  -- Atomic limits across all function instances; all writes below are one transaction.
  insert into public.antoni_review_limits(scope,day,requests) values ('global',current_date,1)
    on conflict (scope,day) do update set requests = public.antoni_review_limits.requests + 1 returning requests into request_count;
  if request_count > 60 then raise exception 'review_rate_limit'; end if;
  insert into public.antoni_review_limits(scope,day,requests) values (p_client_hash,current_date,1)
    on conflict (scope,day) do update set requests = public.antoni_review_limits.requests + 1 returning requests into request_count;
  if request_count > 5 then raise exception 'review_rate_limit'; end if;
  insert into public.antoni_reviews(submission_id,name,audience,rating,body,consent,status)
    values(p_submission_id,btrim(p_name),p_audience,p_rating,btrim(p_body),true,'pending')
    on conflict (submission_id) do nothing returning id into result_id;
  if result_id is null then select id into result_id from public.antoni_reviews where submission_id = p_submission_id; end if;
  return result_id;
end;
$$;
revoke all on function public.antoni_submit_review(uuid,text,text,smallint,text,text) from public, anon, authenticated;
grant execute on function public.antoni_submit_review(uuid,text,text,smallint,text,text) to service_role;

create function public.antoni_list_reviews(p_offset integer default 0,p_limit integer default 3)
returns jsonb language sql stable security invoker set search_path = '' as $$
  with published as (
    select id,name,audience,rating,body,status,created_at
    from public.antoni_reviews where status = 'approved'
  ), batch as (
    select * from published order by created_at desc,id
    offset greatest(0,least(p_offset,100000)) limit greatest(1,least(p_limit,12))
  )
  select jsonb_build_object(
    'reviews',coalesce((select jsonb_agg(to_jsonb(b) order by b.created_at desc,b.id) from batch b),'[]'::jsonb),
    'summary',(select jsonb_build_object('count',count(*),'average',avg(rating)) from published),
    'hasMore',(select count(*) > greatest(0,least(p_offset,100000)) + greatest(1,least(p_limit,12)) from published)
  );
$$;
revoke all on function public.antoni_list_reviews(integer,integer) from public, anon, authenticated;
grant execute on function public.antoni_list_reviews(integer,integer) to service_role;
commit;
