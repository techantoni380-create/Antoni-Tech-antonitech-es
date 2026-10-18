# Opiniones de Antoni Tech

## Estado de esta entrega

El bloque está integrado después de los proyectos y antes de los servicios. Cada opinión publicada genera una tarjeta; se muestran tres inicialmente y «Ver más opiniones» añade otras tres. La media incluye todas las opiniones publicadas, tanto de clientes como de usuarios, sin considerarlas compras verificadas.

Actualmente el formulario prepara un mensaje de WhatsApp con nombre público, relación con Antoni Tech, estrellas, comentario y autorización. El visitante confirma el envío en WhatsApp. No se afirma que se haya recibido ni se añade una reseña al navegador como si fuera pública. No se usa localStorage para opiniones. No hay opiniones ficticias.

`assets/reviews-published.json` contiene las opiniones autorizadas y revisadas del modo manual (inicialmente vacío). Para publicar una opinión real recibida, añadir un objeto con `id` único, `name`, `audience` (`client` o `visitor`), `rating` (entero 1–5), `body`, `status: "approved"` y `created_at` (fecha ISO). Conservar el texto y la puntuación de la persona. Aplicar los mismos criterios de moderación a valoraciones positivas y negativas. Volver a publicar el sitio y el export de GitHub.

## Conexión directa preparada, sin activar

No se ha creado un proyecto de Supabase ni modificado el proyecto «Todos con Hernán». La herramienta exige que el usuario elija una organización antes de crear un proyecto. Solo se ha localizado una organización con ese nombre. Una vez elegida, consultar el coste y pedir autorización si no es cero; crear un proyecto independiente para Antoni Tech, preferiblemente en Europa.

1. Aplicar `setup.sql` al proyecto nuevo mediante la herramienta de migración; registrar la migración real devuelta, sin inventar su identidad. No ejecutar este esquema en un proyecto ajeno ni sobre tablas existentes.
2. Revisar con una consulta las restricciones, RLS, permisos y funciones. Ejecutar el asesor de seguridad. Las tablas y RPC no conceden acceso a `anon` ni a `authenticated`; la función Edge accede con una clave secreta del servidor.
3. Desplegar `index.ts`, `handler.mjs` y `assets/reviews-core.mjs`, respetando las rutas relativas. No hay dependencias externas. Usar `verify_jwt: false` porque el código comprueba `apikey` contra las claves publicables de Supabase. No es una identificación del autor; son opiniones públicas moderadas.
4. Confirmar que `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS` y `SUPABASE_SECRET_KEYS` existen en el entorno de Supabase. Nunca poner claves secretas en HTML, JavaScript del navegador o GitHub.
5. Probar envío válido a pendiente, rechazo de valores inválidos, intento de autopublicación, lectura pública sin pendientes, duplicado con el mismo UUID, límites y aprobación/rechazo desde el panel de Supabase. Eliminar los datos de prueba antes de activar la web. Estas pruebas remotas siguen pendientes.
6. Completar la información de privacidad del nuevo tratamiento y del proveedor antes de activar. El envío directo conserva nombre público, relación, puntuación, comentario, consentimiento y fecha; el límite usa una dirección IP transformada con HMAC y fecha, en una tabla separada que elimina entradas con más de dos días al recibir nuevos envíos. Supabase puede conservar sus propios registros; no se afirma retención cero. Definir conservación de pendientes y el procedimiento de retirada.
7. Configurar el endpoint real y la clave **publicable** en `reviews-config.mjs`. Cambiar también la versión/comentario de `reviews.mjs` para renovar su hash de recurso, reconstruir y publicar ambas versiones. El formulario pasará a envío directo y solo mostrará éxito cuando reciba HTTP 202 con `status: pending`.

Las reseñas se moderan en la tabla `antoni_reviews` del panel de Supabase cambiando `status` a `approved` o `rejected`. El navegador no puede hacerlo. No existe un panel administrativo público.

Límites preparados: 5 envíos por identificador de red y día; 60 globales por día, aplicados de forma atómica en Postgres. El campo trampa y los límites reducen el spam, pero no equivalen a un CAPTCHA. Los rechazos nunca dependen del número de estrellas. Antes de crecer el tráfico se puede añadir un control adicional según el abuso observado.

Documentación consultada: https://supabase.com/docs/guides/functions/auth y https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys (18/10/2026). La implementación usa las claves publicables/secretas actuales y no depende de JWT anon heredados.

Pruebas locales: `node --test reviews-backend/reviews.test.mjs`. Validan comportamiento con dobles de prueba; no sustituyen la verificación de Postgres y Supabase una vez elegida la organización.
