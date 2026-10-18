from pathlib import Path
from html import escape as esc
import json
from hashlib import sha256
import re
from urllib.parse import quote, urlsplit, urlunsplit
from assistant_markup import assistant_markup
from reviews_markup import reviews_markup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT
ORIGIN = 'https://antonitech.es'
EMAIL = 'techantoni380@gmail.com'
LINKEDIN = 'https://www.linkedin.com/in/yonathan-alvarado-919637101/'
INSTAGRAM = 'https://www.instagram.com/techantoni/'
GITHUB = 'https://github.com/techantoni380-create'
WHATSAPP = 'https://wa.me/34635977484?text=' + quote('Hola, Yonathan. Me gustaría pedir presupuesto para mi proyecto.')
WHATSAPP_EN = 'https://wa.me/34635977484?text=' + quote('Hi Yonathan, I would like to request a quote for my project.')

def t(es, en, tag='span', cls=''):
    return f'<{tag} data-es="{esc(es, quote=True)}" data-en="{esc(en, quote=True)}"'+(f' class="{cls}"' if cls else '')+f'>{esc(es)}</{tag}>'

def arrow(diagonal=False):
    return '<span aria-hidden="true">↗</span>' if diagonal else '<span aria-hidden="true">→</span>'

def button(url, es, en, secondary=False, external=False):
    ext = ' target="_blank" rel="noopener noreferrer"' if external else ''
    locale = f' data-whatsapp data-url-es="{WHATSAPP}" data-url-en="{WHATSAPP_EN}"' if url == WHATSAPP else ''
    return f'<a class="button {"button-outline" if secondary else "button-solid"}" href="{url}"{ext}{locale}>{t(es,en)}{arrow(external)}</a>'

def logo():
    return '<span class="logo-crop"><img src="/assets/antoni-tech-logo.png" alt="Antoni Tech" width="1500" height="1548"></span>'

def social():
    return f'''<a href="{LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon linkedin">in</a>
    <a href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></a>'''

NAV = [('/', 'Inicio','Home'),('/servicios/','Servicios','Services'),('/proyectos/','Proyectos','Work'),('/sobre-mi/','Sobre mí','About'),('/contacto/','Hablemos','Let’s talk')]

def header(route):
    nav = ''.join(f'<a href="{u}"'+(' class="nav-projects"' if u=='/proyectos/' else '')+(' aria-current="page"' if u==route or u=='/proyectos/' and route.startswith('/proyectos/') else '')+f'>{t(es,en)}</a>' for u,es,en in NAV)
    return f'''<a class="skip-link" href="#contenido">{t('Saltar al contenido','Skip to content')}</a>
    <div class="header-spacer" aria-hidden="true"></div><header class="site-header" data-adaptive-header><div class="header-top">
    <a class="brand" href="/" aria-label="Antoni Tech · Inicio">{logo()}</a>
    <div class="header-right"><div class="header-socials">{social()}</div><div class="language-switch" role="group" aria-label="Language"><button type="button" data-lang="es" aria-pressed="true">ES</button><span aria-hidden="true">/</span><button type="button" data-lang="en" aria-pressed="false">EN</button></div></div></div>{technology_marquee()}<div class="navigation-bar">
      <a class="brand compact-brand" href="/" aria-label="Antoni Tech · Inicio / Home">{logo()}</a>
      <nav class="primary-nav" id="primary-navigation" aria-label="Principal / Main navigation">{nav}</nav>
      <div class="compact-actions"><a class="header-whatsapp" href="{WHATSAPP}" data-whatsapp data-url-es="{WHATSAPP}" data-url-en="{WHATSAPP_EN}" target="_blank" rel="noopener noreferrer" aria-label="Hablemos por WhatsApp" data-es="Hablemos por WhatsApp" data-en="Let’s talk on WhatsApp" data-i18n-attr="aria-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.2A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M8 8c0 4 4 8 8 8l1-2-3-1-1 1-3-3 1-1-1-3-2 1Z"/></svg><span class="header-whatsapp-desktop">{t('Hablemos','Let’s talk')}</span><span class="header-whatsapp-mobile">WhatsApp</span></a><button class="nav-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false">{t('Menú','Menu')}<span class="nav-toggle-icon" aria-hidden="true"></span></button></div>
    </div></header>'''

def footer():
    legal=[('/aviso-legal/','Aviso legal','Legal notice'),('/privacidad/','Política de privacidad','Privacy policy'),('/cookies/','Política de cookies','Cookie policy'),('/contacto/','Contacto','Contact')]
    links=''.join(f'<li><a href="{u}">{t(es,en)}</a></li>' for u,es,en in legal)
    return f'''<footer class="site-footer footer-centered"><div class="footer-inner">
      <a href="/" class="brand footer-brand" aria-label="Antoni Tech · Inicio / Home">{logo()}</a>
      {t('Diseño con intención. Tecnología con propósito.','Design with intention. Technology with purpose.','p','footer-motto')}
      <a class="footer-signature" href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer"><strong>Yonathan Alvarado</strong><span aria-hidden="true">·</span><span><strong class="freelance-word">Freelance</strong> Full Stack Developer &amp; Graphic Designer</span><span aria-hidden="true">·</span><span>Spain</span></a>
      <nav class="footer-legal" aria-label="Información legal y contacto / Legal information and contact"><ul>{links}</ul></nav>
      <nav class="footer-socials" aria-label="Redes sociales / Social profiles"><a href="{LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a><a href="{GITHUB}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></nav>
      <div class="footer-closing"><p>© 2026 Antoni Tech · {t('Todos los derechos reservados.','All rights reserved.')}</p>{t('Desde Reus, para proyectos sin fronteras.','From Reus, for projects without borders.','p')}<a href="#top" class="footer-top">{t('Volver arriba','Back to top')} <span aria-hidden="true">↑</span></a></div>
    </div></footer>'''

LEGAL_PAGES=[
    ('aviso-legal','Aviso legal','Legal notice','Información sobre Antoni Tech.','Information about Antoni Tech.',[
        ('El proyecto','The business','Antoni Tech es el proyecto profesional de Yonathan Alvarado, desarrollador web full stack y diseñador gráfico freelance. Desde Reus, España, ofrece diseño, desarrollo de software y servicios tecnológicos para emprendedores y empresas.','Antoni Tech is the professional project of Yonathan Alvarado, a freelance full-stack web developer and graphic designer. Based in Reus, Spain, he provides design, software development and technology services for entrepreneurs and businesses.'),
        ('Identificación del titular','Owner identification','Yonathan Alvarado · Profesional freelance · Antoni Tech. Base de actividad: Reus, Tarragona, España. Contacto: techantoni380@gmail.com · +34 635 977 484. La identificación debe completarse con el nombre legal completo, NIF y domicilio profesional del titular.','Yonathan Alvarado · Freelance professional · Antoni Tech. Based in Reus, Tarragona, Spain. Contact: techantoni380@gmail.com · +34 635 977 484. Identification must be completed with the owner’s full legal name, tax identification number and business address.'),
        ('Proyectos y recursos','Projects and resources','El portfolio identifica los proyectos publicados y los diseños en desarrollo. Los nombres, marcas y recursos de terceros pertenecen a sus respectivos titulares. Los sitios enlazados tienen sus propias condiciones.','The portfolio identifies published projects and designs in development. Third-party names, brands and resources belong to their respective owners. Linked websites have their own terms.'),
        ('Propuestas de trabajo','Project proposals','La consulta y el asesoramiento inicial son gratuitos y personalizados. El alcance, las entregas, los plazos y el precio de cada encargo se acuerdan en una propuesta específica.','The initial consultation and advice are free and personalised. The scope, deliverables, timeline and price of each project are agreed in a separate proposal.')
    ]),
    ('privacidad','Política de privacidad','Privacy policy','Información sobre los canales de contacto de esta web.','Information about this website’s contact channels.',[
        ('Responsable y contacto','Controller and contact','La identificación legal completa del responsable está pendiente de confirmación. El contacto del proyecto es Yonathan Alvarado, profesional freelance bajo la marca Antoni Tech, a través de techantoni380@gmail.com.','The controller’s full legal identification remains to be confirmed. The project contact is Yonathan Alvarado, a freelance professional working under the Antoni Tech brand, at techantoni380@gmail.com.'),
        ('Cómo funciona el formulario','How the form works','El formulario prepara un mensaje con tu nombre, correo, servicio e idea de proyecto. No lo envía a un servidor propio ni lo almacena en esta web: eliges correo o WhatsApp y confirmas el envío en esa aplicación. Al enviarlo, la información llega al canal elegido.','The form prepares a message with your name, email, service and project idea. It does not send it to an own server or store it on this website: you choose email or WhatsApp and confirm sending in that app. Once sent, the information reaches the selected channel.'),
        ('Opiniones de clientes y usuarios','Client and user reviews','El formulario de opiniones prepara tu nombre público, valoración de 1 a 5 estrellas, relación con el proyecto y comentario para enviarlos por WhatsApp. Tú confirmas el envío allí. Actualmente no se guardan en una base de datos desde este formulario. Con tu autorización, Yonathan puede publicar tu nombre, valoración y comentario después de revisarlos. Las opiniones publicadas son visibles para cualquier visitante. La revisión aplica los mismos criterios a todas las puntuaciones: spam, insultos y exposición de datos personales. Puedes solicitar su retirada a techantoni380@gmail.com.','The review form prepares your public name, 1-to-5-star rating, relationship to the project and comment for sending via WhatsApp. You confirm sending there. This form currently does not save them to a database. With your permission, Yonathan may publish your name, rating and comment after review. Published reviews are visible to any visitor. Review criteria are the same for all ratings: spam, abuse and exposure of personal data. You may request removal at techantoni380@gmail.com.'),
        ('Asistente de servicios','Service assistant','El asistente funciona actualmente con respuestas preparadas en tu navegador, sin conexión a una IA externa. La conversación se mantiene solo en la memoria de esta página: se elimina al borrarla, recargar o navegar a otra página. El asistente no guarda el chat en cookies ni en almacenamiento local. Si eliges contactar con Yonathan, puedes revisar el texto antes de abrir WhatsApp; al abrir ese enlace, el texto se comunica a WhatsApp y tú confirmas su envío. No incluyas contraseñas ni datos sensibles.','The assistant currently uses prepared answers in your browser, without an external AI connection. The conversation stays only in this page’s memory and is cleared when you clear it, reload or visit another page. The assistant does not save chat in cookies or local storage. If you choose to contact Yonathan, you can review the text before opening WhatsApp; opening that link shares the text with WhatsApp and you confirm sending it. Do not include passwords or sensitive data.'),
        ('Finalidad prevista','Intended purpose','Los mensajes se utilizan para atender consultas y preparar propuestas solicitadas. Si se contrata un proyecto, será necesario concretar el tratamiento de datos vinculado al servicio.','Messages are used to answer enquiries and prepare requested proposals. If a project is commissioned, the processing of data related to the service will need to be specified.'),
        ('Servicios externos','External services','Los enlaces a redes sociales, correo y WhatsApp abren servicios externos. Las vistas de ALMAZARA y Todos con Hernán integran sus sitios dentro del portfolio y pueden comunicar datos de navegación a esos proveedores.','Social, email and WhatsApp links open external services. The ALMAZARA and Todos con Hernán previews embed their websites in the portfolio and may communicate browsing data to those providers.'),
        ('Información pendiente de completar','Information still to be completed','Antes de publicar este documento deben confirmarse las bases jurídicas aplicables, los plazos de conservación, los proveedores y transferencias, y el procedimiento para ejercer los derechos de protección de datos. Para cualquier consulta, escribe al correo indicado.','Before publishing this document, the applicable legal bases, retention periods, providers and transfers, and the process for exercising data protection rights must be confirmed. For questions, use the email above.')
    ]),
    ('cookies','Política de cookies','Cookie policy','Información preliminar sobre almacenamiento y contenido externo.','Preliminary information about storage and external content.',[
        ('Preferencia de idioma','Language preference','El código de esta web utiliza almacenamiento local del navegador con la clave antoni-language para recordar español o inglés. No contiene tu nombre ni tu correo. Permanece hasta que se cambie o elimine desde el navegador.','This website’s code uses browser local storage under the key antoni-language to remember Spanish or English. It does not contain your name or email. It remains until changed or deleted through the browser.'),
        ('Contenido integrado','Embedded content','Las vistas navegables de ALMAZARA y Todos con Hernán cargan sitios de terceros dentro de la página. Estos sitios pueden utilizar cookies y otras tecnologías propias. Su comportamiento debe revisarse antes de finalizar esta política y, si procede, incorporar los controles de consentimiento necesarios.','The interactive ALMAZARA and Todos con Hernán previews load third-party websites inside the page. Those sites may use their own cookies and other technologies. Their behaviour must be reviewed before finalising this policy and, where needed, the appropriate consent controls must be added.'),
        ('Estado de la revisión','Review status','El código propio revisado no integra herramientas de analítica ni píxeles publicitarios. Esto no confirma la ausencia de cookies del alojamiento o de los sitios integrados. El inventario definitivo de proveedores, finalidades y duración está pendiente de comprobación en el dominio publicado.','The reviewed first-party code does not integrate analytics tools or advertising pixels. This does not confirm the absence of cookies from the hosting platform or embedded websites. The final inventory of providers, purposes and durations still needs to be checked on the published domain.'),
        ('Gestión desde el navegador','Browser settings','Puedes revisar y borrar las cookies y el almacenamiento local en los ajustes de privacidad de tu navegador. Al eliminar la preferencia de idioma, la web volverá a utilizar su configuración inicial.','You can inspect and delete cookies and local storage in your browser’s privacy settings. Deleting the language preference returns the website to its initial setting.')
    ])
]

