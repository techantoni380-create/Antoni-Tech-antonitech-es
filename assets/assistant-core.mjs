import { knowledge } from './assistant-knowledge.mjs?v=1';
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const langIndex = language => language === 'en' ? 1 : 0;
const copy = (pair, language) => pair[langIndex(language)];
export const prompts = [
  ['Servicios para mi negocio', 'Services for my business'],
  ['Crear una web o tienda', 'Build a website or store'],
  ['Apps y automatización', 'Apps and automation'],
  ['Tecnologías que utilizas', 'Technologies you use'],
  ['Ver proyectos', 'See projects'],
  ['Quiero trabajar contigo', 'I want to work with you']
];
const rules = [
  ['ecommerce', /\b(tienda|tiendas|ecommerce|woocommerce|prestashop|store|shop|vender|sell)\b/],
  ['academias-online', /\b(academia|academias|moodle|campus|curso|cursos|course|courses|academy|learning)\b/],
  ['automatizacion', /\b(automatizar|automatizacion|automation|automate|crm|zoho|tareas|tasks)\b/],
  ['apps', /\b(app|apps|aplicacion|aplicaciones|application|applications|movil|moviles|mobile|software|android|ios)\b/],
  ['hosting-correo', /\b(hosting|dominio|domain|dns|correo|email|nube|cloud|aws|docker|kubernetes)\b/],
  ['mantenimiento', /\b(mantenimiento|maintenance|actualizar|update|backup|copias|seguridad|security)\b/],
  ['sistemas', /\b(sistemas|systems|redes|network|networks|ordenador|computer|windows|linux|macos|servidor|server)\b/],
  ['asesoramiento', /\b(asesoramiento|asesorar|consulta|consultation|advice|orientation)\b/],
  ['web', /\b(web|webs|website|websites|pagina|frontend|backend|landing|wordpress)\b/]
];
export function guidedReply(question, language = 'es') {
  const q = normalize(question), en = language === 'en';
  if (/\b(hola|hello|hi|buenas)\b/.test(q) && q.length < 35) return copy(['¡Hola! Puedo orientarte sobre los servicios de Antoni Tech y ayudarte a contactar con Yonathan. ¿Qué quieres crear o mejorar?', 'Hello! I can guide you through Antoni Tech’s services and help you contact Yonathan. What would you like to build or improve?'], language);
  if (/\b(precio|precios|presupuesto|coste|cuesta|cost|price|pricing|budget|quote|plazo|plazos|deadline|timeline)\b/.test(q)) return copy(['La consulta inicial es gratuita y personalizada. El precio y el plazo dependen de las funciones, el diseño, los contenidos y las integraciones. Yonathan revisa tu idea y prepara una propuesta concreta; este asistente no puede confirmar tarifas ni fechas. Pulsa «Hablar con Yonathan» para explicarle tu proyecto.', 'The initial consultation is free and personalised. Price and timeline depend on features, design, content and integrations. Yonathan reviews your idea and prepares a specific proposal; this assistant cannot confirm prices or dates. Choose “Talk to Yonathan” to explain your project.'], language);
  if (/\b(trabajar|contratar|colaborar|colaboracion|contactar|contacto|whatsapp|hire|collaborate|collaboration|contact)\b|work with/.test(q)) return copy(['Puedes contactar directamente con Yonathan como freelance, tanto para encargar un proyecto como para proponer una colaboración. Trabaja desde Reus con clientes en España y otros países. Pulsa «Hablar con Yonathan»: podrás revisar tu mensaje y abrirlo en su WhatsApp.', 'You can contact Yonathan directly as a freelancer, whether to commission a project or propose a collaboration. Based in Reus, he works with clients in Spain and internationally. Choose “Talk to Yonathan” to review your message and open it in his WhatsApp.'], language);
  if (/\b(proyectos|portfolio|portafolio|projects|almazara|hernan|studi1)\b/.test(q)) return copy(['En Proyectos puedes explorar ALMAZARA y Todos con Hernán, además del proyecto editorial de Edis Alvarado. Studi1 aparece identificado como diseño en desarrollo. Puedes navegar por las vistas de las webs y ampliarlas desde sus tarjetas.', 'In Work you can explore ALMAZARA and Todos con Hernán, as well as Edis Alvarado’s author project. Studi1 is identified as a design in development. You can browse the website previews and expand them from their cards.'], language);
  if (/\b(tecnologia|tecnologias|technologies|technology|herramientas|tools|lenguajes|languages)\b/.test(q)) return copy(['La web presenta estas herramientas: ', 'The website presents these tools: '], language) + knowledge.technologies.join(', ') + copy(['. La elección depende de tu proyecto; no necesitas utilizarlas todas. Si me dices qué quieres conseguir, puedes trasladar esa idea a Yonathan.', '. The choice depends on your project; you do not need all of them. You can explain your goal and pass the idea to Yonathan.'], language);
  if (/\b(react|html|css|javascript|python|java|sql|json|xml|api|apis)\b/.test(q)) return copy(['HTML organiza el contenido, CSS define su presentación y JavaScript permite la interacción. React ayuda a construir interfaces. Python o Java pueden formar parte de la lógica y las automatizaciones; SQL consulta bases de datos. JSON y XML son formatos de intercambio, y una API permite conectar aplicaciones. La combinación adecuada se decide según las funciones y el mantenimiento que necesites.', 'HTML structures content, CSS controls presentation and JavaScript enables interaction. React helps build interfaces. Python or Java can support application logic and automation; SQL queries databases. JSON and XML are data exchange formats, and an API connects applications. The right combination depends on your features and maintenance needs.'], language);
  if (/\b(diseno grafico|graphic design|branding|logo|identidad|figma|photoshop|illustrator)\b/.test(q)) return copy(['Yonathan es diseñador gráfico y desarrollador full stack freelance. Puede plantear la identidad visual, las interfaces UI/UX y el diseño de tu proyecto digital. Las piezas, revisiones y entregables se acuerdan en la propuesta.', 'Yonathan is a freelance graphic designer and full-stack developer. He can work on visual identity, UI/UX interfaces and the design of your digital project. Assets, revisions and deliverables are agreed in the proposal.'], language);
  if (/\b(yonathan|quien|who|freelance|antoni|reus)\b/.test(q)) return copy(['Detrás de Antoni Tech está Yonathan Alvarado, desarrollador full stack, diseñador gráfico freelance y técnico en sistemas microinformáticos y redes. Combina diseño, programación y sistemas, con trato directo desde Reus. Su experiencia en clínica dental también aporta atención al detalle y organización del trabajo.', 'Behind Antoni Tech is Yonathan Alvarado, a freelance full-stack developer, graphic designer and computer systems and networking technician. He combines design, programming and systems, working directly with clients from Reus. His dental clinic experience also contributes attention to detail and organisation.'], language);
  if (/\b(servicios|services|negocio|business)\b/.test(q)) return (en ? 'Antoni Tech can help you with:\n\n' : 'Antoni Tech puede ayudarte con:\n\n') + knowledge.services.map(s => '• ' + s.title[langIndex(language)]).join('\n') + copy(['\n\nTambién integra diseño gráfico e interfaces. Puedes preguntar por cualquiera de estos servicios.', '\n\nGraphic and interface design are also part of the work. You can ask about any of these services.'], language);
  const matches = rules.filter(([,rule]) => rule.test(q)).slice(0,2);
  if (matches.length) return matches.map(([id]) => { const s = knowledge.services.find(s => s.id === id); return s.title[langIndex(language)] + '\n' + s.description[langIndex(language)]; }).join('\n\n');
  return copy(['Esta guía tiene respuestas preparadas sobre Antoni Tech; no puede resolver cualquier pregunta técnica. Prueba con web, apps, tienda online, automatización o sistemas. Si necesitas una respuesta personalizada, pulsa «Hablar con Yonathan» y revisa el mensaje que quieres enviarle.', 'This guide has prepared answers about Antoni Tech; it cannot answer every technical question. Try websites, apps, online stores, automation or systems. For a personalised answer, choose “Talk to Yonathan” and review the message you want to send.'], language);
}
export function makeBrief(messages, language = 'es') {
  const questions = messages.filter(m => m.role === 'user').slice(-3).map(m => m.content.trim()).filter(Boolean);
  const intro = language === 'en' ? 'Hi Yonathan, I found you through Antoni Tech and would like to discuss my project.' : 'Hola, Yonathan. He llegado desde Antoni Tech y me gustaría hablar contigo sobre mi proyecto.';
  return (intro + (questions.length ? '\n\n' + (language === 'en' ? 'My questions / idea:\n' : 'Mis consultas / idea:\n') + questions.join('\n') : '')).slice(0,1800);
}
export const whatsappURL = text => 'https://wa.me/34635977484?text=' + encodeURIComponent(String(text).trim().slice(0,1800));
export function validEndpoint(value) {
  if (!value) return '';
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash ? url.href : ''; } catch { return ''; }
}
