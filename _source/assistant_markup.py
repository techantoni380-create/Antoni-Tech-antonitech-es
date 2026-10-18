def assistant_markup(t):
    icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H4l-2 2v-10a10 10 0 0 1 18 0Z"/><path d="m9 8-3 3 3 3m6-6 3 3-3 3"/></svg>'
    return f'''<button type="button" id="assistant-launch" class="assistant-launch" aria-haspopup="dialog" aria-controls="antoni-assistant" aria-expanded="false" hidden>{icon}<span>{t('¿Tienes una idea?','Have an idea?')}</span></button>
    <dialog id="antoni-assistant" class="antoni-assistant" aria-labelledby="assistant-title">
      <div class="assistant-shell">
        <header class="assistant-heading"><span class="assistant-avatar" aria-hidden="true">&lt;/&gt;</span><div><h2 id="assistant-title">Antoni Tech</h2><p id="assistant-mode"></p></div><button type="button" class="assistant-close" id="assistant-close" aria-label="Cerrar asistente" data-es="Cerrar asistente" data-en="Close assistant" data-i18n-attr="aria-label">×</button></header>
        <div class="assistant-scroll" id="assistant-scroll">
          <div id="assistant-messages" class="assistant-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación" data-es="Conversación" data-en="Conversation" data-i18n-attr="aria-label"></div>
          <div class="assistant-suggestions" id="assistant-suggestions" aria-label="Temas sugeridos" data-es="Temas sugeridos" data-en="Suggested topics" data-i18n-attr="aria-label"></div>
          <section id="assistant-handoff" class="assistant-handoff" aria-labelledby="assistant-handoff-title" hidden>
            <h3 id="assistant-handoff-title">{t('Tu idea, directamente a Yonathan.','Your idea, straight to Yonathan.')}</h3>
            <label for="assistant-brief">{t('Revisa o escribe tu mensaje','Review or write your message')}</label>
            <textarea id="assistant-brief" rows="4" maxlength="1800"></textarea>
            <a id="assistant-whatsapp" class="assistant-primary" href="https://wa.me/34635977484" target="_blank" rel="noopener noreferrer">{t('ABRIR WHATSAPP','OPEN WHATSAPP')} <span aria-hidden="true">↗</span></a>
            <p>{t('Tú confirmas el envío en WhatsApp. La consulta inicial es gratuita y personalizada.','You confirm sending in WhatsApp. The initial consultation is free and personalised.')}</p>
          </section>
        </div>
        <form id="assistant-form" class="assistant-form">
          <label for="assistant-input" class="assistant-input-label">{t('¿En qué puedo orientarte?','How can I help?')}</label>
          <div class="assistant-compose"><input id="assistant-input" type="text" maxlength="1000" autocomplete="off" required placeholder="Webs, apps, automatización…" data-es="Webs, apps, automatización…" data-en="Websites, apps, automation…" data-i18n-attr="placeholder"><button type="submit" id="assistant-send" aria-label="Enviar pregunta" data-es="Enviar pregunta" data-en="Send question" data-i18n-attr="aria-label">↑</button></div>
          <div id="assistant-ai-notice" class="assistant-ai-notice" hidden><label for="assistant-ai-consent"><input type="checkbox" id="assistant-ai-consent">{t('Usar IA: enviar mis mensajes a Cloudflare y OpenAI para responder. Puede cometer errores. No incluyas datos sensibles.','Use AI: send my messages to Cloudflare and OpenAI for a reply. It may make mistakes. Do not include sensitive data.')}</label></div>
          <p id="assistant-status" class="assistant-status" role="status"></p>
        </form>
        <div class="assistant-actions"><button type="button" id="assistant-contact">{t('Hablar con Yonathan','Talk to Yonathan')} <span aria-hidden="true">↗</span></button><button type="button" id="assistant-reset">{t('Borrar chat','Clear chat')}</button></div>
        <footer class="assistant-footnote"><span id="assistant-disclosure"></span><a href="/privacidad/">{t('Privacidad','Privacy')}</a></footer>
      </div>
    </dialog>'''
