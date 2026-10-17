begin;
alter table public.payment_attempts add column if not exists provider_payment_id text;
alter table public.payment_attempts add column if not exists provider_environment text not null default 'unknown';
alter table public.user_subscriptions add column if not exists payment_attempt_id uuid references public.payment_attempts(id);
create unique index if not exists nealsam_payment_provider_id on public.payment_attempts(provider_payment_id) where provider_payment_id is not null;
create unique index if not exists nealsam_subscription_payment_id on public.user_subscriptions(payment_attempt_id) where payment_attempt_id is not null;
alter table public.payment_attempts enable row level security;
alter table public.user_subscriptions enable row level security;

create or replace function public.nealsam_activate_payment(p_attempt_id uuid, p_token text, p_payment_id text, p_price numeric, p_currency text)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare
  attempt public.payment_attempts%rowtype;
  target_plan text;
begin
  select * into attempt from public.payment_attempts where id = p_attempt_id for update;
  if not found then raise exception 'Unknown payment'; end if;
  if attempt.iyzico_token is distinct from p_token or p_payment_id is null or length(p_payment_id) = 0 or p_currency <> 'TRY' or p_price is distinct from attempt.price::numeric then
    raise exception 'Payment mismatch';
  end if;
  if attempt.plan not in ('plus','experience','premium') or attempt.price <> (case attempt.plan when 'plus' then 49 when 'experience' then 79 when 'premium' then 99 end) then
    raise exception 'Invalid plan';
  end if;
  if attempt.status = 'paid' then return true; end if;
  if attempt.status not in ('initialized','failed') then raise exception 'Invalid payment state'; end if;
  perform pg_advisory_xact_lock(hashtextextended(attempt.user_id::text, 0));
  target_plan := attempt.plan;
  if exists(select 1 from public.user_subscriptions where user_id=attempt.user_id and status='active' and (plan='premium' or (plan='plus' and attempt.plan='experience') or (plan='experience' and attempt.plan='plus'))) then
    target_plan := 'premium';
  end if;
  update public.user_subscriptions set status='inactive' where user_id=attempt.user_id and status='active';
  insert into public.user_subscriptions(user_id,plan,status,started_at,payment_attempt_id)
    values(attempt.user_id,target_plan,'active',now(),attempt.id);
  update public.payment_attempts set status='paid', provider_payment_id=p_payment_id,updated_at=now() where id=attempt.id;
  return true;
end;
$$;
revoke all on function public.nealsam_activate_payment(uuid,text,text,numeric,text) from public,anon,authenticated;
grant execute on function public.nealsam_activate_payment(uuid,text,text,numeric,text) to service_role;

create or replace function public.nealsam_payment_schema_ready() returns boolean language sql security invoker set search_path=public as $$ select true $$;
revoke all on function public.nealsam_payment_schema_ready() from public,anon,authenticated;
grant execute on function public.nealsam_payment_schema_ready() to service_role;
commit;