def legal_page(item):
    slug,title_es,title_en,desc_es,desc_en,sections=item
    body=''.join('<section class="legal-section">'+t(es,en,'h2')+t(de,dn,'p')+'</section>' for es,en,de,dn in sections)
    return f'''<article class="legal-document wrap"><header class="legal-heading">{t('ANTONI TECH · INFORMACIÓN','ANTONI TECH · INFORMATION','p','eyebrow')}{t(title_es,title_en,'h1')}{t(desc_es,desc_en,'p','legal-intro')}</header>{body}<div class="legal-contact">{t('Contacto de Antoni Tech','Antoni Tech contact','h2')}<a href="mailto:{EMAIL}">{EMAIL}</a><a href="tel:+34635977484">+34 635 977 484</a></div></article>'''

def cta():
    return f'''<section class="cta-section cta-premium wrap" aria-labelledby="project-invitation-title"><div class="cta-panel">
      <div class="cta-content">{t('DISEÑO · DESARROLLO · TECNOLOGÍA','DESIGN · DEVELOPMENT · TECHNOLOGY','p','eyebrow')}
        <h2 class="cta-title" id="project-invitation-title">{t('Tu idea merece','Your idea deserves','span','cta-title-start')}{t('un proyecto a su altura.','a project to match.','span','cta-title-accent')}</h2>
        {t('Cuéntame qué quieres conseguir. Definimos lo que necesitas y te preparo una propuesta a medida, con alcance, plazos y presupuesto claros.','Tell me what you want to achieve. We’ll define what you need, and I’ll prepare a tailored proposal with a clear scope, timeline and budget.','p','cta-description')}
        <ul class="cta-values"><li>{t('Diseño a medida','Tailored design')}</li><li>{t('Trato directo','Direct contact')}</li><li>{t('Propuesta clara','A clear proposal')}</li></ul>
      </div>
      <div class="cta-invitation"><p class="cta-conversation-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 11h8m-8 4h5"/></svg>{t('EMPECEMOS POR UNA CONVERSACIÓN','LET’S START WITH A CONVERSATION')}</p>
        {t('Hablemos de tu proyecto.','Let’s talk about your project.','h3')}
        {t('La consulta y el asesoramiento son totalmente gratuitos y personalizados.','The consultation and advice are completely free and personalised.','p','cta-consultation')}
        {button(WHATSAPP,'PEDIR PRESUPUESTO','REQUEST A QUOTE',external=True)}
        {t('Hablamos por WhatsApp · Sin compromiso','Let’s talk on WhatsApp · No obligation','p','cta-channel')}
        <div class="cta-person"><span class="cta-person-mark" aria-hidden="true">YA</span><div><strong>Yonathan Alvarado</strong>{t('Tu contacto, de principio a fin.','Your contact, from start to finish.','span')}</div></div>
      </div>
    </div></section>'''

PROJECTS=[
 dict(slug='almazara',name='ALMAZARA',cat='commerce',category=('E-commerce · Suiza','E-commerce · Switzerland'),desc=('El origen español, con una presencia digital a su altura.','Spanish origins, with a digital presence to match.'),image='almazara.webp',alt='Aceite ALMAZARA con pan y jamón',url='https://almazara.ch/',year='2026',status=('Web publicada','Published website'),role=('Diseño y desarrollo web','Web design & development'),tech='WordPress · WooCommerce · HTML · CSS · PHP',intro=('Una tienda online para acercar los productos de origen español al mercado suizo. Identidad visual, catálogo y navegación reunidos en una experiencia de marca.','An online store bringing products of Spanish origin to the Swiss market. Visual identity, a product catalogue and navigation brought together in a branded experience.'),challenge=('Presentar el producto con claridad, transmitir su origen y organizar el catálogo para una audiencia internacional.','Present the products clearly, communicate their origins and organise the catalogue for an international audience.'),work=[('Diseño visual centrado en el producto y su historia.','Visual design focused on the products and their story.'),('Catálogo de productos con WordPress y WooCommerce.','Product catalogue built with WordPress and WooCommerce.'),('Estructura adaptable y navegación en cinco idiomas.','Responsive structure and navigation in five languages.')],note=('La web está publicada. El catálogo y las condiciones de compra se consultan en el sitio de ALMAZARA.','The website is published. The current catalogue and purchase terms are available on the ALMAZARA website.')),
 dict(slug='todos-con-hernan',name='TODOS CON HERNÁN',cat='platform',category=('Plataforma · Suiza','Platform · Switzerland'),desc=('Una comunidad, muchas formas de descubrir Suiza.','One community, many ways to discover Switzerland.'),image='hernan.png',alt='Paisajes de Suiza del proyecto Todos con Hernán',url='https://www.todosconhernan.com/',year='2026',status=('Web publicada','Published website'),role=('Desarrollo web y herramientas digitales','Web development & digital tools'),tech='HTML · CSS · JavaScript · GitHub',intro=('Un portal que reúne viajes, contenido y herramientas para la comunidad hispanohablante interesada en Suiza.','A portal bringing together travel, content and tools for the Spanish-speaking community interested in Switzerland.'),challenge=('Dar orden a contenidos diversos y facilitar que cada visitante encuentre la experiencia o la herramienta que necesita.','Organise varied content and help visitors find the experience or tool they need.'),work=[('Portal responsive con navegación multilingüe.','Responsive portal with multilingual navigation.'),('Mapa del Grand Tour con 92 puntos de interés.','Grand Tour map with 92 points of interest.'),('Herramienta para preparar un currículum orientado a Suiza.','A tool to prepare a CV for the Swiss market.')],note=('Proyecto publicado y en evolución, con contenidos y herramientas que se amplían de forma progresiva.','A published, evolving project with content and tools added progressively.')),
 dict(slug='studi1',name='GIMNÀS STUDI1',cat='business',category=('Web de negocio · Reus','Business website · Reus'),desc=('La energía de un gimnasio, llevada a su identidad digital.','A gym’s energy, translated into its digital identity.'),image='studi1-official.png',alt='Logo oficial de Gimnàs Studi1 · Raúl Beas',url=None,year='En desarrollo',status=('Diseño / en desarrollo','Design / in development'),role=('Diseño de la experiencia web','Web experience design'),tech='UI / UX · Diseño responsive · Desarrollo web',intro=('Un proyecto de diseño web para Gimnàs Studi1, el gimnasio de Raúl Beas en Reus. Una propuesta visual pensada para presentar el centro y facilitar el primer contacto.','A web design project for Gimnàs Studi1, Raúl Beas’s gym in Reus. A visual concept designed to introduce the gym and make first contact easier.'),challenge=('Trasladar la personalidad del gimnasio a una web clara, con la información que necesita alguien antes de visitar el centro.','Translate the gym’s personality into a clear website with the information someone needs before visiting.'),work=[('Dirección visual y estructura de la página.','Visual direction and page structure.'),('Diseño de la presentación del gimnasio y sus servicios.','Design of the gym and services presentation.'),('Propuesta de navegación y contacto desde el móvil.','Mobile navigation and contact concept.')],note=('Diseño en desarrollo. La presentación del proyecto no implica que la web final esté publicada.','Design in development. This project presentation does not imply that the final website is live.')),
 dict(slug='edis-alvarado',name='EDIS ALVARADO',cat='business',category=('Web de autor · Miami','Author website · Miami'),desc=('Una historia que encuentra su espacio en internet.','A story that finds its place online.'),image='edis-logo.png',alt='Identidad visual de Edis Alvarado, autor',url='https://techantoni380-create.github.io/Edis-Alvarado-Book1/',year='2026',status=('Web publicada','Published website'),role=('Diseño y desarrollo de landing page','Landing page design & development'),tech='HTML · CSS · JavaScript · GitHub Pages',intro=('Una página de autor para presentar a Edis Alvarado y su obra, con una lectura directa y enlaces a los canales de compra del libro.','An author website introducing Edis Alvarado and his work, with a straightforward reading experience and links to purchase the book.'),challenge=('Crear un espacio propio para el autor y guiar al lector desde la presentación del libro hasta los canales donde puede encontrarlo.','Create an online home for the author and guide readers from the book’s introduction to the places where they can find it.'),work=[('Landing page centrada en el autor y el libro.','Landing page focused on the author and the book.'),('Diseño adaptable a móvil, tableta y ordenador.','Layout adapted to mobile, tablet and desktop.'),('Enlaces de compra e información en español e inglés.','Purchase links and information in Spanish and English.')],note=('Web publicada con enlaces a plataformas externas para la compra del libro.','Published website with links to external platforms to purchase the book.'))
]

