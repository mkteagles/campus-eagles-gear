-- ================================================================
-- EAGLES GEAR SOLUTIONS · NUEVOS CURSOS DEL CAMPUS
-- Fecha: 18/09/2026
-- Versión corregida: 6L80 (antes se había escrito GL80 por error).
-- Ejecutar en Supabase del CAMPUS -> SQL Editor.
-- Es seguro volverlo a ejecutar: usa ON CONFLICT y migra GL80 -> 6L80.
-- ================================================================

begin;

-- 1) Crear/actualizar catálogo correcto de cursos.
insert into public.courses (id, title, description, active)
values
  ('cvt-jf011', 'CVT JF011', 'Capacitación especializada en la transmisión CVT JF011.', true),
  ('cvt-jf017', 'CVT JF017', 'Capacitación especializada en la transmisión CVT JF017.', true),
  ('cvt-jf015', 'CVT JF015', 'Capacitación especializada en la transmisión CVT JF015.', true),
  ('dsg-dq200', 'DSG DQ200', 'Capacitación especializada en la transmisión DSG DQ200.', true),
  ('dsg-dq250', 'DSG DQ250', 'Capacitación especializada en la transmisión DSG DQ250.', true),
  ('programacion-gm', 'Programación GM', 'Capacitación enfocada en programación automotriz GM.', true),
  ('6l80', '6L80', 'Capacitación especializada en la transmisión automática GM 6L80.', true),
  ('curso-empresarial', 'Curso Empresarial', 'Capacitación empresarial de Eagles Gear Solutions.', true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  active = excluded.active,
  updated_at = now();

-- 2) Si ya se ejecutó la versión anterior con `gl80`,
-- migrar cualquier acceso/progreso existente al ID correcto `6l80`.
insert into public.course_enrollments (user_id, course_id, status, enrolled_at, expires_at, updated_at)
select user_id, '6l80', status, enrolled_at, expires_at, now()
from public.course_enrollments
where course_id = 'gl80'
on conflict (user_id, course_id) do update set
  status = excluded.status,
  expires_at = excluded.expires_at,
  updated_at = now();

insert into public.lesson_progress (user_id, course_id, lesson_id, completed, completed_at, updated_at)
select user_id, '6l80', lesson_id, completed, completed_at, now()
from public.lesson_progress
where course_id = 'gl80'
on conflict (user_id, course_id, lesson_id) do update set
  completed = excluded.completed,
  completed_at = excluded.completed_at,
  updated_at = now();

delete from public.lesson_progress where course_id = 'gl80';
delete from public.course_enrollments where course_id = 'gl80';
delete from public.courses where id = 'gl80';

commit;

-- Verificación opcional:
-- select id, title, active from public.courses order by title;
