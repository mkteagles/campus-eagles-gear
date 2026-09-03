# Activar la integración CRM → Campus

Esta versión conecta el producto interno `workshop` del CRM (Workshop High Ticket/Elite) con el curso existente del Campus. Los dos proyectos de Supabase permanecen separados. El CRM crea un cliente académico único y el Campus guarda ese mismo número como `crm_customer_id`, por lo que varios leads del mismo cliente no generan alumnos duplicados.

## 1. Actualizar el Campus

1. Sube el contenido del ZIP actualizado del Campus a su repositorio.
2. En el SQL Editor de **Supabase del Campus**, ejecuta `Migracion_Integracion_CRM_Campus.sql`.
3. Genera un secreto desde una terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Copia el resultado. En Vercel del Campus abre **Settings → Environment Variables** y agrega:

   ```env
   CAMPUS_PROVISIONING_SECRET=EL_SECRETO_GENERADO
   ```

5. Vuelve a desplegar el Campus.

No borres las variables de Supabase que ya tiene el proyecto. El secreto no lleva el prefijo `VITE_`.

## 2. Actualizar el CRM

1. Sube el contenido del ZIP actualizado del CRM a su repositorio.
2. En el SQL Editor de **Supabase del CRM**, ejecuta `Migracion_Integracion_Campus.sql`.
3. En Vercel del CRM agrega:

   ```env
   SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_PRIVADA_DEL_CRM
   CAMPUS_API_URL=https://campus-eagles-gear.vercel.app
   NEXT_PUBLIC_CAMPUS_URL=https://campus-eagles-gear.vercel.app
   CAMPUS_PROVISIONING_SECRET=EL_MISMO_SECRETO_GENERADO
   ```

4. Conserva sus variables actuales de Supabase y Hotmart.
5. Vuelve a desplegar el CRM.

Ni `SUPABASE_SERVICE_ROLE_KEY` ni el secreto llevan el prefijo `NEXT_PUBLIC_`. El secreto debe ser exactamente igual en ambos proyectos.

## Cómo queda relacionada la información

- En el CRM, `leads.academy_customer_id` apunta a `academy_customers.id`.
- En el CRM, `customer_campus_access` registra qué curso y usuario del Campus pertenecen a ese cliente.
- En el Campus, `student_profiles.crm_customer_id` guarda el mismo número del CRM. No es una llave foránea SQL porque está en otro proyecto Supabase.
- La integración busca primero el identificador de Hotmart y después email/teléfono normalizados para reutilizar al cliente.
- La contraseña temporal se devuelve una sola vez al administrador; no se envía por correo porque `@eagles.com` es un usuario interno sin buzón.

## 3. Prueba completa

1. Entra al CRM como administrador.
2. Abre un lead cuyo producto sea **Workshop High Ticket**.
3. Mientras el pago no esté marcado como `paid`, la tarjeta del Campus debe permanecer bloqueada.
4. Edita el lead, registra un monto pagado mayor a cero y guarda; si usas Hotmart, el webhook hará este registro al aprobarse la compra.
5. Pulsa **Generar acceso** y confirma que el pago fue verificado.
6. Copia las credenciales que aparecen. La contraseña temporal solamente se muestra en esa creación.
7. Abre el Campus e inicia sesión con el usuario sin escribir `@eagles.com`.
8. El alumno deberá crear su contraseña privada antes de entrar al curso.
9. Vuelve al CRM y pulsa nuevamente la operación: debe mostrar la misma cuenta, sin crear otra.

## Comportamiento de seguridad

- Solamente un administrador del CRM puede generar accesos.
- No se genera acceso si el pago no está marcado como liquidado o el monto pagado es cero.
- El navegador nunca recibe la service role key de Supabase.
- El cliente académico, no el lead aislado, conserva la referencia única entre ambos sistemas.
- Un usuario sin inscripción activa ya no puede abrir directamente una URL de clase.
- Para restablecer una contraseña perdida se usa el panel administrativo del Campus.