def project_visual(p):
    if p['slug']=='studi1':
        return '<div class="studi-official-art"><img src="'+asset_url('studi1-official.png')+'" alt="Logo oficial de Gimnàs Studi1 · Raúl Beas" width="2048" height="701" loading="lazy"></div>'
    if p['image']:
        return f'<img src="/assets/{p["image"]}" alt="{p["alt"]}" loading="lazy" class="project-image">'
    return '<div class="studi-art" aria-label="Gimnàs Studi1 · Reus"><span class="studi-small">GIMNÀS · REUS</span><span class="studi-word">STUDI<span>1</span></span><span class="studi-small">FORÇA · ACTITUD · MOVIMENT</span><div class="studi-orbit" aria-hidden="true"></div></div>'

def project_card(p, idx, show_status=False):
    status = t(*p['status'], tag='p', cls='project-state' + (' is-development' if not p['url'] else '')) if show_status else ''
    if p['slug'] in ('almazara', 'todos-con-hernan'):
        return f'''<article class="project-card {p['slug']}" data-category="{p['cat']}">{project_browser(p)}<a class="project-card-link" href="/proyectos/{p['slug']}/"><div class="project-caption"><div>{t(*p['category'],tag='p',cls='project-category')}<h3>{p['name']}</h3></div>{arrow(True)}</div>{t(*p['desc'],tag='p',cls='project-description')}{status}</a></article>'''
    return f'''<article class="project-card {p['slug']}" data-category="{p['cat']}"><a class="project-card-link" href="/proyectos/{p['slug']}/"><div class="project-cover">{project_visual(p)}<span class="project-index">0{idx+1} / 04</span></div><div class="project-caption"><div>{t(*p['category'],tag='p',cls='project-category')}<h3>{p['name']}</h3></div>{arrow(True)}</div>{t(*p['desc'],tag='p',cls='project-description')}{status}</a></article>'''

def project_browser(p):
    domain = p['url'].split('/')[2].removeprefix('www.')
    title_id = 'preview-title-' + p['slug']
    return f'''<div class="project-browser-slot"><dialog open class="project-browser" aria-labelledby="{title_id}">
    <div class="browser-toolbar"><span class="browser-address" id="{title_id}"><span class="live-dot" aria-hidden="true"></span>{domain}</span><button type="button" class="browser-expand" aria-expanded="false"><span class="expand-label">{t('Ampliar','Expand')} ⛶</span><span class="collapse-label">{t('Volver al recuadro','Back to preview')} ×</span></button></div>
    <div class="browser-viewport"><iframe class="browser-frame" src="{p['url']}" title="Web de {p['name']}" data-es="Web de {p['name']}" data-en="{p['name']} website" data-i18n-attr="title" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"></iframe></div>
    <div class="browser-footer"><span>{t('Navega por la web aquí.','Explore the website here.')}</span><a href="{p['url']}" target="_blank" rel="noopener noreferrer">{t('Abrir web','Open website')} ↗</a></div>
    </dialog></div>'''

SERVICES = [('web',
  'DISEÑO Y DESARROLLO WEB',
  'WEB DESIGN & DEVELOPMENT',
  'Una web que explique quién eres y convierta el interés en contacto.',
  'A website that explains who you are and turns interest into contact.',
  'Webs corporativas, blogs, portfolios y landing pages con diseño a medida. Creamos tu primera web o renovamos la que '
  'ya tienes, con navegación clara y adaptación a todos los dispositivos.',
  'Custom business websites, blogs, portfolios and landing pages. We build your first website or refresh your existing '
  'one, with clear navigation and layouts for every device.',
  ['Diseño UI/UX y desarrollo frontend y backend',
   'Landing pages y conexión con formularios o CRM',
   'Rediseño, accesibilidad y rendimiento'],
  ['UI/UX design and frontend and backend development',
   'Landing pages connected to forms or a CRM',
   'Redesign, accessibility and performance']),
 ('ecommerce',
  'TIENDAS ONLINE',
  'ONLINE STORES',
  'Tu catálogo, preparado para dar el siguiente paso.',
  'Your catalogue, ready for the next step.',
  'Creamos o renovamos tu tienda online con WordPress y WooCommerce. Organizamos productos, compra, pagos y envíos. '
  'También valoramos migraciones y conexiones con tu ERP o programa de gestión, tras revisar sus APIs y '
  'compatibilidad.',
  'We build or refresh your WordPress and WooCommerce store, organising products, checkout, payments and shipping. We '
  'also assess migrations and connections to your ERP or business software after reviewing APIs and compatibility.',
  ['Catálogo y fichas de producto',
   'Configuración de pagos y envíos',
   'Migraciones e integración con herramientas de gestión'],
  ['Catalogue and product pages', 'Payment and shipping setup', 'Migrations and business software integrations']),
 ('apps',
  'SOFTWARE Y APLICACIONES MÓVILES',
  'SOFTWARE & MOBILE APPLICATIONS',
  'Herramientas creadas alrededor de tu forma de trabajar.',
  'Tools built around the way you work.',
  'Desarrollo de aplicaciones web y móviles, software a medida, paneles internos y conexiones mediante APIs. Definimos '
  'las funciones, los dispositivos y las plataformas que necesita cada proyecto.',
  'Web and mobile application development, custom software, internal dashboards and API integrations. We define the '
  'features, devices and platforms each project needs.',
  ['Aplicaciones web y software a medida',
   'Apps móviles: Android e iOS según alcance',
   'APIs, bases de datos e integraciones'],
  ['Web applications & custom software', 'Mobile apps: Android and iOS as scoped', 'APIs, databases & integrations']),
 ('academias-online',
  'ACADEMIAS ONLINE Y CAMPUS VIRTUALES',
  'ONLINE ACADEMIES & LEARNING PLATFORMS',
  'Tu conocimiento, en una plataforma propia.',
  'Your knowledge, on your own platform.',
  'Creamos plataformas de formación con Moodle para profesionales, academias y empresas. Organizamos cursos, '
  'materiales, actividades y evaluaciones, con acceso de alumnos y seguimiento del aprendizaje. Tú aportas el '
  'contenido formativo; preparamos la plataforma y te enseñamos a gestionarla. Si quieres vender cursos, definimos los '
  'pagos y accesos según el proyecto.',
  'We build Moodle learning platforms for professionals, academies and businesses. We organise courses, resources, '
  'activities and assessments, with student access and learning progress tracking. You provide the teaching content; '
  'we set up the platform and show you how to manage it. For paid courses, payments and access are scoped around the '
  'project.',
  ['Cursos, recursos y evaluaciones',
   'Alumnos, matrículas, roles y seguimiento',
   'Formación para administrar tu campus'],
  ['Courses, resources and assessments',
   'Students, enrolments, roles and progress tracking',
   'Training to manage your learning platform']),
 ('automatizacion',
  'CRM Y AUTOMATIZACIÓN',
  'CRM & AUTOMATION',
  'Menos tareas repetidas. Más tiempo para tu negocio.',
  'Fewer repetitive tasks. More time for your business.',
  'Analizamos cómo gestionas clientes y tareas para conectar herramientas y simplificar procesos. Integraciones con '
  'CRM, incluido Zoho, según el alcance del proyecto.',
  'We review how you manage customers and tasks to connect tools and simplify processes. CRM integrations, including '
  'Zoho, depending on project scope.',
  ['Revisión de procesos', 'Conexión entre herramientas', 'Flujos de trabajo digitales'],
  ['Process review', 'Tool connections', 'Digital workflows']),
 ('hosting-correo',
  'DOMINIO, HOSTING Y CORREO',
  'DOMAIN, HOSTING & EMAIL',
  'La base de tu presencia digital, bien configurada.',
  'A well-configured foundation for your online presence.',
  'Te ayudo a elegir y configurar el dominio, el alojamiento y el correo profesional de tu negocio. Preparamos DNS, '
  'certificado HTTPS, publicación o traslado del sitio y cuentas de correo. Las contrataciones, renovaciones y '
  'licencias de proveedores se detallan en la propuesta.',
  'I help you choose and configure your business domain, hosting and professional email. We set up DNS, HTTPS '
  'certificates, website deployment or transfer and email accounts. Provider subscriptions, renewals and licences are '
  'detailed in the proposal.',
  ['Dominio y configuración DNS', 'Alojamiento, HTTPS y publicación', 'Correo con tu dominio y migración de cuentas'],
  ['Domain and DNS setup', 'Hosting, HTTPS and deployment', 'Custom-domain email and mailbox migration']),
 ('mantenimiento',
  'MANTENIMIENTO WEB',
  'WEBSITE MAINTENANCE',
  'La web también necesita atención después del lanzamiento.',
  'Your website needs care after launch, too.',
  'Actualizaciones, copias de seguridad, revisión de incidencias y mejoras de rendimiento. El mantenimiento se define '
  'según tu plataforma y tus necesidades.',
  'Updates, backups, issue reviews and performance improvements. Maintenance is scoped around your platform and your '
  'needs.',
  ['Actualizaciones y copias', 'Revisión de seguridad', 'Mejoras y soporte'],
  ['Updates & backups', 'Security review', 'Improvements & support']),
 ('sistemas',
  'SISTEMAS Y SOPORTE IT',
  'SYSTEMS & IT SUPPORT',
  'La tecnología de tu día a día, bien conectada.',
  'Your everyday technology, properly connected.',
  'Configuración y mantenimiento de equipos, redes locales y sistemas. Soporte remoto o presencial en Reus y '
  'alrededores, según el servicio.',
  'Computer, local network and system setup and maintenance. Remote support or on-site support in and around Reus, '
  'depending on the service.',
  ['Windows, Linux y macOS', 'Equipos y redes locales', 'Servidores y servicios en red'],
  ['Windows, Linux & macOS', 'Computers & local networks', 'Servers & network services']),
 ('asesoramiento',
  'ASESORAMIENTO DIGITAL',
  'DIGITAL ADVICE',
  'Decide qué necesitas antes de invertir.',
  'Know what you need before investing.',
  '¿No sabes si necesitas una web, una tienda, un campus virtual o mejorar lo que ya utilizas? Revisamos tu punto de '
  'partida, tus objetivos y tus prioridades para definir una solución que encaje contigo. La primera consulta y el '
  'asesoramiento inicial son gratuitos y personalizados; el trabajo posterior se concreta en una propuesta.',
  'Not sure whether you need a website, a store, a learning platform or improvements to your existing tools? We review '
  'your starting point, goals and priorities to define a solution that fits. The first consultation and initial advice '
  'are free and personalised; any subsequent work is scoped in a proposal.',
  ['Consulta inicial gratuita y sin compromiso',
   'Orientación sobre herramientas y opciones',
   'Prioridades, próximos pasos y alcance del proyecto'],
  ['Free initial consultation with no obligation',
   'Guidance on tools and options',
   'Priorities, next steps and project scope'])]

