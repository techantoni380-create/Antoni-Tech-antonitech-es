# Antoni Tech · antonitech.es

Actualización del proyecto para GitHub Pages. Versión del 18 de octubre de 2026.

**Pendiente de completar:** Aviso legal, Política de privacidad y Política de cookies mantienen campos por confirmar, noindex y exclusión del sitemap. El recuadro general de borrador se ha retirado a petición del propietario. Deben completarse y validarse antes de usarlas como textos definitivos. El diseño del pie ya está terminado. Faltan la identificación legal completa, NIF y domicilio profesional; para privacidad y cookies, confirmar el tratamiento real, conservación, proveedores y tecnologías de terceros en el dominio publicado. No basta con retirar el aviso de borrador.

Incluye nueve páginas principales y tres borradores legales, español e inglés, cabecera metálica, brillo del logo cada dos segundos, cabecera con dos imágenes y un vídeo, lista de 21 vídeos en bucle, servicios, proyectos, redes sociales y contacto.

## 1. Subir al repositorio

1. Descomprime el ZIP.
2. Abre tu repositorio de GitHub y pulsa **Add file → Upload files**, o copia los archivos a tu repositorio local con GitHub Desktop.
3. Sube el contenido de la carpeta descomprimida. **`index.html` debe quedar en la raíz del repositorio**, junto a `assets`, `servicios`, `proyectos`, `sobre-mi`, `contacto` y `CNAME`.
4. Incluye también `.nojekyll`; permite publicar directamente estos archivos estáticos.
5. Guarda los cambios con un commit. Si usas GitHub Desktop, pulsa después **Push origin**.

No necesitas instalar dependencias ni compilar para publicar: los HTML, CSS y JavaScript ya están preparados.

## 2. Activar GitHub Pages

En el repositorio, abre **Settings → Pages**. En **Build and deployment**, selecciona **Deploy from a branch**, elige la rama que contiene los archivos —normalmente `main`— y la carpeta **/(root)**. Pulsa **Save**.

En esa misma pantalla, introduce **antonitech.es** en **Custom domain** y guarda. El archivo `CNAME` ya incluye ese dominio, pero también debes configurarlo en los ajustes de Pages.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 3. Conectar el dominio

Después de añadir el dominio en GitHub Pages, configura estos registros en el proveedor donde administras el DNS de antonitech.es:

| Tipo | Nombre | Destino |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | techantoni380-create.github.io |

El destino de `www` supone que el repositorio está en tu cuenta **techantoni380-create**. Si utilizas otra cuenta, cambia ese destino por `USUARIO.github.io`, sin nombre de repositorio.

Si `@` o `www` ya apuntan a otro alojamiento, sustituye únicamente los registros web que correspondan. Conserva los registros de correo, como MX y TXT.

Cuando GitHub valide el dominio y el certificado esté disponible, activa **Enforce HTTPS**. La propagación de DNS y la disponibilidad de HTTPS pueden tardar hasta 24 horas.

Guía oficial: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Contacto configurado

- **Pedir presupuesto:** abre WhatsApp al **+34 635 977 484**, con un mensaje preparado.
- **Preparar correo:** abre la aplicación de correo del visitante, dirigido a **techantoni380@gmail.com**.
- El visitante confirma el envío en su aplicación. La web no envía correos desde un servidor ni almacena los mensajes.
- LinkedIn, Instagram y GitHub tienen los enlaces facilitados para Antoni Tech.

## Editar el proyecto

- Las doce páginas son archivos `index.html` dentro de sus respectivas carpetas.
- `assets/site.css`: estilos generales.
- `assets/minimal.css`: cabecera, presentación minimalista y pulso de luz.
- `assets/site.js`: idioma, presentación, filtros, vídeo y contacto.
- `assets/brand-films/`: 21 vídeos optimizados, portada y orden de reproducción en `playlist.json`.
- `_source/build_site.py`: plantillas y contenido reutilizable, con salida en la raíz del proyecto.
- `_source/check_site.py`: comprobación de enlaces, recursos y estructura.

