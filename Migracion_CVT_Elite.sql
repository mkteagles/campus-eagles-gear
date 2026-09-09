-- ============================================================================
-- EAGLES GEAR SOLUTIONS · CVT ELITE
-- Ejecutar UNA VEZ en Supabase -> SQL Editor DEL CAMPUS.
-- Es segura para alumnos, progreso e inscripciones existentes.
-- ============================================================================

begin;

-- 1. Registrar CVT Elite como curso independiente.
insert into public.courses (id, title, description, active)
values (
  'cvt-elite',
  'CVT Elite',
  'Programa Elite de capacitación en transmisiones CVT de Eagles Gear Solutions.',
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  active = excluded.active,
  updated_at = now();

-- 2. Asegurar que crear una cuenta NO la inscriba automáticamente
--    a un curso incorrecto. La inscripción se realiza desde el panel
--    administrativo o desde la integración CRM.
create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.student_profiles (
    id,
    email,
    full_name,
    phone,
    company_name
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

commit;

-- ============================================================================
-- OPCIONAL: SI LOS 2 CLIENTES YA EXISTEN EN AUTHENTICATION,
-- puedes asignarlos desde /admin (recomendado) o usar esto sustituyendo emails:
--
-- insert into public.course_enrollments (user_id, course_id, status, expires_at)
-- select id, 'cvt-elite', 'active', null
-- from auth.users
-- where lower(email) in ('cliente1@eagles.com', 'cliente2@eagles.com')
-- on conflict (user_id, course_id) do update set
--   status = 'active',
--   expires_at = null,
--   updated_at = now();
-- ============================================================================