def service_rows(full=False):
    actions = {
        'web': ('DISEÑAR MI WEB', 'DESIGN MY WEBSITE'),
        'ecommerce': ('ABRIR MI TIENDA', 'LAUNCH MY STORE'),
        'apps': ('CREAR MI APLICACIÓN', 'BUILD MY APP'),
        'academias-online': ('CREAR MI ACADEMIA', 'BUILD MY ACADEMY'),
        'automatizacion': ('AUTOMATIZAR MI NEGOCIO', 'AUTOMATE MY BUSINESS'),
        'hosting-correo': ('CONFIGURAR DOMINIO Y CORREO', 'SET UP DOMAIN & EMAIL'),
        'mantenimiento': ('CUIDAR MI WEB', 'LOOK AFTER MY WEBSITE'),
        'sistemas': ('RESOLVER UNA INCIDENCIA', 'SOLVE AN IT ISSUE'),
        'asesoramiento': ('PEDIR ORIENTACIÓN', 'GET ADVICE'),
    }
    result=''
    for i,(slug,es,en,des,den,longes,longen,bullets,bullen) in enumerate(SERVICES):
        if full:
            bullets_html=''.join('<li>'+t(a,b)+'</li>' for a,b in zip(bullets,bullen))
            result+=f'<article class="service-detail" id="{slug}"><span class="service-number">0{i+1}</span><div>{t(es,en,"h2")}{t(des,den,"p","service-intro")}</div><div>{t(longes,longen,"p")}<ul>{bullets_html}</ul><a class="text-link" href="/contacto/?servicio={slug}">{t(*actions[slug])}{arrow()}</a></div></article>'
        else:
            result+=f'<a class="service-row" href="/servicios/#{slug}"><span class="service-number">0{i+1}</span>{t(es,en,"h3")}{t(des,den,"p")}{arrow(True)}</a>'
    return result

def page_head(kicker, heading_es, heading_en, desc_es, desc_en):
    return f'<section class="page-heading wrap">{t(*kicker,tag="p",cls="eyebrow")}{t(heading_es,heading_en,"h1")}{t(desc_es,desc_en,"p","lead")}</section>'

def technology_marquee():
    technologies = json.loads((OUT / 'assets/technologies/sources.json').read_text())
    items = ''.join(f'<li class="technology-logo"><img src="/assets/technologies/{item["slug"]}.svg" alt="" width="28" height="28" decoding="async"><span>{esc(item["label"])}</span></li>' for item in technologies if 'error' not in item)
    return f'''<div class="technology-band" role="region" aria-label="Tecnologías y herramientas" data-es="Tecnologías y herramientas" data-en="Technologies and tools" data-i18n-attr="aria-label">
    <div class="technology-window"><div class="technology-track"><ul class="technology-group">{items}</ul><ul class="technology-group" aria-hidden="true" inert>{items}</ul></div></div></div>'''

def featured_work():
    previous = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>'
    next_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg>'
    return f'''<section class="work-section wrap" id="seleccion" aria-labelledby="work-title">
    <div class="section-top"><div>{t('PROYECTOS · DISEÑO Y DESARROLLO','PROJECTS · DESIGN & DEVELOPMENT','p','eyebrow')}<h2 id="work-title">{t('Proyectos con identidad propia.','Projects with their own identity.')}</h2></div>
    <div class="work-tools"><a class="text-link" href="/proyectos/">{t('VER TODOS','VIEW ALL')}{arrow(True)}</a><span class="gallery-count" aria-hidden="true"><span data-project-range>01–02</span><span class="gallery-total"> / 04</span></span></div></div>
    <div class="gallery-stage">
    <button class="gallery-arrow" type="button" data-project-prev aria-controls="project-gallery" aria-label="Proyecto anterior" data-es="Proyecto anterior" data-en="Previous project" data-i18n-attr="aria-label" disabled>{previous}</button>
    <div class="project-carousel" id="project-gallery" role="region" aria-labelledby="work-title" tabindex="0">{''.join(project_card(p,i,True) for i,p in enumerate(PROJECTS))}</div>
    <button class="gallery-arrow gallery-next" type="button" data-project-next aria-controls="project-gallery" aria-label="Proyecto siguiente" data-es="Proyecto siguiente" data-en="Next project" data-i18n-attr="aria-label">{next_icon}</button>
    </div>
    <p class="sr-only" id="gallery-status" role="status" aria-live="polite" aria-atomic="true"></p>
    <div class="gallery-footer">{t('¿Te imaginas tu proyecto aquí?','Can you picture your project here?','p')}<a class="text-link" href="{WHATSAPP}" target="_blank" rel="noopener noreferrer" data-whatsapp data-url-es="{WHATSAPP}" data-url-en="{WHATSAPP_EN}">{t('CREEMOS EL TUYO','LET’S CREATE YOURS')}{arrow(True)}</a></div></section>'''