Puedes editar directamente los HTML. Si prefieres utilizar las plantillas, edita `_source/build_site.py` y ejecuta, desde la carpeta del proyecto:

```bash
python _source/build_site.py
python _source/check_site.py
```

La generación vuelve a escribir las doce páginas: no combines cambios manuales en los HTML con una regeneración sin trasladarlos antes a las plantillas. El CSS y el JavaScript se editan directamente.

Para verlo en tu ordenador con Python instalado:

```bash
python -m http.server 8000
```

Abre http://localhost:8000. Los enlaces utilizan rutas relativas y funcionan tanto en el dominio propio como bajo la ruta de un repositorio de GitHub Pages.

## Archivos de publicación

`CNAME`, las URL canónicas, las etiquetas para compartir, `sitemap.xml` y `robots.txt` están preparados para **https://antonitech.es**. El paquete no incluye credenciales ni configuración del alojamiento anterior.

Comprobaciones realizadas: doce páginas, enlaces internos, recursos, traducciones y sintaxis JavaScript. La revisión visual e interactiva en navegador queda pendiente.

## Recursos y licencias

Logo y vídeo: materiales aportados por Yonathan Alvarado. Cabecera: edición del diseño aprobado. Imágenes de proyectos: recursos de almazara.ch, todosconhernan.com y la web de Edis Alvarado facilitadas en el proyecto. La composición de Studi1 representa un diseño en desarrollo.

Las fuentes Barlow Condensed y Manrope se incluyen localmente con sus licencias OFL en `assets`.


## Actualización: vistas web interactivas

En Inicio y Proyectos, las tarjetas de ALMAZARA y Todos con Hernán contienen la web real. Permiten desplazarse y navegar dentro del recuadro. «Ampliar» abre la misma vista en un diálogo grande; «Volver al recuadro» o Escape la reducen conservando la navegación. «Abrir web» permite visitar el sitio directamente. En móvil, la vista ampliada usa el diseño responsive de la web.

Las vistas se cargan con lazy loading. Dependen de la disponibilidad de las webs externas y de que estas permitan su integración. Si una web cambia su política o no se muestra, usa «Abrir web». Las cabeceras consultadas el 18/10/2026 no bloquearon la integración; no se ha realizado una prueba visual en navegador.

Para actualizar el proyecto existente, extrae el ZIP y copia su contenido en la carpeta del repositorio, sustituyendo los archivos con el mismo nombre. No crees otro repositorio. En GitHub Desktop, revisa los cambios, pulsa Commit to main y después Push origin. Conserva la configuración actual de Pages y del dominio.


## Cinta de tecnologías

La cabecera de todas las páginas se organiza en tres filas: logo y redes, cinta de tecnologías y menú. La cinta muestra directamente las tecnologías, sin título visible y con márgenes laterales iguales. Los 37 logos y sus nombres se muestran en blanco puro, en celdas del mismo ancho y con separación uniforme. Incluye Autodesk 3ds Max, AutoCAD, CorelDRAW y PrestaShop. El carrusel se desplaza continuamente en bucle, sin botón de pausa ni interrupción al pasar el cursor o usar el teclado. El movimiento de esta cinta se mantiene siempre activo según el diseño solicitado. Las dimensiones de la cabecera y los márgenes se adaptan a móvil, tableta y ordenador. Fuentes y licencias de los SVG: assets/technologies/.


## Menú y vista local

Los enlaces internos incluyen index.html para navegar abriendo el archivo principal con doble clic, además de funcionar en GitHub Pages. Se conservan los parámetros del formulario de contacto y los enlaces a secciones.

El menú queda blanco en reposo. Al pasar el cursor, enfocar con el teclado o visitar la página, Inicio, Servicios, Sobre mí y Hablemos se muestran en cian, y Proyectos en fucsia. Cada enlace tiene un subrayado del mismo color. La cinta muestra un resplandor suave cian y fucsia al pasar el cursor, sin pausar su desplazamiento.


## Ajuste de la portada

