# Reseñas de Antoni Tech

Sistema activo desde el 18 de octubre de 2026. El formulario envía a Supabase y confirma la recepción solo tras una respuesta HTTP 202. Las nuevas opiniones quedan en `pending`. Cada opinión `approved` crea una tarjeta; se muestran tres y «Ver más opiniones» carga otras tres. La media usa todas las opiniones aprobadas.

## Revisar y publicar

1. Abre https://supabase.com/dashboard/project/wveszyuklbjvsddfpjgt/editor .
2. Comprueba la organización **Antoni Tech**, proyecto **techantoni380-create's Project**.
3. Abre la tabla **antoni_reviews** y lee el nombre, relación, puntuación y comentario.
4. Cambia únicamente **status**: `pending` = en revisión y oculto; `approved` = publicado; `rejected` = oculto.
5. Guarda. El cambio se verá al cargar o recargar la web.

Conservar las estrellas y el texto del autor. Aplicar los mismos criterios a valoraciones favorables y críticas. No se presentan como compras verificadas. No hay avisos automáticos por email/WhatsApp: revisa la tabla de pendientes. No existe un panel administrativo público.

La eliminación se realiza manualmente desde Supabase, atendiendo las solicitudes de retirada y la necesidad de conservación. Las opiniones no se borran automáticamente por antigüedad. La revisión automática rechazó un borrado tras 30 días porque ese plazo no estaba autorizado; no se activó. Acordar un plazo antes de automatizarlo.

## Configuración

- Proyecto: `wveszyuklbjvsddfpjgt`, organización Antoni Tech, base de datos en Frankfurt (eu-central-1).
- Función Edge: `antoni-reviews`.
- Endpoint: https://wveszyuklbjvsddfpjgt.supabase.co/functions/v1/antoni-reviews
- Configuración pública: `assets/reviews-config.mjs`.
- El proyecto Todos con Hernán es independiente y no se ha modificado.

El navegador incluye solo una clave **publicable**. Las claves secretas se leen del entorno de Supabase en el servidor; nunca deben copiarse al ZIP, al navegador o a GitHub. `setup.sql` documenta la migración inicial `antoni_reviews_initial`, ya aplicada. No volver a ejecutarlo sobre las tablas existentes.

Las tablas tienen RLS y no conceden acceso a `anon` ni `authenticated`; las funciones SQL tampoco. El servidor usa su clave secreta para las dos operaciones definidas. La función Edge usa `verify_jwt: false` porque valida la cabecera `apikey` con las claves publicables actuales. Esta clave identifica la aplicación, no a la persona.

Para desplegar otra versión de la función, subir `index.ts`, `handler.mjs` y `assets/reviews-core.mjs` conservando sus rutas relativas. No hay dependencias externas. Al cambiar la configuración pública, cambiar también su versión de importación dentro de `reviews.mjs` y reconstruir la web.

## Protección y privacidad

Se exige nombre público, relación con el proyecto, valoración entera de 1 a 5, comentario de 20 a 1200 caracteres y consentimiento. Hay campo trampa y límites atómicos de 5 envíos por identificador de red y día, y 60 globales por día. Estas medidas reducen spam; no son un CAPTCHA ni verificación de identidad.

La IP se transforma mediante HMAC y fecha; el identificador queda separado de las opiniones. Las entradas del límite con más de dos días se eliminan al recibir nuevos envíos. Supabase puede conservar registros técnicos bajo sus condiciones.

La página de privacidad explica el tratamiento directo y enlaza el acuerdo de Supabase. El resto de datos legales incompletos sigue pendiente; esta integración no certifica cumplimiento legal integral.

## Validación

- Ocho pruebas locales superadas: `node --test reviews-backend/reviews.test.mjs`.
- Prueba real de Postgres en transacción revertida: pendiente, idempotencia, aprobación, rechazo, valoraciones de 1 y 5, media 3/5, paginación y límite atómico.
- HTTP real: estado vacío, CORS, claves incorrectas, métodos no admitidos, validación, consentimiento, campo trampa, envío a pendiente, reintento sin duplicado y bloqueo del acceso directo a tablas y RPC.
- Tres envíos sintéticos quedaron pendientes y se eliminaron después. Estado final: cero opiniones.
- La revisión automática bloqueó publicar reseñas sintéticas para probar su lectura HTTP. La aprobación y media se verificaron con la transacción revertida; no quedó ningún testimonio ficticio publicado.
- Asesor de rendimiento: sin hallazgos. Seguridad: solo dos avisos informativos de RLS sin políticas, intencionados porque las tablas son privadas y solo accede el servidor. Referencia: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy .
- Doce páginas, enlaces, formularios, traducciones y sintaxis comprobados. Revisión visual e interacción en navegador pendiente: control-browser no estaba disponible.

## Publicar en antonitech.es

El ZIP está configurado para el mismo servicio. Sustituye los archivos de tu repositorio, conserva su configuración de GitHub y realiza Commit/Push. La publicación de Sites y la de tu dominio en GitHub son independientes. Después de publicar, puedes enviar una opinión real y revisarla desde Supabase.

Documentación:
- https://supabase.com/docs/guides/functions/auth
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