def featured_services():
    cards = [('web',
      'WEB A MEDIDA',
      'CUSTOM WEBSITES',
      'Una web a la altura de tu marca.',
      'A website worthy of your brand.',
      'Webs corporativas, landing pages, blogs y portfolios. También renovamos tu web actual.',
      'Business websites, landing pages, blogs and portfolios. We also refresh existing websites.',
      'Diseño · Landing pages · Rediseño',
      'Design · Landing pages · Redesign',
      '<rect x="5" y="8" width="38" height="30" rx="4"/><path d="M5 17h38M11 12.5h.01M16 12.5h.01m1 11-5 4 5 4m14-8 5 4-5 '
      '4m-5-10-4 12"/>'),
     ('ecommerce',
      'TIENDAS ONLINE',
      'ONLINE STORES',
      'Tu catálogo, listo para vender.',
      'Your catalogue, ready to sell.',
      'Productos, pagos y envíos en una tienda propia, con migraciones e integraciones según tu proyecto.',
      'Products, payments and shipping in your own store, with migrations and integrations scoped to your project.',
      'Catálogo · Venta · Integraciones',
      'Catalogue · Sales · Integrations',
      '<path d="M8 16h32l-2 25H10L8 16Zm9 0v-4a7 7 0 0 1 14 0v4M17 24h.01M31 24h.01"/><path d="m19 31 4 4 7-8"/>'),
     ('apps',
      'APPS Y SOFTWARE',
      'APPS & SOFTWARE',
      'Tu idea, convertida en una app.',
      'Your idea, brought to life in an app.',
      'Aplicaciones móviles y herramientas a medida, diseñadas alrededor de tus usuarios.',
      'Mobile apps and custom tools designed around your users.',
      'Móvil · Web · APIs',
      'Mobile · Web · APIs',
      '<rect x="11" y="3" width="26" height="42" rx="5"/><path d="M19 8h10M21 39h6m-7-23-5 6 5 6m8-12 5 6-5 6"/>'),
     ('academias-online',
      'ACADEMIAS ONLINE',
      'ONLINE ACADEMIES',
      'Tu conocimiento, sin fronteras.',
      'Your knowledge, without borders.',
      'Un campus virtual con tus cursos, acceso para alumnos y seguimiento del aprendizaje.',
      'A learning platform with your courses, student access and progress tracking.',
      'Moodle · Cursos · Alumnos',
      'Moodle · Courses · Students',
      '<path d="m3 16 21-10 21 10-21 10L3 16Zm8 4v12c8 7 18 7 26 0V20M44 17v16"/><path d="M7 39h34"/>'),
     ('automatizacion',
      'CRM Y AUTOMATIZACIÓN',
      'CRM & AUTOMATION',
      'Menos tareas. Más tiempo.',
      'Fewer tasks. More time.',
      'Conecta tu web, tus clientes y tus herramientas para simplificar el trabajo diario.',
      'Connect your website, customers and tools to simplify everyday work.',
      'Zoho · Integraciones · Flujos',
      'Zoho · Integrations · Workflows',
      '<rect x="3" y="5" width="14" height="12" rx="3"/><rect x="31" y="31" width="14" height="12" rx="3"/><path d="M17 '
      '11h12a9 9 0 0 1 9 9v11m-4-4 4 4 4-4M31 37H19a9 9 0 0 1-9-9V17m-4 4 4-4 4 4"/>'),
     ('hosting-correo',
      'DOMINIO, HOSTING Y CORREO',
      'DOMAIN, HOSTING & EMAIL',
      'Tu marca, con dirección propia.',
      'Your brand, with its own address.',
      'Configuramos el alojamiento, el dominio y el correo profesional para poner tu proyecto en marcha.',
      'We configure hosting, your domain and professional email to get your project online.',
      'Dominio · Alojamiento · Correo',
      'Domain · Hosting · Email',
      '<rect x="5" y="5" width="38" height="14" rx="3"/><path d="M11 12h.01M17 12h.01M30 12h6"/><rect x="5" y="25" '
      'width="38" height="18" rx="3"/><path d="m6 27 18 11 18-11"/>'),
     ('mantenimiento',
      'MANTENIMIENTO WEB',
      'WEBSITE MAINTENANCE',
      'Tu web, siempre atendida.',
      'Ongoing care for your website.',
      'Actualizaciones, copias de seguridad y soporte para seguir mejorando tras el lanzamiento.',
      'Updates, backups and support to keep improving after launch.',
      'Actualizaciones · Copias · Soporte',
      'Updates · Backups · Support',
      '<path d="m24 4 16 6v12c0 10-16 21-16 21S8 32 8 22V10L24 4Z"/><path d="m16 23 6 6 11-12"/>'),
     ('sistemas',
      'SISTEMAS Y SOPORTE IT',
      'SYSTEMS & IT SUPPORT',
      'Tu tecnología, bien conectada.',
      'Your technology, well connected.',
      'Equipos, redes y servidores preparados para las necesidades de tu actividad.',
      'Computers, networks and servers configured around your business needs.',
      'Equipos · Redes · Servidores',
      'Computers · Networks · Servers',
      '<rect x="12" y="3" width="24" height="15" rx="3"/><path d="M24 18v10M8 28h32M8 28v6m32-6v6M24 28v6"/><rect x="3" '
      'y="34" width="10" height="9" rx="2"/><rect x="19" y="34" width="10" height="9" rx="2"/><rect x="35" y="34" '
      'width="10" height="9" rx="2"/>'),
     ('asesoramiento',
      'ASESORAMIENTO DIGITAL',
      'DIGITAL ADVICE',
      'El primer paso, con claridad.',
      'A clear first step.',
      'Cuéntame tu idea. Te ayudo a elegir la solución y a ordenar las prioridades de tu proyecto.',
      'Tell me your idea. I help you choose a solution and set priorities for your project.',
      'Consulta inicial gratuita',
      'Free initial consultation',
      '<path d="M6 6h36v26H22l-10 9v-9H6V6Z"/><path d="M14 15h20M14 22h14"/>')]
    content = ''
    for i,(slug,cat_es,cat_en,title_es,title_en,desc_es,desc_en,meta_es,meta_en,icon) in enumerate(cards):
        content += f'''<a class="solution-card" href="/servicios/#{slug}"><div class="solution-card-top"><span class="solution-icon"><svg viewBox="0 0 48 48" aria-hidden="true">{icon}</svg></span><span class="solution-number">0{i+1}</span></div>{t(cat_es,cat_en,'p','solution-category')}{t(title_es,title_en,'h3')}{t(desc_es,desc_en,'p','solution-description')}<div class="solution-card-bottom">{t(meta_es,meta_en,'span','solution-meta')}<span class="solution-open"><span class="sr-only">{t('Ver servicio','View service')}</span>{arrow(True)}</span></div></a>'''
    return f'''<section class="services-section wrap" aria-labelledby="solutions-title"><div class="section-top"><div>{t('QUÉ HACEMOS · SOLUCIONES PARA TU NEGOCIO','WHAT WE DO · SOLUTIONS FOR YOUR BUSINESS','p','eyebrow')}<h2 id="solutions-title">{t('¿Qué quieres hacer posible?','What do you want to make possible?')}</h2></div>{t('Desde una primera web hasta un campus virtual: diseñamos, conectamos y ponemos a punto las herramientas que necesita tu negocio.','From your first website to a learning platform: we design, connect and set up the tools your business needs.','p','section-intro')}</div><div class="solutions-grid">{content}</div></section>'''

def work_process():
    steps = [
        ('Consulta gratuita', 'Free consultation', 'Te escuchamos y te asesoramos de forma personalizada para entender tu idea, tus objetivos y lo que necesita tu negocio.', 'We listen and offer personalised advice to understand your idea, goals and business needs.'),
        ('Propuesta a medida', 'A tailored proposal', 'Definimos la solución y te presentamos el alcance, el presupuesto y los plazos. Tú decides si avanzamos.', 'We define the solution and present the scope, budget and timeline. You decide whether to proceed.'),
        ('Diseño y desarrollo', 'Design & development', 'Diseñamos, construimos y revisamos contigo los avances para dar forma a tu proyecto paso a paso.', 'We design, build and review progress with you, bringing your project to life step by step.'),
        ('Pruebas y lanzamiento', 'Testing & launch', 'Comprobamos el funcionamiento, ponemos tu proyecto en marcha y te explicamos cómo utilizarlo.', 'We check that everything works, launch your project and show you how to use it.')
    ]
    items = ''.join(f'<li class="workflow-step"><span class="workflow-number" aria-hidden="true">0{i+1}</span>{t(es,en,"h3")}{t(desc_es,desc_en,"p")}</li>' for i,(es,en,desc_es,desc_en) in enumerate(steps))
    consult_es = 'https://wa.me/34635977484?text=' + quote('Hola, Yonathan. Me gustaría una consulta gratuita y asesoramiento personalizado para mi proyecto.')
    consult_en = 'https://wa.me/34635977484?text=' + quote('Hi Yonathan. I would like a free consultation and personalised advice for my project.')
    return f'''<section class="workflow-section wrap" aria-labelledby="workflow-title"><div class="section-top"><div>{t('CÓMO TRABAJAMOS','HOW WE WORK','p','eyebrow')}<h2 id="workflow-title">{t('De tu idea al lanzamiento, en 4 pasos.','From your idea to launch, in 4 steps.')}</h2></div>{t('Un proceso claro, con comunicación directa y decisiones compartidas en cada etapa.','A clear process, with direct communication and shared decisions at every stage.','p','section-intro')}</div><ol class="workflow-steps">{items}</ol>
    <div class="consultation-panel"><div><p class="consultation-kicker">{t('GRATUITO · PERSONALIZADO','FREE · PERSONALISED')}</p>{t('Todo empieza por una conversación.','It all starts with a conversation.','h3')}{t('La consulta y el asesoramiento son totalmente gratuitos y personalizados. Cuéntame tu idea y vemos qué solución encaja contigo.','The consultation and advice are completely free and personalised. Tell me about your idea and we’ll explore the right solution for you.','p','consultation-description')}</div><a class="button button-solid consultation-button" href="{consult_es}" data-whatsapp data-url-es="{consult_es}" data-url-en="{consult_en}" target="_blank" rel="noopener noreferrer">{t('QUIERO MI CONSULTA GRATUITA','GET MY FREE CONSULTATION')}{arrow(True)}</a></div></section>'''