La portada crece con su contenido. La firma y los controles de la presentación ocupan su propia fila después de los botones, con separación vertical, para evitar solapamientos al cambiar de mensaje o tamaño de pantalla.


## Galería de proyectos y servicios

Inicio incluye los cuatro proyectos en una galería con flechas, contador y navegación mediante teclado. Se muestran dos por vista en escritorio y uno en móvil. La galería no avanza automáticamente; las webs de ALMAZARA y Todos con Hernán mantienen su navegación y la opción Ampliar. Studi1 aparece identificado como diseño en desarrollo. El enlace «Creemos el tuyo» abre WhatsApp.

Los nueve servicios se presentan con iconos, beneficios y enlaces a su información completa. Se conservan los idiomas español e inglés.


## Proceso y consulta gratuita

Las flechas de la galería están a ambos lados de las vistas en ordenador y debajo en móvil. Inicio y Servicios explican cuatro pasos: consulta gratuita, propuesta a medida, diseño y desarrollo, y pruebas y lanzamiento. La consulta y el asesoramiento se presentan como totalmente gratuitos y personalizados. El botón de consulta prepara un mensaje específico en WhatsApp al número configurado, en español o inglés.


## Yonathan y los vídeos de Antoni Tech

Inicio presenta «Detrás de los proyectos de Antoni Tech» y una reseña breve de Yonathan Alvarado como Técnico en Sistemas Microinformáticos y Redes, desarrollador web full stack y programador. La biografía completa mantiene la formación DAW como formación en curso.

Inicio y Sobre mí incluyen un reproductor con 21 vídeos distintos, optimizados a 1080p, conservando los fotogramas por segundo de cada original. Cada vídeo conserva su duración y su audio. Se reproducen en orden y, al terminar el último, vuelve a empezar el primero. Las flechas permiten cambiar de vídeo; los botones personalizados permiten pausar, activar el sonido y ampliar a pantalla completa cuando el navegador lo permita, sin mostrar una línea de tiempo.

El inicio automático es sin sonido y solo cuando el reproductor está visible. Se pausa al salir de pantalla o cambiar de pestaña; una pausa manual se conserva. Con movimiento reducido o ahorro de datos, el visitante inicia la reproducción. Si el navegador bloquea el inicio automático, puede pulsar Play. Solo se solicita el vídeo activo, no toda la lista.

Para cambiar el orden o añadir vídeos, edita `assets/brand-films/playlist.json` y regenera las páginas. Usa MP4 H.264 con audio AAC; conserva los nombres de archivo sin espacios.


## Reproductor ampliado y sin línea de tiempo

El vídeo ocupa una fila propia, de lado a lado de la página, sin marco ni márgenes laterales, con relación 16:9. Se muestra completo, sin estirar ni recortar. La biografía aparece debajo. Los botones personalizados permiten avanzar, retroceder, pausar, activar el sonido y ampliar la vista en navegadores compatibles. En móvil los controles se reorganizan para caber en pantalla. Sin JavaScript quedan disponibles los controles nativos como alternativa.

La secuencia contiene 21 vídeos únicos. Se han descartado las copias idénticas por su contenido, no solo por el nombre del archivo. Los cinco nuevos son Glitch Cyberpunk, Movimiento digital, Pixelado, Formas de neón y Capa circular 3D. Cada vídeo aparece una sola vez por vuelta; al terminar la lista vuelve al principio. Los archivos se conservan en Full HD a partir de los originales y solo se carga el vídeo activo.


## El origen de Antoni Tech

Inicio incluye una explicación breve del nombre junto a la presentación de Yonathan. Sobre mí desarrolla la historia: Antoni es la forma catalana de Antonio, su segundo nombre, que empezó a usar a raíz de cómo le llamaban en Cataluña; Tech representa su profesión y su pasión por la tecnología. El texto conecta esa historia con el trato directo y el compromiso con cada proyecto. Disponible en español e inglés.

El reproductor tiene ancho completo también en Inicio y Sobre mí. El vídeo conserva su altura proporcional y los textos mantienen márgenes de lectura independientes.


## Invitación a empezar un proyecto

