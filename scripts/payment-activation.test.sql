-- Integration test: every fixture and mutation is rolled back; no real payment.
begin;
do $$
declare
  uid uuid := gen_random_uuid();
  aid uuid := gen_random_uuid();
  other_id uuid := gen_random_uuid();
  n integer;
begin
  if has_function_privilege('anon','public.nealsam_activate_payment(uuid,text,text,numeric,text)','execute') or has_function_privilege('authenticated','public.nealsam_activate_payment(uuid,text,text,numeric,text)','execute') then raise exception 'RPC exposed'; end if;
  insert into auth.users(id,aud,role,email) values(uid,'authenticated','authenticated',uid::text||'@example.invalid');
  insert into public.payment_attempts(id,user_id,email,plan,price,iyzico_token,status,provider_environment) values(aid,uid,'fixture@example.invalid','plus',49,'fixture-'||aid,'initialized','sandbox');
  perform public.nealsam_activate_payment(aid,'fixture-'||aid,'provider-'||aid,49,'TRY');
  perform public.nealsam_activate_payment(aid,'fixture-'||aid,'provider-'||aid,49,'TRY');
  select count(*) into n from public.user_subscriptions where payment_attempt_id=aid;
  if n<>1 then raise exception 'Duplicate activation'; end if;
  if not exists(select 1 from public.user_subscriptions where user_id=uid and status='active' and plan='plus') then raise exception 'Plus missing'; end if;
  if not exists(select 1 from public.payment_attempts where id=aid and status='paid') then raise exception 'Payment not committed'; end if;
  insert into public.payment_attempts(id,user_id,email,plan,price,iyzico_token,status,provider_environment) values(other_id,uid,'fixture@example.invalid','premium',99,'fixture-'||other_id,'initialized','sandbox');
  begin
    perform public.nealsam_activate_payment(other_id,'fixture-'||other_id,'provider-other',1,'TRY');
    raise exception 'Wrong amount accepted';
  exception when raise_exception then
    if sqlerrm='Wrong amount accepted' then raise; end if;
  end;
  begin
    perform public.nealsam_activate_payment(other_id,'fixture-'||other_id,'provider-'||aid,99,'TRY');
    raise exception 'Duplicate provider payment accepted';
  exception when unique_violation then null;
  end;
  if not exists(select 1 from public.user_subscriptions where user_id=uid and status='active' and plan='plus') then raise exception 'Atomic rollback lost existing subscription'; end if;
  if exists(select 1 from public.user_subscriptions where payment_attempt_id=other_id) then raise exception 'Partial subscription created'; end if;
  perform public.nealsam_activate_payment(other_id,'fixture-'||other_id,'provider-other',99,'TRY');
  perform public.nealsam_activate_payment(aid,'fixture-'||aid,'provider-'||aid,49,'TRY');
  if not exists(select 1 from public.user_subscriptions where user_id=uid and status='active' and plan='premium') then raise exception 'Replay downgraded premium'; end if;
end;
$$;
rollback;
select 'PASS: atomic activation, duplicate callback, amount mismatch, provider replay and rollback; all fixtures removed' as result;