def brand_showreel():
    clips = json.loads((OUT / 'assets/brand-films/playlist.json').read_text())
    playlist = ''.join(f'<li><a href="{asset_url("brand-films/"+clip["file"])}" data-es="{esc(clip["es"],quote=True)}" data-en="{esc(clip["en"],quote=True)}">{esc(clip["es"])}</a></li>' for clip in clips)
    play_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="play-icon" d="m9 5 10 7-10 7Z"/><path class="pause-icon" d="M8 5v14M16 5v14"/></svg>'
    sound_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path class="sound-on-icon" d="M16 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/><path class="sound-off-icon" d="m17 9 5 6m0-6-5 6"/></svg>'
    full_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg>'
    return f'''<figure class="brand-showreel" data-brand-showreel>
      <video id="brand-showreel-video" class="brand-showreel-video" controls playsinline muted loop preload="none" poster="{asset_url('brand-films/poster.jpg')}" width="1920" height="1080" aria-label="Identidad visual de Antoni Tech" data-es="Identidad visual de Antoni Tech" data-en="Antoni Tech visual identity" data-i18n-attr="aria-label"><source src="{asset_url('brand-films/'+clips[0]['file'])}" type="video/mp4">{t('Tu navegador no admite vídeo.','Your browser does not support video.')}</video>
      <figcaption class="brand-showreel-caption"><div><p class="brand-showreel-label">{t('ANTONI TECH EN MOVIMIENTO','ANTONI TECH IN MOTION')}</p><p class="brand-clip-title" data-brand-title>{esc(clips[0]['es'])}</p></div>
        <div class="brand-showreel-controls" data-brand-toolbar hidden>
          <span data-brand-count aria-label="Vídeo / Video">01 / {len(clips):02}</span>
          <button type="button" data-brand-prev aria-controls="brand-showreel-video" aria-label="Vídeo anterior" data-es="Vídeo anterior" data-en="Previous video" data-i18n-attr="aria-label">‹</button>
          <button type="button" data-brand-play data-playing="false" aria-controls="brand-showreel-video" aria-label="Reproducir vídeo">{play_icon}</button>
          <button type="button" data-brand-next aria-controls="brand-showreel-video" aria-label="Vídeo siguiente" data-es="Vídeo siguiente" data-en="Next video" data-i18n-attr="aria-label">›</button>
          <button type="button" data-brand-sound data-muted="true" aria-controls="brand-showreel-video" aria-label="Activar sonido" aria-pressed="false">{sound_icon}</button>
          <button type="button" data-brand-fullscreen aria-label="Pantalla completa">{full_icon}</button>
        </div>
      </figcaption>
      <p class="brand-video-notice" data-brand-notice role="status" hidden>{t('No se ha podido reproducir este vídeo. Prueba el siguiente.','This video could not be played. Try the next one.')}</p><ol data-brand-playlist hidden>{playlist}</ol>
    </figure>'''

def brand_origin(compact=False):
    if compact:
        return '<aside class="brand-origin brand-origin-compact">'+t('¿Por qué Antoni Tech?','Why Antoni Tech?','h3')+t('Antoni viene de Antonio, mi segundo nombre, y de cómo algunas personas empezaron a llamarme en Cataluña. Tech refleja mi profesión y mi pasión por la tecnología. Un nombre que une mi historia personal con el proyecto que construyo cada día.','Antoni comes from Antonio, my middle name, and how some people began calling me in Catalonia. Tech reflects my profession and my passion for technology. A name that connects my personal story with the business I’m building every day.','p')+'</aside>'
    paragraphs = [
        ('Mi nombre es Yonathan Antonio. En Cataluña, algunas personas empezaron a llamarme Antoni, la forma catalana de mi segundo nombre. Me gustó, lo sentí cercano y decidí que formara parte de la identidad de mi proyecto.','My name is Yonathan Antonio. In Catalonia, some people began calling me Antoni, the Catalan form of my middle name. I liked it, it felt familiar, and I decided to make it part of my business identity.'),
        ('Tech representa mi profesión y mi pasión por la tecnología: diseñar, programar y crear soluciones digitales que respondan a necesidades reales.','Tech represents my profession and my passion for technology: designing, programming and creating digital solutions that meet real needs.'),
        ('Antoni Tech une esa historia personal con mi forma de trabajar: escuchar, entender tu negocio y crear soluciones a medida. Un proyecto propio, con trato directo y el compromiso de cuidar cada detalle, desde la primera conversación hasta la puesta en marcha.','Antoni Tech brings that personal story together with the way I work: listening, understanding your business and creating tailored solutions. My own venture, built on direct communication and a commitment to every detail, from the first conversation to launch.')
    ]
    return '<section class="brand-origin-section wrap" aria-labelledby="brand-origin-title"><div class="brand-origin">'+t('EL ORIGEN DE LA MARCA','THE STORY BEHIND THE NAME','p','eyebrow')+'<h2 id="brand-origin-title">'+t('¿Por qué Antoni Tech?','Why Antoni Tech?')+'</h2>'+''.join(t(es,en,'p') for es,en in paragraphs)+'</div></section>'

def bio_teaser():
    return f'''<section class="about-teaser">{brand_showreel()}<div class="about-teaser-copy">{t('DETRÁS DE LOS PROYECTOS DE ANTONI TECH','BEHIND THE ANTONI TECH PROJECTS','p','eyebrow')}{t('Hola, soy Yonathan Alvarado.','Hi, I’m Yonathan Alvarado.','h2')}{t('Desarrollador web full stack y diseñador gráfico freelance, programador y Técnico en Sistemas Microinformáticos y Redes.','Freelance full-stack web developer and graphic designer, programmer and Computer Systems & Networking Technician.','p','bio-role')}{t('Combino diseño, desarrollo frontend y backend y conocimientos de sistemas para convertir ideas en soluciones digitales útiles, cuidadas y fáciles de usar.','I combine design, frontend and backend development, and systems knowledge to turn ideas into useful, carefully crafted digital solutions that are easy to use.','p')}{t('Desde Reus, trabajo con emprendedores y empresas de España y otros países. Me implico en cada proyecto con trato directo, atención al detalle y soluciones a medida.','Based in Reus, I work with entrepreneurs and businesses in Spain and beyond. I bring direct communication, attention to detail and tailored solutions to every project.','p')}{brand_origin(True)}<a class="text-link" href="/sobre-mi/">{t('CONOCE MI HISTORIA','GET TO KNOW ME')}{arrow(True)}</a></div></section>'''

def home():
    slide_controls=''.join(f'<button class="slide-selector" type="button" data-slide="{i}" aria-pressed="{str(i==0).lower()}" aria-label="{label_es}" data-es="{label_es}" data-en="{label_en}" data-i18n-attr="aria-label" aria-controls="hero-copy"><span aria-hidden="true"></span></button>' for i,(label_es,label_en) in enumerate([('1. Vídeo de Antoni Tech','1. Antoni Tech film'),('2. Diseño, código e impacto','2. Design, code and impact'),('3. Soluciones digitales para tu negocio','3. Digital solutions for your business')]))
    return f'''<section class="hero" aria-labelledby="hero-title"><img class="hero-art" src="/assets/hero-metallic.png" width="1672" height="941" fetchpriority="high" alt="Logo metálico de Antoni Tech en cian y magenta, con reflejos sobre el suelo"><img class="hero-logo-light" src="/assets/hero-metallic.png" alt="" aria-hidden="true" width="1672" height="941"><img class="hero-services-art" src="{asset_url('hero-services.png')}" width="1672" height="941" alt="Diseño de software con una interfaz web, una aplicación móvil y módulos conectados" data-es="Diseño de software con una interfaz web, una aplicación móvil y módulos conectados" data-en="Software design with a web interface, a mobile app and connected modules" data-i18n-attr="alt" loading="eager" decoding="async" aria-hidden="true"><div class="hero-film-layer" aria-hidden="true" inert><video class="hero-film" playsinline muted preload="none" poster="/assets/hero-metallic.png" controls aria-label="Vídeo de presentación de Antoni Tech"><source src="{asset_url('hero-cyber-film.mp4')}" type="video/mp4">{t('Tu navegador no admite vídeo.','Your browser does not support video.')}</video><button class="hero-film-start" type="button" hidden>{t('Reproducir vídeo','Play video')} ▷</button><button class="hero-sound" type="button" aria-pressed="false" aria-label="Activar sonido"><span aria-hidden="true">♪</span><span data-hero-sound-label>{t('Activar sonido','Enable sound')}</span></button></div><div class="hero-shade"></div>
    <div class="hero-content wrap"><div id="hero-copy"><p class="eyebrow" data-hero-eyebrow data-es="DESARROLLO WEB · DISEÑO · TECNOLOGÍA" data-en="WEB DEVELOPMENT · DESIGN · TECHNOLOGY">DESARROLLO WEB · DISEÑO · TECNOLOGÍA</p><h1 id="hero-title"><span data-hero-line data-es="DISEÑO." data-en="DESIGN.">DISEÑO.</span><br><span data-hero-line data-es="CÓDIGO." data-en="CODE.">CÓDIGO.</span><br><span data-hero-line data-es="IMPACTO." data-en="IMPACT.">IMPACTO.</span></h1><p class="hero-description" data-hero-description data-es="Webs, apps móviles y software a medida para dar forma a tu próximo proyecto." data-en="Websites, mobile apps and custom software to bring your next project to life.">Webs, apps móviles y software a medida para dar forma a tu próximo proyecto.</p></div>
    <div class="hero-actions">{button(WHATSAPP,'PEDIR PRESUPUESTO','REQUEST A QUOTE',external=True)}<a class="text-link" href="/proyectos/">{t('VER PROYECTOS','VIEW WORK')}{arrow(True)}</a></div></div>
    <div class="hero-bottom wrap"><div class="hero-signature"><p>Yonathan Alvarado</p>{t('Desarrollador Full Stack y Diseñador Gráfico · Freelance','Full Stack Developer & Graphic Designer · Freelance','p')}{t('Reus, España · Proyectos internacionales','Reus, Spain · International projects','p')}</div><a href="#seleccion" class="scroll-cue" aria-label="Ver proyectos seleccionados / Selected work">↓</a><div class="hero-controls"><div class="slide-selectors" role="group" aria-label="Presentación / Slideshow">{slide_controls}</div><button class="motion-toggle" type="button" aria-label="Pausar presentación" aria-pressed="false"><span class="sr-only" data-es="PAUSAR PRESENTACIÓN" data-en="PAUSE SLIDESHOW">PAUSAR PRESENTACIÓN</span><span aria-hidden="true">Ⅱ</span></button></div><span id="slide-status" class="sr-only" role="status"></span></div></section>
    {featured_work()}
    {reviews_markup(t)}
    {featured_services()}
    {work_process()}
    {bio_teaser()}{cta()}'''