El bloque final presenta «Tu idea merece un proyecto a su altura» en una composición con fondo oscuro, acentos sutiles cian y fucsia y dos áreas equilibradas. Explica que la propuesta tendrá alcance, plazos y presupuesto claros. La zona de contacto mantiene la consulta y el asesoramiento totalmente gratuitos y personalizados, el botón Pedir presupuesto por WhatsApp y el trato directo con Yonathan. Se adapta a una columna en móvil e incluye español e inglés.


## Pie de página centrado

La marca, el lema, la firma profesional, los enlaces legales, las redes y el cierre están centrados. La firma «Yonathan Alvarado · Freelance Full Stack Developer · Spain» enlaza a Instagram. En móvil, la firma se organiza en tres líneas y los enlaces legales en dos columnas. Los enlaces legales llevan a /aviso-legal/, /privacidad/ y /cookies/ de Antoni Tech, nunca a Almazara. Contacto abre la página de contacto propia.

Los tres documentos son borradores bilingües para revisión. Incluyen solo información conocida y señalan lo pendiente; no certifican el cumplimiento legal. El apartado de cookies reconoce las vistas web externas y no afirma que toda la web esté libre de cookies. Mantener noindex hasta completar la revisión; el recuadro general de borrador se ha retirado a petición del propietario.

La firma destaca Freelance en cian. La portada, la biografía y Sobre mí presentan a Yonathan como desarrollador Full Stack freelance y explican que el cliente trabaja directamente con él.


## Cabecera compacta y navegación persistente

Todas las páginas comparten la cabecera completa al inicio y una barra compacta que permanece visible al bajar y subir. La barra incluye logo, menú y WhatsApp; el carrusel permanece en la cabecera inicial. Al volver arriba se recupera el diseño completo. El fondo oscuro, el desenfoque suave y el borde separan la navegación del contenido. La altura del contenido se reserva para evitar saltos.

En pantallas de hasta 960 px, la barra compacta muestra logo, WhatsApp y Menú. El menú se abre con un botón, se cierra con Escape, al pulsar fuera o seleccionar un enlace, y conserva el acceso mediante teclado. Las cuatro fichas de proyectos incluyen Inicio → Proyectos → nombre del proyecto.

Los archivos assets/navigation.css y assets/navigation.js contienen este comportamiento. Si JavaScript está desactivado, la cabecera completa y los enlaces siguen disponibles. La transición respeta el movimiento reducido. Se han comprobado enlaces, sintaxis y estados de interacción mediante simulación; la revisión visual en navegador sigue pendiente.


## Cabecera: vídeo completo, imagen original e imagen de servicios

El ciclo de Inicio muestra el vídeo de Auto Cibernético completo (20,01 segundos), la imagen metálica original durante 8 segundos y la imagen de software durante 8 segundos. Después vuelve a empezar. El vídeo avanza por su evento de finalización, no por el temporizador de las imágenes. El ciclo activo dura aproximadamente 36 segundos.

La tercera escena presenta una interfaz web, una aplicación móvil y módulos de software conectados sobre un fondo blanco perla, con detalles azul cobalto y ámbar. Cambia el ambiente antes de volver al vídeo inicial. El titular, los botones y los controles pasan a tonos oscuros para conservar el contraste, y la navegación mantiene su fondo oscuro. Los textos permanecen como HTML traducible. El vídeo ocupa la misma área que la primera imagen, de lado a lado y sin marco. Se adapta sin deformarse mediante object-fit: cover; puede recortar los bordes según la pantalla. En ordenador mantiene el titular y los enlaces visibles sobre un degradado oscuro; en móvil y tablet el texto queda debajo del área visual.

El vídeo inicia sin sonido, con botón para activarlo. El control de pausa detiene la presentación y el vídeo; al reanudar conserva el tiempo pendiente. El ciclo se suspende al ocultar la pestaña o salir de la cabecera. Movimiento reducido y ahorro de datos requieren reproducción manual. Si el navegador bloquea el inicio, aparece Reproducir vídeo. Si falla el archivo, se pasa a la imagen siguiente. Las tres marcas permiten elegir escena.

