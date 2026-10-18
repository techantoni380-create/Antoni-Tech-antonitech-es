# Activar las respuestas de IA de Antoni Tech

Estado de esta entrega: la guía de servicios funciona sin servidor y el contacto por WhatsApp está operativo. Este backend está preparado y probado con respuestas simuladas; no está desplegado ni tiene credenciales. No se han realizado llamadas de pago a OpenAI. GitHub Pages sirve archivos estáticos y no ejecuta este backend.

## Activación

1. Usa tu cuenta de Cloudflare Workers y un proyecto propio de OpenAI API con facturación configurada. Define el presupuesto antes de activar. Elige un modelo disponible en tu cuenta compatible con Responses API; escribe su identificador en `vars.OPENAI_MODEL` en `wrangler.jsonc`. Se deja vacío expresamente: sin modelo no hay llamadas de IA.
2. Instala Wrangler siguiendo la documentación oficial (versión 4.36.0 o posterior). Dentro de esta carpeta, autentícate con `npx wrangler login`. Revisa los orígenes permitidos y que los dos namespace_id de los limitadores no estén usados por otros Workers de tu cuenta.
3. Crea los secretos del Worker con `npx wrangler secret put OPENAI_API_KEY` y `npx wrangler secret put ABUSE_HASH_SECRET`. El segundo es un valor aleatorio largo propio, usado para seudonimizar la IP en los límites. Introduce valores en los prompts privados de Wrangler. No escribas claves en HTML, JavaScript público, GitHub ni en este chat.
4. Completa la información de privacidad para este nuevo tratamiento antes de activar: responsable, finalidad, base jurídica, proveedores Cloudflare/OpenAI, conservación, transferencias y derechos. La política entregada describe el modo local actual, no una IA ya en producción. La casilla del chat informa del envío y lo activa, pero no sustituye esa revisión.
5. Despliega con `npx wrangler deploy`. Usa la URL HTTPS que te devuelva, con `/chat` al final, en `assistantConfig.endpoint` del archivo público `assets/assistant-config.mjs` (en el proyecto de Sites está en `dist/assets/`). Ese endpoint es público; nunca la clave. Reconstruye el sitio y publica los archivos estáticos.
6. Comprueba en tu dominio el consentimiento, las respuestas en ES/EN, el límite temporal, los errores y el contacto. Hasta marcar la casilla no se envían mensajes a la IA. Al activar o desactivar IA se borra el historial local, para no reenviar una conversación anterior inadvertidamente.

## Funcionamiento y límites

- Solo admite POST JSON desde los orígenes enumerados; acepta hasta nueve mensajes de usuario/asistente, 1500 caracteres por mensaje y 24 KB por petición. Rechaza roles system/developer y mantiene sus instrucciones en servidor.
- La información del negocio se genera desde los servicios publicados. No añade datos privados ni inventa presupuestos. No ejecuta acciones, busca en la web ni envía mensajes.
- El cliente pinta respuestas como texto, nunca HTML. La URL de WhatsApp es fija y el visitante revisa el texto antes de abrirla y enviarlo. No se incluye automáticamente todo el chat ni las respuestas de IA en ese mensaje.
- Se aplican 8 peticiones por minuto por IP seudonimizada y 40 por minuto por centro de datos. Las IP compartidas pueden compartir límite. CORS no autentica a un visitante y los límites de Workers son aproximados y por ubicación: no garantizan un tope económico global. Antes de dar tráfico público, configura controles de facturación, alertas y protección contra abuso según tu cuenta y presupuesto.
- No hay base de datos, cookies de chat ni almacenamiento persistente de conversaciones en el navegador. Se envía el contexto reciente con cada petición a Cloudflare y OpenAI solo tras activar IA. `store:false` desactiva el almacenamiento del objeto Responses; NO promete retención cero de los proveedores. OpenAI puede conservar registros de control de abuso según sus condiciones; Cloudflare procesa metadatos de red y limitación.
- Tiempo máximo de respuesta de servidor: 20 s. Máximo de salida: 800 tokens, incluidos los tokens de razonamiento si el modelo los utiliza. Un modelo con mucho razonamiento puede agotar ese límite: verifica su compatibilidad y rendimiento. Si falla, el cliente muestra claramente una respuesta de la guía local y permite contactar con Yonathan.
- Borra el valor del endpoint y vuelve a publicar para desactivar IA en la interfaz; revoca la clave o desactiva el Worker para impedir también llamadas directas.

## Comprobaciones

Desde la raíz del proyecto: `node --test assistant-backend/assistant.test.mjs`. Prueba solicitudes, límites, errores y extracción de respuesta con fetch simulado. No sustituye una prueba real con el modelo configurado ni la revisión visual en navegador.

Referencias oficiales consultadas:
- https://developers.openai.com/api/reference/overview
- https://developers.openai.com/api/docs/quickstart
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/api/docs/guides/your-data
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
