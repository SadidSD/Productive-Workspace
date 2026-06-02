-- RLS policy: workspace owners and admins can remove members (but not the owner)
create policy "Owners and admins can remove members"
on public.workspace_members for delete
to authenticated
using (
  -- The person doing the delete must be an owner or admin of this workspace
  exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_members.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
  -- Cannot remove the owner
  and workspace_members.role != 'owner'
);

-- RPC: wrapped in security definer so it always runs as postgres (bypasses RLS edge cases)
create or replace function public.remove_workspace_member(ws_id uuid, target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role user_role;
  target_role user_role;
begin
  -- Get caller's role
  select role into caller_role
  from workspace_members
  where workspace_id = ws_id and user_id = auth.uid();

  if caller_role is null then
    raise exception 'Not a member of this workspace';
  end if;

  if caller_role not in ('owner', 'admin') then
    raise exception 'Only owners and admins can remove members';
  end if;

  -- Get target's role
  select role into target_role
  from workspace_members
  where workspace_id = ws_id and user_id = target_user_id;

  if target_role = 'owner' then
    raise exception 'Cannot remove the workspace owner';
  end if;

  delete from workspace_members
  where workspace_id = ws_id and user_id = target_user_id;

  -- Also clear any pending invites for this user in this workspace
  delete from workspace_invites
  where workspace_id = ws_id and used_at is null
    and email = (select email from profiles where id = target_user_id);
end;
$$;