El vídeo está optimizado a 1920×1080, 24 fps, conservando su duración completa y audio. No se ha añadido otra copia a la lista de 21 vídeos de la biografía. assets/hero-media.css y el bloque de cabecera en assets/site.js controlan esta presentación.

Studi1 utiliza el logo oficial facilitado por el cliente, con sus proporciones originales, tanto en las tarjetas como en la ficha del proyecto. El estado continúa siendo diseño en desarrollo.

Comprobación realizada: secuencia 8 s → final real del vídeo → 8 s, repetición, pausa y reanudación, visibilidad, sonido, recuperación del bloqueo de reproducción y enlaces. La prueba visual y de reproducción en navegador sigue pendiente.

## Servicios ampliados, sin categorías duplicadas

Inicio presenta nueve servicios: web, tiendas online, apps y software, academias online, CRM y automatización, dominio/hosting/correo, mantenimiento web, sistemas y soporte IT y asesoramiento digital. La página Servicios desarrolla cada apartado y el formulario de contacto permite seleccionar cualquiera de ellos. Las landing pages y rediseños pertenecen a Web; las migraciones de tiendas y conexiones ERP se explican en Tiendas online.

Academias online se ofrece como creación de plataformas para clientes: cursos, alumnos, evaluaciones, seguimiento y formación de uso con Moodle. No anuncia una academia propia ni cursos ya disponibles. El asesoramiento inicial es gratuito y el trabajo posterior se define en una propuesta. Las integraciones dependen de compatibilidad y alcance. Todos los textos nuevos incluyen español e inglés.

Se mantienen las doce páginas existentes, los proyectos, la cabecera y sus tiempos de reproducción. Comprobación: enlaces internos, recursos, anclas y formularios; revisión visual en navegador pendiente.

## Perfil, interacción y presentación legal

El perfil de Inicio, Sobre mí y la firma del pie identifican a Yonathan como desarrollador full stack y diseñador gráfico freelance. Sobre mí incorpora la titulación de Técnico Superior en Higiene Bucodental y la experiencia en clínica, sin presentar servicios sanitarios.

Los nueve servicios tienen contorno y resplandor cian/fucsia al pasar el ratón o enfocar sus enlaces con teclado. Sus acciones son específicas para cada servicio y conservan la selección automática en el formulario. La animación respeta el movimiento reducido.

Por petición del propietario se ha retirado el recuadro general «Borrador para revisión» de las tres páginas legales. Eso no convierte los textos en definitivos: se mantienen los datos pendientes de identificación y revisión de privacidad y cookies, así como noindex y la exclusión del sitemap. Se ha explicitado la actividad freelance usando únicamente los datos facilitados. Para completar la identificación faltan nombre legal completo, NIF y domicilio; la revisión de proveedores, conservación y tecnologías de terceros sigue pendiente.

Referencias de revisión: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10 ; https://www.aepd.es/guias/guia-modelo-clausula-informativa.pdf ; https://www.aepd.es/guias/guia-cookies.pdf . Comprobados estructura, enlaces, recursos, traducciones y formularios. La revisión visual en navegador continúa pendiente.


## Asistente virtual

Todas las páginas incorporan un asistente flotante en español e inglés. Actualmente utiliza una guía local de respuestas sobre servicios, tecnologías y proyectos: no se presenta como una IA activa. El visitante puede escribir consultas, usar preguntas sugeridas, borrar el chat y preparar un mensaje editable para WhatsApp. Solo incluye sus tres últimas consultas; las respuestas del asistente no se trasladan como afirmaciones del visitante. No se guardan conversaciones al recargar o cambiar de página.

El diseño usa un diálogo nativo con cierre, teclado y adaptación móvil. Las respuestas se insertan como texto seguro. No se abre automáticamente ni envía mensajes por sí mismo. `_source/assistant_markup.py` contiene la estructura; los archivos `assets/assistant*` contienen los estilos, interacción y conocimiento generado desde los servicios publicados.

