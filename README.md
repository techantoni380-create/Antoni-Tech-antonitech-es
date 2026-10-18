# Antoni Tech · antonitech.es

Proyecto completo listo para GitHub Pages. Versión del 18 de octubre de 2026.

Incluye nueve páginas, español e inglés, cabecera metálica, brillo del logo cada dos segundos, presentación de tres mensajes, lista de 21 vídeos en bucle, servicios, proyectos, redes sociales y contacto.

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

- Las nueve páginas son archivos `index.html` dentro de sus respectivas carpetas.
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

La generación vuelve a escribir las nueve páginas: no combines cambios manuales en los HTML con una regeneración sin trasladarlos antes a las plantillas. El CSS y el JavaScript se editan directamente.

Para verlo en tu ordenador con Python instalado:

```bash
python -m http.server 8000
```

Abre http://localhost:8000. Los enlaces utilizan rutas relativas y funcionan tanto en el dominio propio como bajo la ruta de un repositorio de GitHub Pages.

## Archivos de publicación

`CNAME`, las URL canónicas, las etiquetas para compartir, `sitemap.xml` y `robots.txt` están preparados para **https://antonitech.es**. El paquete no incluye credenciales ni configuración del alojamiento anterior.

Comprobaciones realizadas: nueve páginas, enlaces internos, recursos, traducciones y sintaxis JavaScript. La revisión visual e interactiva en navegador queda pendiente.

## Recursos y licencias

Logo y vídeo: materiales aportados por Yonathan Alvarado. Cabecera: edición del diseño aprobado. Imágenes de proyectos: recursos de almazara.ch, todosconhernan.com y la web de Edis Alvarado facilitadas en el proyecto. La composición de Studi1 representa un diseño en desarrollo.

Las fuentes Barlow Condensed y Manrope se incluyen localmente con sus licencias OFL en `assets`.


## Actualización: vistas web interactivas

En Inicio y Proyectos, las tarjetas de ALMAZARA y Todos con Hernán contienen la web real. Permiten desplazarse y navegar dentro del recuadro. «Ampliar» abre la misma vista en un diálogo grande; «Volver al recuadro» o Escape la reducen conservando la navegación. «Abrir web» permite visitar el sitio directamente. En móvil, la vista ampliada usa el diseño responsive de la web.

Las vistas se cargan con lazy loading. Dependen de la disponibilidad de las webs externas y de que estas permitan su integración. Si una web cambia su política o no se muestra, usa «Abrir web». Las cabeceras consultadas el 18/10/2026 no bloquearon la integración; no se ha realizado una prueba visual en navegador.

Para actualizar el proyecto existente, extrae el ZIP y copia su contenido en la carpeta del repositorio, sustituyendo los archivos con el mismo nombre. No crees otro repositorio. En GitHub Desktop, revisa los cambios, pulsa Commit to main y después Push origin. Conserva la configuración actual de Pages y del dominio.


## Cinta de tecnologías

La cabecera de las nueve páginas se organiza en tres filas: logo y redes, cinta de tecnologías y menú. La cinta muestra directamente las tecnologías, sin título visible y con márgenes laterales iguales. Los 37 logos y sus nombres se muestran en blanco puro, en celdas del mismo ancho y con separación uniforme. Incluye Autodesk 3ds Max, AutoCAD, CorelDRAW y PrestaShop. El carrusel se desplaza continuamente en bucle, sin botón de pausa ni interrupción al pasar el cursor o usar el teclado. El movimiento de esta cinta se mantiene siempre activo según el diseño solicitado. Las dimensiones de la cabecera y los márgenes se adaptan a móvil, tableta y ordenador. Fuentes y licencias de los SVG: assets/technologies/.


## Menú y vista local

Los enlaces internos incluyen index.html para navegar abriendo el archivo principal con doble clic, además de funcionar en GitHub Pages. Se conservan los parámetros del formulario de contacto y los enlaces a secciones.

El menú queda blanco en reposo. Al pasar el cursor, enfocar con el teclado o visitar la página, Inicio, Servicios, Sobre mí y Hablemos se muestran en cian, y Proyectos en fucsia. Cada enlace tiene un subrayado del mismo color. La cinta muestra un resplandor suave cian y fucsia al pasar el cursor, sin pausar su desplazamiento.


## Ajuste de la portada

La portada crece con su contenido. La firma y los controles de la presentación ocupan su propia fila después de los botones, con separación vertical, para evitar solapamientos al cambiar de mensaje o tamaño de pantalla.


## Galería de proyectos y servicios

Inicio incluye los cuatro proyectos en una galería con flechas, contador y navegación mediante teclado. Se muestran dos por vista en escritorio y uno en móvil. La galería no avanza automáticamente; las webs de ALMAZARA y Todos con Hernán mantienen su navegación y la opción Ampliar. Studi1 aparece identificado como diseño en desarrollo. El enlace «Creemos el tuyo» abre WhatsApp.

Los seis servicios se presentan con iconos, beneficios y enlaces a su información completa. Se conservan los idiomas español e inglés.


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
