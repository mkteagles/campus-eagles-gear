# Campus Eagles Gear Solutions

Plataforma de lecciones construida con React, Vite, Supabase y Vimeo. Incluye acceso protegido, temario modular, navegación entre clases y progreso individual por alumno.

El temario lateral puede ocultarse en computadora para ver la clase en modo enfoque. En tablet y celular funciona como un panel superpuesto que se cierra al elegir una lección, tocar fuera o usar la X. La preferencia de escritorio se conserva en el dispositivo.

El botón flotante de apariencia permite alternar todo el campus entre modo oscuro y claro. La elección también se conserva en el dispositivo de cada usuario.

## 1. Configurar Supabase

1. Crea un proyecto en Supabase.
2. Abre **SQL Editor** y ejecuta `Base_Datos_Alumnos_Supabase.sql`.
3. En **Authentication → Users**, crea la primera cuenta administrativa y después cambia su rol a `admin` como se explica al final del archivo SQL.
4. En **Authentication → URL Configuration**, agrega la URL de producción de Vercel a **Site URL**.

Si la base ya estaba creada, ejecuta solamente `Migracion_Primer_Ingreso_Contrasena.sql`. No vuelvas a crear el proyecto de Supabase.

Si vas a conectar el CRM, ejecuta además `Migracion_Integracion_CRM_Campus.sql`. Esta migración conserva los alumnos actuales y evita que cualquier cuenta nueva reciba cursos automáticamente.

## 2. Variables de entorno

Copia `.env.example` como `.env.local` y coloca:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_CLAVE_SERVICE_ROLE_PRIVADA
CAMPUS_PROVISIONING_SECRET=TU_SECRETO_ALEATORIO_DE_32_CARACTERES_O_MAS
```

En Vercel agrega las mismas variables en **Project Settings → Environment Variables**.
La clave `SUPABASE_SERVICE_ROLE_KEY` no debe llevar el prefijo `VITE_` ni utilizarse en archivos del navegador.
`CAMPUS_PROVISIONING_SECRET` tampoco debe llevar `VITE_`. Debe contener exactamente el mismo valor que la variable privada del CRM.

## Integración con Eagles CRM

El endpoint privado `/api/integrations/crm-provision` crea o reutiliza un alumno, lo inscribe al curso y devuelve una contraseña temporal solamente cuando la cuenta acaba de crearse. El Campus guarda el `academy_customers.id` del CRM como `student_profiles.crm_customer_id` y como referencia en `external_enrollments`; repetir la solicitud o usar otro lead del mismo cliente no crea alumnos duplicados.

El producto `workshop` del CRM (Workshop High Ticket/Elite) se asigna al curso interno `seminario-empresarial`, que conserva ese ID para no perder el progreso existente.

Después de agregar o modificar variables en Vercel, vuelve a desplegar el proyecto.

## Panel administrativo

El primer administrador se crea desde Supabase. Después podrá entrar a `/admin` para:

- crear alumnos o administradores;
- asignar contraseñas temporales;
- restablecer la contraseña de un alumno sin correo electrónico;
- consultar las cuentas existentes;
- activar, desactivar o bloquear accesos;
- cambiar el rol de una cuenta.

Los usuarios se crean como `nombre.apellido@eagles.com`; no necesitan tener un buzón real. El alumno escribe solamente `nombre.apellido` al iniciar sesión. En su primer ingreso deberá sustituir la contraseña temporal por una privada antes de ver las clases.

## 3. Agregar videos

Edita `src/data/courseData.js`. En cada lección pega únicamente el ID numérico de Vimeo:

```js
videoId: '123456789'
```

Si el video es privado, permite que se incruste desde tu dominio de Vercel en la configuración de privacidad de Vimeo.

## 4. Ejecutar y publicar

```bash
npm install
npx vercel dev
npm run build
```

Usa `npx vercel dev` para probar también el panel administrativo y sus funciones `/api`. `npm run dev` sirve para la interfaz, pero no ejecuta esas funciones de Vercel.

Sube el proyecto a GitHub e impórtalo desde Vercel. El archivo `vercel.json` ya permite abrir directamente cualquier URL de lección sin obtener error 404.
