# CVT Elite · Campus Eagles Gear

Esta versión conserva el Campus existente y agrega **CVT Elite** como un curso independiente.

## Qué ya viene listo

- Dashboard exclusivo de CVT Elite.
- 25 módulos preparados (puedes bajar el número a 18–25 sin tocar el dashboard).
- Un video por módulo.
- Progreso separado por curso y por alumno.
- Validación de acceso por `course_enrollments`.
- Panel administrativo con selector de curso al crear alumnos.
- Desde el panel admin puedes activar o retirar CVT Elite a un usuario existente.
- La API CRM del Campus acepta `cvt-elite` como `courseId`.

## 1. Primero: Supabase

En **Supabase del Campus → SQL Editor** ejecuta únicamente:

`Migracion_CVT_Elite.sql`

No vuelvas a ejecutar toda `Base_Datos_Alumnos_Supabase.sql`.

## 2. Dar acceso a los dos clientes Elite

Después del deploy:

1. Entra al Campus con el administrador.
2. Abre `/admin`.
3. En **Agregar usuario**, captura nombre, usuario, teléfono y contraseña temporal.
4. En **Curso** selecciona `CVT Elite`.
5. Crea la cuenta.
6. Comparte usuario + contraseña temporal.
7. El alumno cambia su contraseña en el primer ingreso.

Si el usuario ya existía, en la tabla de alumnos pulsa el botón **CVT Elite** para activarle ese curso.

## 3. Cuando tengas los IDs de los videos

Edita:

`src/data/cvtEliteData.js`

Busca:

```js
export const CVT_ELITE_VIDEO_IDS = {
  1: '',
  2: '',
  3: '',
  // ...
}
```

Y pega los IDs de Vimeo:

```js
export const CVT_ELITE_VIDEO_IDS = {
  1: '123456789',
  2: '987654321',
  3: '456789123',
}
```

## 4. Si al final son 18, 20 o 22 módulos

En el mismo archivo cambia:

```js
export const CVT_ELITE_MODULE_COUNT = 25
```

Por ejemplo:

```js
export const CVT_ELITE_MODULE_COUNT = 20
```

No necesitas modificar rutas, dashboard ni Supabase.

## 5. Cambiar nombres de módulos

En `src/data/cvtEliteData.js` edita `CVT_ELITE_MODULE_TITLES`.

Ejemplo:

```js
export const CVT_ELITE_MODULE_TITLES = {
  1: 'Fundamentos CVT',
  2: 'Diagnóstico inicial',
  3: 'Presiones y parámetros',
}
```

## 6. Subir a Git

Desde la raíz del repositorio:

```powershell
npm install
npm run build
git status
git add .
git commit -m "Agrega CVT Elite al Campus"
git push origin main
```

Si Vercel está conectado a GitHub, el push dispara el nuevo deploy automáticamente.