La conexión real de IA está preparada en `assistant-backend/`, con instrucciones de activación, controles de uso y pruebas. Requiere desplegar el servidor, elegir un modelo, configurar una clave privada y actualizar la información de privacidad. No hay clave, backend desplegado ni cargos de API en esta entrega. El endpoint público permanece vacío. El código del servidor nunca debe contener claves literales.

Validación: once pruebas de guía/contacto y backend con proveedor simulado, comprobaciones de las doce páginas y sintaxis. La IA no se ha probado contra un proveedor real y la revisión visual en navegador sigue pendiente.



## Carrusel y adaptación a dispositivos

El carrusel incluye 39 tecnologías, con Angular y Azure. Los SVG se han obtenido del mismo conjunto Devicon que los demás logotipos; sus URLs constan en `assets/technologies/sources.json`. Los iconos y nombres se muestran en blanco puro (#fff), también al pasar el ratón. El brillo cian/fucsia queda en los bordes de la franja. Los dos grupos idénticos permiten el desplazamiento continuo sin pausa al interactuar.

`assets/responsive.css`, cargado al final, adapta las doce páginas. Hasta 960 px aparece el menú táctil tanto al inicio como durante el scroll, la cabecera separa imagen/vídeo y texto, y la galería muestra un proyecto con las flechas debajo. Las rejillas se reorganizan a 1100/960/600/420 px; los formularios, tarjetas, enlaces y textos tienen límites de anchura. Se contemplan los márgenes seguros del dispositivo y pantallas horizontales de poca altura. El asistente reduce su botón en móvil y ajusta su ventana al área visible cuando aparece el teclado.

Se han comprobado estructura y enlaces de las doce páginas, sintaxis JavaScript y los estados del menú táctil y del cambio entre vídeo y texto al cruzar el tamaño de tablet. La secuencia de portada sigue siendo vídeo completo, imagen original 8 s y tercera imagen 8 s. No se ha realizado renderizado en navegador ni prueba en dispositivos reales porque control-browser no está disponible; la adaptación no supone una garantía de compatibilidad perfecta con cualquier dispositivo.



## Nueva tercera imagen: diseño de software

La tercera escena usa ahora una interfaz web, una app móvil y módulos conectados sobre un fondo blanco perla con detalles azul cobalto y ámbar. El archivo assets/hero-services.png mantiene 1672 × 941 px, los 8 segundos de exposición y el montaje responsive. Se ha creado con la herramienta integrada de generación de imágenes; el prompt completo está en _source/hero-services-prompt.txt. La imagen se ha inspeccionado y las referencias se han comprobado; falta la revisión del montaje final en navegador.

## Actualización de la cabecera

Secuencia: vídeo completo con texto visible → imagen original durante 8 s → tercera imagen actual durante 8 s. En móvil y tablet el texto permanece debajo del vídeo. WhatsApp y Menú tienen fondos oscuros sólidos y bordes más definidos. La tercera imagen se mantiene hasta definir su sustitución.

## Portada móvil y presentación personal

En móvil y tablet (hasta 960 px), la navegación tiene un fondo sólido y el vídeo y las imágenes se muestran debajo, en un marco 16:9 que conserva la composición completa. El titular fluye en líneas naturales y ocupa menos altura; los márgenes del texto y los controles se han compactado. Se elimina el bloque «Formación y base técnica» de Sobre mí y se conserva la reseña «Una trayectoria que conecta disciplinas». La secuencia y duración de las tres escenas siguen iguales. Revisión visual en navegador pendiente.

## Opiniones de clientes y usuarios

Nuevo bloque después de Proyectos y antes de Servicios, con estrellas de 1 a 5, tarjetas responsivas y tres opiniones por tanda con «Ver más opiniones». No hay testimonios ficticios ni medias inventadas. El formulario actual permite enviar la opinión a Yonathan por WhatsApp para su revisión; no guarda en una base de datos ni publica automáticamente. La conexión directa, con moderación y almacenamiento, está preparada en `reviews-backend/` y pendiente de elegir una organización y activar un proyecto dedicado.
