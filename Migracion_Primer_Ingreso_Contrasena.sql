-- ================================================================
-- EAGLES DIGITAL SOLUTIONS
-- MIGRACIÓN: CONTRASEÑA OBLIGATORIA EN EL PRIMER INGRESO
--
-- Ejecuta este archivo UNA VEZ en Supabase -> SQL Editor.
-- Es seguro volver a ejecutarlo.
-- ================================================================

-- 1. Marca las cuentas que todavía usan contraseña temporal.
alter table public.student_profiles
  add column if not exists must_change_password boolean not null default true;

-- Los administradores existentes conservan su acceso actual.
update public.student_profiles
set must_change_password = false
where role = 'admin';

-- 2. Función segura que cada alumno usa después de cambiar su contraseña.
-- No guarda ni recibe la contraseña; solamente completa el paso inicial.
create or replace function public.mark_password_changed()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.student_profiles
  set must_change_password = false,
      updated_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.mark_password_changed() from public;
revoke all on function public.mark_password_changed() from anon;
grant execute on function public.mark_password_changed() to authenticated;

-- 3. La función privada de Vercel administra usuarios con service_role.
grant all privileges on public.student_profiles to service_role;

-- Verificación rápida: debe mostrar la columna y los usuarios actuales.
select email, role, status, must_change_password
from public.student_profiles
order by created_at desc;
