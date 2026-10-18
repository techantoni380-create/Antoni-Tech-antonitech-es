import { guidedReply, prompts, makeBrief, whatsappURL, validEndpoint } from './assistant-core.mjs?v=1';
import { assistantConfig } from './assistant-config.mjs?v=1';
const $ = id => document.getElementById(id);
const dialog = $('antoni-assistant'), launch = $('assistant-launch');
if (dialog && launch && typeof dialog.showModal === 'function') {
  const input = $('assistant-input'), messagesNode = $('assistant-messages'), suggestions = $('assistant-suggestions');
  const status = $('assistant-status'), brief = $('assistant-brief'), handoff = $('assistant-handoff');
  const endpoint = validEndpoint(assistantConfig.endpoint), consent = $('assistant-ai-consent');
  let messages = [], busy = false, controller = null, generation = 0, previousFocus = null;
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  const tr = (es, en) => language() === 'en' ? en : es;
  const aiEnabled = () => Boolean(endpoint && consent.checked);
  function syncViewport() {
    const viewport = window.visualViewport;
    if (!viewport) return;
    dialog.style.setProperty('--assistant-viewport-height', `${viewport.height}px`);
    dialog.style.setProperty('--assistant-offset-top', `${viewport.offsetTop}px`);
    dialog.classList.toggle('has-short-viewport', viewport.height < 480);
  }
  function scrollDown() { $('assistant-scroll').scrollTop = $('assistant-scroll').scrollHeight; }
  function bubble(content, role = 'assistant') {
    const item = document.createElement('p');
    item.className = 'assistant-message' + (role === 'user' ? ' is-user' : '');
    item.textContent = content; // Never render visitor or model text as HTML.
    messagesNode.append(item); scrollDown();
  }
  function updateMode() {
    $('assistant-mode').textContent = aiEnabled() ? tr('Asistente con IA · Servicios y tecnología', 'AI assistant · Services and technology') : tr('Guía de servicios · Respuestas preparadas', 'Service guide · Prepared answers');
    $('assistant-disclosure').textContent = aiEnabled() ? tr('Respuestas de IA. Revisa lo importante con Yonathan.', 'AI answers. Confirm important details with Yonathan.') : tr('Chat local. Se borra al recargar o cambiar de página.', 'Local chat. Clears when you reload or change page.');
    $('assistant-ai-notice').hidden = !endpoint;
  }
  function renderPrompts() {
    suggestions.replaceChildren();
    prompts.forEach(pair => { const button = document.createElement('button'); button.type = 'button'; button.textContent = pair[language() === 'en' ? 1 : 0]; button.addEventListener('click', () => submit(button.textContent)); suggestions.append(button); });
  }
  function reset() {
    generation++; controller?.abort(); controller = null; busy = false;
    messages = []; input.value = ''; brief.value = ''; handoff.hidden = true;
    messagesNode.replaceChildren(); status.textContent = ''; $('assistant-send').disabled = false;
    renderPrompts(); updateMode();
    bubble(aiEnabled() ? tr('Hola, soy el asistente con IA de Antoni Tech. Puedes preguntar sobre desarrollo, diseño, tecnología o tus ideas. Si quieres trabajar con Yonathan, te ayudo a preparar el contacto. No soy Yonathan y puedo cometer errores.', 'Hi, I’m Antoni Tech’s AI assistant. Ask about development, design, technology or your ideas. If you would like to work with Yonathan, I can help prepare your message. I am not Yonathan and I can make mistakes.') : tr('Hola, ¿qué te gustaría crear? Te ayudo a conocer los servicios de Antoni Tech y a contactar directamente con Yonathan. Esta guía utiliza respuestas preparadas.', 'Hi, what would you like to create? I can help you explore Antoni Tech’s services and contact Yonathan directly. This guide uses prepared answers.'));
  }
  function contact() {
    if (handoff.hidden) brief.value = makeBrief(messages, language());
    handoff.hidden = false; $('assistant-whatsapp').href = whatsappURL(brief.value);
    scrollDown(); brief.focus();
  }
  async function submit(value) {
    const text = String(value).trim().slice(0,1000); if (!text || busy) return;
    input.value = ''; bubble(text, 'user'); messages.push({role:'user',content:text});
    if (messages.length > 12) messages = messages.slice(-12);
    if (!aiEnabled()) { const answer = guidedReply(text, language()); bubble(answer); messages.push({role:'assistant',content:answer}); return; }
    busy = true; $('assistant-send').disabled = true; status.textContent = tr('Preparando respuesta…', 'Preparing an answer…');
    const turn = generation; controller = new AbortController(); const requestController = controller; const timeout = setTimeout(() => requestController.abort(), 25000);
    try {
      const response = await fetch(endpoint, {method:'POST', mode:'cors', credentials:'omit', referrerPolicy:'no-referrer', cache:'no-store', headers:{'Content-Type':'application/json'}, body:JSON.stringify({language:language(),messages:messages.slice(-9).map(m => ({role:m.role, content:m.content.slice(0,1500)}))}), signal:requestController.signal});
      if (!response.ok) throw new Error(response.status === 429 ? 'rate-limit' : 'unavailable');
      const data = await response.json();
      if (typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 5000) throw new Error('invalid-reply');
      if (turn !== generation) return;
      bubble(data.reply); messages.push({role:'assistant',content:data.reply}); status.textContent = '';
    } catch(error) {
      if (turn !== generation) return;
      status.textContent = error.message === 'rate-limit' ? tr('Se ha alcanzado el límite temporal. Puedes contactar por WhatsApp.', 'The temporary limit was reached. You can contact us on WhatsApp.') : tr('La IA no está disponible ahora. Te muestro una respuesta de la guía.', 'AI is unavailable right now. Here is an answer from the guide.');
      const answer = guidedReply(text, language()); bubble(tr('Guía de servicios:\n', 'Service guide:\n') + answer);
      messages.push({role:'assistant',content:answer});
    } finally { clearTimeout(timeout); if (turn === generation) {busy = false; controller = null; $('assistant-send').disabled = false;} }
  }
  launch.hidden = false;
  launch.addEventListener('click', () => {previousFocus = document.activeElement; syncViewport(); dialog.showModal(); launch.setAttribute('aria-expanded','true'); $('assistant-close').focus();});
  window.visualViewport?.addEventListener('resize', syncViewport);
  window.visualViewport?.addEventListener('scroll', syncViewport);
  $('assistant-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {launch.setAttribute('aria-expanded','false'); (previousFocus?.isConnected ? previousFocus : launch).focus();});
  $('assistant-form').addEventListener('submit', event => {event.preventDefault(); submit(input.value);});
  $('assistant-contact').addEventListener('click', contact);
  brief.addEventListener('input', () => {$('assistant-whatsapp').href = whatsappURL(brief.value);});
  $('assistant-reset').addEventListener('click', () => {reset(); input.focus();});
  consent.addEventListener('change', reset); // Enabling AI starts fresh: earlier local messages are not sent.
  new MutationObserver(() => {updateMode(); renderPrompts(); if (!messages.length) reset();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  reset();
}