def services():
    tech=[('DESARROLLO','DEVELOPMENT','HTML · CSS · JavaScript · React · PHP · Python · Java'),('DATOS E INTEGRACIONES','DATA & INTEGRATIONS','SQL · phpMyAdmin · APIs · XML · JSON'),('WEB Y NEGOCIO','WEB & BUSINESS','WordPress · WooCommerce · Moodle · CRM · Zoho'),('DISEÑO Y SISTEMAS','DESIGN & SYSTEMS','Figma · Adobe · Git · GitHub · Windows · Linux · macOS')]
    return page_head(('SERVICIOS / SOLUCIONES A MEDIDA','SERVICES / TAILORED SOLUTIONS'),'TECNOLOGÍA QUE TRABAJA CONTIGO.','TECHNOLOGY THAT WORKS WITH YOU.','No necesitas todas las herramientas. Necesitas una solución que encaje con tu negocio.','You don’t need every tool. You need a solution that fits your business.')+f'''<section class="service-details wrap">{service_rows(True)}</section>{work_process()}<section class="tech-section wrap">{t('LAS HERRAMIENTAS SIGUEN A LA IDEA.','THE TOOLS FOLLOW THE IDEA.','h2')}{t('La elección técnica y las integraciones se concretan en cada propuesta.','The technical approach and integrations are defined in each proposal.','p','muted')}<div class="tech-grid">{''.join('<div>'+t(es,en,'h3')+f'<p>{tools}</p></div>' for es,en,tools in tech)}</div></section>{cta()}'''

def projects():
    filters=[('all','TODOS','ALL'),('commerce','E-COMMERCE','E-COMMERCE'),('platform','PLATAFORMAS','PLATFORMS'),('business','WEBS DE NEGOCIO','BUSINESS WEBSITES')]
    return page_head(('PROYECTOS / UNA SELECCIÓN','WORK / A SELECTION'),'DEL CONCEPTO A LA PANTALLA.','FROM CONCEPT TO SCREEN.','Marcas, personas y negocios con algo que contar. Estos son algunos proyectos en los que he trabajado.','Brands, people and businesses with something to say. Here are some projects I’ve worked on.')+f'''<section class="all-work wrap"><div class="project-filters" role="group" aria-label="Filtrar proyectos / Filter projects">{''.join(f'<button type="button" data-filter="{v}" aria-pressed="{str(v=="all").lower()}">{t(es,en)}</button>' for v,es,en in filters)}</div><p class="sr-only" id="filter-status" aria-live="polite"></p><div class="project-grid">{''.join(project_card(p,i) for i,p in enumerate(PROJECTS))}</div></section>{cta()}'''

def about():
    return page_head(('SOBRE MÍ / YONATHAN ALVARADO','ABOUT / YONATHAN ALVARADO'),'DISEÑO, CÓDIGO Y VISIÓN DE CONJUNTO.','DESIGN, CODE AND THE BIG PICTURE.','Soy el desarrollador web y diseñador gráfico freelance detrás de Antoni Tech. Trabajas directamente conmigo para dar forma a tu idea, desde la primera conversación hasta el lanzamiento.','I’m the freelance web developer and graphic designer behind Antoni Tech. You work directly with me to bring your idea to life, from our first conversation through to launch.')+f'''<section class="about-story">{brand_showreel()}<div class="story-copy">{t('UNA TRAYECTORIA QUE CONECTA DISCIPLINAS.','A BACKGROUND THAT CONNECTS DISCIPLINES.','h2')}{t('Soy desarrollador web full stack y diseñador gráfico freelance, programador y Técnico en Sistemas Microinformáticos y Redes. Mi recorrido une diseño gráfico, desarrollo frontend y backend y conocimientos de sistemas para cuidar tanto lo que ve tu cliente como lo que hace que todo funcione.','I am a freelance full-stack web developer and graphic designer, programmer and Computer Systems & Networking Technician. My background combines graphic design, frontend and backend development, and systems knowledge to take care of both what your customer sees and what makes everything work.','p')}{t('También soy Técnico Superior en Higiene Bucodental y tengo experiencia en clínica dental y atención al público. Esa trayectoria me ha enseñado a escuchar, trabajar con precisión, organizar tareas y gestionar los tiempos sin perder el trato cercano con las personas.','I also hold a Higher Vocational Qualification in Dental Hygiene and have experience in dental clinics and customer service. That background taught me to listen, work precisely, organise tasks and manage time while maintaining a personal approach.','p')}{t('Hoy aplico esa forma de trabajar a proyectos digitales: entender primero, proponer con criterio y mantener una comunicación directa durante el proceso.','Today I apply that approach to digital projects: understand first, make thoughtful proposals and keep communication direct throughout the process.','p')}<div class="signature-line"><strong>Yonathan Alvarado</strong>{t('Desarrollador Full Stack y Diseñador Gráfico · Freelance','Full Stack Developer & Graphic Designer · Freelance','span')}</div></div></section>{brand_origin()}<section class="about-principles wrap"><div>{t('LO QUE PUEDES ESPERAR','WHAT YOU CAN EXPECT','p','eyebrow')}<h2>{t('CERCANÍA.','DIRECT CONTACT.')}<br>{t('CRITERIO.','CLEAR THINKING.')}<br>{t('COMPROMISO.','COMMITMENT.','span','muted')}</h2></div><div class="principle-list">{''.join('<article>'+t(es,en,'h3')+t(de,dn,'p')+'</article>' for es,en,de,dn in [('Hablar con quien hace el trabajo','Talk to the person doing the work','Una relación directa, sin intermediarios innecesarios.','A direct relationship, without unnecessary intermediaries.'),('Saber qué vamos a construir','Know what we’re building','Alcance y entregables acordados antes de empezar.','Scope and deliverables agreed before we begin.'),('Entender las decisiones','Understand the decisions','Explicaciones claras, también cuando la mejor opción es simplificar.','Clear explanations, including when simplifying is the best option.')])}</div></section>{cta()}'''

def contact():
    options=''.join(f'<option value="{slug}" data-es="{es}" data-en="{en}">{es}</option>' for slug,es,en,*_ in SERVICES)
    faqs=[('¿Trabajas fuera de España?','Do you work outside Spain?','Sí. Podemos organizar el proyecto a distancia y acordar canales de comunicación, horarios y entregas.','Yes. We can organise the project remotely and agree on communication channels, times and deliverables.'),('¿Cuánto cuesta una web?','How much does a website cost?','Depende de sus páginas, contenidos, diseño e integraciones. Tras conocer tu idea, preparo una propuesta con alcance y presupuesto.','It depends on the pages, content, design and integrations. Once I understand your idea, I prepare a proposal with scope and budget.'),('¿Puedes mejorar una web que ya existe?','Can you improve an existing website?','Sí. Primero revisamos su estado y tus objetivos para decidir qué conservar, corregir o rediseñar.','Yes. First we review its current state and your goals to decide what to keep, fix or redesign.'),('¿Incluyes mantenimiento?','Is maintenance included?','Podemos acordarlo como un servicio adicional, con las tareas y la frecuencia que necesite tu web.','We can agree on it as an additional service, with the tasks and frequency your website needs.')]
    return page_head(('CONTACTO / EMPECEMOS POR TU IDEA','CONTACT / LET’S START WITH YOUR IDEA'),'HABLEMOS DE LO QUE VIENE.','LET’S TALK ABOUT WHAT’S NEXT.','Una idea, una web que mejorar o una tarea que simplificar. Cuéntame qué necesitas.','An idea, a website to improve or a task to simplify. Tell me what you need.')+f'''<section class="contact-layout wrap"><aside class="contact-details">{t('CONTACTO DIRECTO','DIRECT CONTACT','p','eyebrow')}<a class="contact-email" href="mailto:{EMAIL}">{EMAIL}{arrow(True)}</a><a class="contact-phone" href="tel:+34635977484">+34 635 977 484</a><p>{t('Reus, España','Reus, Spain')}<br>{t('Disponible para proyectos internacionales.','Available for international projects.')}</p><div class="social-row">{social()}<a href="{GITHUB}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div><div class="contact-note">{t('No hace falta tenerlo todo definido. Podemos empezar por lo que quieres conseguir.','You don’t need to have everything figured out. We can start with what you want to achieve.','p')}</div></aside><form id="contact-form" action="mailto:{EMAIL}" method="post" enctype="text/plain"><div class="form-row"><label for="name">{t('Tu nombre','Your name')}<input id="name" name="name" autocomplete="name" maxlength="100" required placeholder="¿Cómo te llamas?" data-es="¿Cómo te llamas?" data-en="What’s your name?" data-i18n-attr="placeholder"></label><label for="email">{t('Tu correo','Your email')}<input id="email" name="email" type="email" autocomplete="email" maxlength="180" required placeholder="nombre@empresa.com"></label></div><label for="service">{t('¿En qué puedo ayudarte?','How can I help?')}<select id="service" name="service"><option value="general" data-es="Quiero hablar de mi proyecto" data-en="I’d like to discuss my project">Quiero hablar de mi proyecto</option>{options}</select></label><label for="message">{t('Cuéntame tu idea','Tell me about your idea')}<textarea id="message" name="message" rows="5" minlength="10" maxlength="4000" required placeholder="Qué necesitas, para quién y en qué plazo te gustaría tenerlo…" data-es="Qué necesitas, para quién y en qué plazo te gustaría tenerlo…" data-en="What you need, who it’s for and your ideal timeline…" data-i18n-attr="placeholder"></textarea></label>{t('El formulario prepara tu mensaje. Tú lo envías desde tu aplicación de correo o WhatsApp. No se guarda en esta web.','This form prepares your message. You send it from your email app or WhatsApp. It is not stored on this website.','p','form-note')}<div class="form-actions"><button class="button button-solid" type="submit" name="channel" value="email">{t('PREPARAR CORREO','PREPARE EMAIL')}{arrow()}</button><button class="button button-outline" type="submit" name="channel" value="whatsapp">WHATSAPP{arrow(True)}</button></div><p id="form-status" class="form-status" role="status"></p></form></section><section class="faq-section wrap"><div>{t('ANTES DE EMPEZAR','BEFORE WE BEGIN','p','eyebrow')}<h2>{t('ALGUNAS','A FEW')}<br>{t('RESPUESTAS.','ANSWERS.','span','muted')}</h2></div><div class="faq-list">{''.join('<details><summary>'+t(es,en)+'<span aria-hidden="true">+</span></summary>'+t(de,dn,'p')+'</details>' for es,en,de,dn in faqs)}</div></section>'''

