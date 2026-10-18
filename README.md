# Antoni Tech · antonitech.es

Proyecto completo listo para GitHub Pages. Versión del 18 de octubre de 2026.

Incluye nueve páginas, español e inglés, cabecera metálica, brillo del logo cada dos segundos, presentación de tres mensajes, vídeo de cinco segundos, servicios, proyectos, redes sociales y contacto.

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
- `assets/antoni-tech-5s.mp4`: vídeo de cinco segundos.
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