def breadcrumb(p):
    return '<nav class="breadcrumbs" aria-label="Ruta de navegación / Breadcrumb"><ol><li><a href="/">'+t('Inicio','Home')+'</a></li><li><a href="/proyectos/">'+t('Proyectos','Work')+'</a></li><li><span aria-current="page">'+esc(p['name'])+'</span></li></ol></nav>'

def case(p,index):
    nextp=PROJECTS[(index+1)%len(PROJECTS)]
    ext=button(p['url'],'VISITAR LA WEB','VISIT WEBSITE',external=True) if p['url'] else '<span class="status-tag">'+t('DISEÑO EN DESARROLLO','DESIGN IN DEVELOPMENT')+'</span>'
    return f'''<section class="case-header wrap">{breadcrumb(p)}{t(*p['category'],tag='p',cls='eyebrow')}<h1>{p['name']}</h1><div class="case-lead">{t(*p['intro'],tag='p',cls='lead')}{ext}</div><div class="case-meta"><div>{t('MI PAPEL','MY ROLE','span','eyebrow')}{t(*p['role'],tag='p')}</div><div>{t('HERRAMIENTAS','TOOLS','span','eyebrow')}<p>{p['tech']}</p></div><div>{t('ESTADO','STATUS','span','eyebrow')}{t(*p['status'],tag='p')}</div></div></section><div class="case-showcase {p['slug']} wrap"><div class="project-cover">{project_visual(p)}</div></div><section class="case-story wrap"><div>{t('01 / EL PUNTO DE PARTIDA','01 / THE STARTING POINT','p','eyebrow')}<h2>{t('UNA NECESIDAD.','A NEED.')}<br>{t('UNA DIRECCIÓN.','A DIRECTION.','span','muted')}</h2></div>{t(*p['challenge'],tag='p',cls='lead')}</section><section class="case-delivery wrap"><div>{t('02 / EL TRABAJO','02 / THE WORK','p','eyebrow')}{t('LO QUE DA FORMA AL PROYECTO.','WHAT SHAPES THE PROJECT.','h2')}</div><ol>{''.join('<li>'+t(es,en)+'</li>' for es,en in p['work'])}</ol></section><div class="case-note wrap">{t(*p['note'],tag='p')}</div><section class="next-project wrap">{t('SIGUIENTE PROYECTO','NEXT PROJECT','p','eyebrow')}<a href="/proyectos/{nextp['slug']}/">{nextp['name']}{arrow(True)}</a></section>{cta()}'''

def video_dialog():
    return f'''<dialog id="video-dialog" class="video-dialog"><button type="button" class="video-close close-button" aria-label="Cerrar vídeo / Close video">×</button><video id="brand-video" controls playsinline muted preload="none" width="1920" height="1080" aria-label="Presentación de Antoni Tech de cinco segundos"><source src="/assets/antoni-tech-5s.mp4" type="video/mp4">{t('Tu navegador no admite vídeo.','Your browser does not support video.')} <a href="/assets/antoni-tech-5s.mp4">{t('Abrir vídeo','Open video')}</a></video></dialog>'''

def asset_url(name):
    version = sha256((OUT / "assets" / name).read_bytes()).hexdigest()[:10]
    return f"/assets/{name}?v={version}"

# The assistant and optional server share only the information published on this site.
assistant_knowledge = {
    'owner': 'Yonathan Alvarado', 'brand': 'Antoni Tech', 'location': 'Reus, España',
    'profile': 'Desarrollador full stack y diseñador gráfico freelance; técnico en sistemas microinformáticos y redes.',
    'contact': {'whatsapp': '+34635977484', 'email': EMAIL},
    'services': [{'id': s[0], 'title': [s[1], s[2]], 'description': [s[5], s[6]]} for s in SERVICES],
    'technologies': [item['label'] for item in json.loads((OUT / 'assets/technologies/sources.json').read_text()) if 'error' not in item] + ['Moodle'],
    'projects': [{'name': p['name'], 'status': p['status'], 'url': p['url']} for p in PROJECTS],
    'terms': 'Consulta inicial gratuita y personalizada. Precio, alcance y plazos se acuerdan con Yonathan. No hay tarifas, disponibilidad ni fechas confirmadas en la web.'
}
(OUT / 'assets/assistant-knowledge.mjs').write_text('export const knowledge = ' + json.dumps(assistant_knowledge, ensure_ascii=False) + ';\n')

def write(route, title_es, title_en, description_es, description_en, content, home_page=False, draft=False):
    canonical=ORIGIN+route
    reviews_assets = f'<link rel="stylesheet" href="{asset_url("reviews.css")}"><script type="module" src="{asset_url("reviews.mjs")}"></script>' if home_page else ''
    robots='<meta name="robots" content="noindex, nofollow">' if draft else ''
    markup=f'''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">{robots}
<title data-es="{esc(title_es)} · Antoni Tech" data-en="{esc(title_en)} · Antoni Tech">{esc(title_es)} · Antoni Tech</title>
<meta name="description" content="{esc(description_es)}" data-es="{esc(description_es)}" data-en="{esc(description_en)}" data-i18n-attr="content"><meta name="theme-color" content="#080a0e"><link rel="canonical" href="{canonical}">
<meta property="og:title" content="{esc(title_es)} · Antoni Tech"><meta property="og:description" content="{esc(description_es)}"><meta property="og:type" content="website"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{ORIGIN}/assets/hero-metallic.png"><meta property="og:locale" content="es_ES"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/antoni-tech-logo.png" type="image/png"><link rel="preload" href="/assets/barlow-condensed-800.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="{asset_url('site.css')}"><link rel="stylesheet" href="{asset_url('minimal.css')}"><link rel="stylesheet" href="{asset_url('showcase.css')}"><link rel="stylesheet" href="{asset_url('navigation.css')}"><link rel="stylesheet" href="{asset_url('hero-media.css')}"><link rel="stylesheet" href="{asset_url('assistant.css')}"><link rel="stylesheet" href="{asset_url('responsive.css')}">{reviews_assets}<script type="module" src="{asset_url('assistant.mjs')}"></script><script src="{asset_url('site.js')}" defer></script><script src="{asset_url('navigation.js')}" defer></script></head>
<body id="top" class="{'home-page' if home_page else 'inner-page'}">{header(route)}<main id="contenido">{content}</main>{footer()}{video_dialog()}{assistant_markup(t)}</body></html>'''
    depth = len([part for part in route.split('/') if part])
    prefix = '../' * depth if depth else './'
    def local_reference(match):
        attribute, reference = match.groups()
        parts = urlsplit(reference)
        local_path = prefix + parts.path.lstrip('/')
        if attribute == 'href' and parts.path.endswith('/'):
            local_path += 'index.html'
        return attribute + '="' + urlunsplit(('', '', local_path, parts.query, parts.fragment)) + '"'
    markup = re.sub(r'(href|src|poster)="(/(?!/)[^"]*)"', local_reference, markup)
    path=OUT/route.strip('/')/'index.html'
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(markup)

write('/','Diseño. Código. Impacto.','Design. Code. Impact.','Desarrollo web, aplicaciones móviles y software a medida desde Reus para empresas y emprendedores en España y a nivel internacional.','Web development, mobile applications and custom software from Reus for businesses and entrepreneurs in Spain and internationally.',home(),True)
write('/servicios/','Servicios','Services','Diseño web, e-commerce, aplicaciones móviles, software a medida, automatización y soporte IT para tu negocio.','Web design, e-commerce, mobile applications, custom software, automation and IT support for your business.',services())
write('/proyectos/','Proyectos','Work','Una selección de proyectos de diseño y desarrollo web de Antoni Tech.','A selection of web design and development projects by Antoni Tech.',projects())
write('/sobre-mi/','Sobre mí','About','Conoce a Yonathan Alvarado, la persona detrás de Antoni Tech. Diseño, desarrollo web y sistemas.','Meet Yonathan Alvarado, the person behind Antoni Tech. Design, web development and systems.',about())
write('/contacto/','Hablemos de tu proyecto','Let’s talk about your project','Cuéntame qué necesitas. Contacta con Antoni Tech para tu próximo proyecto digital.','Tell me what you need. Contact Antoni Tech for your next digital project.',contact())
for i,p in enumerate(PROJECTS):write('/proyectos/'+p['slug']+'/',p['name'],p['name'],p['intro'][0],p['intro'][1],case(p,i))
for item in LEGAL_PAGES:
    write('/'+item[0]+'/',item[1],item[2],item[3],item[4],legal_page(item),draft=True)
print('Generated 12 pages (3 legal pages still require completion).')
