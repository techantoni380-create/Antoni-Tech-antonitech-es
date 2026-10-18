def reviews_markup(t):
    stars = ''.join(f'''<input type="radio" id="review-star-{i}" name="rating" value="{i}" required><label for="review-star-{i}" title="{i}/5"><span aria-hidden="true">★</span>{t(f'{i} de 5 estrellas',f'{i} out of 5 stars','span','sr-only')}</label>''' for i in range(1,6))
    return f'''<section class="reviews-section wrap" id="opiniones" aria-labelledby="reviews-title">
      <div class="reviews-heading"><div>{t('OPINIONES · CLIENTES Y USUARIOS','REVIEWS · CLIENTS & USERS','p','eyebrow')}<h2 id="reviews-title">{t('Tu experiencia cuenta.','Your experience matters.')}</h2>{t('¿Hemos trabajado juntos o has probado uno de mis proyectos? Me gustaría conocer tu experiencia.','Have we worked together or have you tried one of my projects? I would love to hear about your experience.','p','reviews-intro')}</div><div class="reviews-score" data-reviews-score hidden aria-live="polite"></div></div>
      <div class="reviews-grid" data-reviews-list></div>
      <div class="reviews-empty" data-reviews-empty><span class="reviews-empty-mark" aria-hidden="true">“</span><div>{t('Aquí empieza nuestra conversación.','Our conversation starts here.','h3')}{t('Todavía no hay opiniones publicadas. La próxima puede ser la tuya.','There are no published reviews yet. Yours could be the first.','p')}</div></div>
      <p class="reviews-list-status" data-reviews-list-status role="status"></p>
      <div class="reviews-more-row"><button type="button" class="text-link" data-reviews-more hidden>{t('VER MÁS OPINIONES','VIEW MORE REVIEWS')} <span aria-hidden="true">＋</span></button></div>
      <details class="review-compose"><summary>{t('DEJAR MI OPINIÓN','LEAVE A REVIEW')}<span aria-hidden="true">＋</span></summary><div class="review-compose-body">
        {t('Gracias por compartir tu experiencia.','Thank you for sharing your experience.','h3')}
        <p class="review-channel-note" data-review-channel-note></p>
        <form id="review-form">
          <fieldset class="review-rating"><legend>{t('Tu valoración','Your rating')}</legend><div class="review-stars">{stars}</div><p class="review-rating-value" data-review-rating-label>{t('Selecciona de 1 a 5 estrellas','Select 1 to 5 stars')}</p></fieldset>
          <div class="review-fields"><label for="review-name">{t('Nombre que quieres mostrar','Your display name')}<input id="review-name" name="name" type="text" autocomplete="given-name" minlength="2" maxlength="60" required placeholder="Tu nombre" data-es="Tu nombre" data-en="Your name" data-i18n-attr="placeholder"></label><label for="review-audience">{t('¿Cómo conoces Antoni Tech?','How do you know Antoni Tech?')}<select id="review-audience" name="audience" required><option value="client" data-es="He contratado un servicio" data-en="I have hired a service">He contratado un servicio</option><option value="visitor" data-es="He visitado o utilizado un proyecto" data-en="I have visited or used a project">He visitado o utilizado un proyecto</option></select></label></div>
          <label for="review-body">{t('Cuéntanos tu experiencia','Tell us about your experience')}<textarea id="review-body" name="body" rows="4" minlength="20" maxlength="1200" required placeholder="Qué te ha gustado o qué podría mejorar…" data-es="Qué te ha gustado o qué podría mejorar…" data-en="What did you like, or what could be improved?" data-i18n-attr="placeholder"></textarea></label>
          <p class="review-count" data-review-count>0 / 1200</p>
          <div class="review-honeypot" aria-hidden="true"><label for="review-website">Website<input id="review-website" name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
          <label class="review-consent" for="review-consent"><input id="review-consent" name="consent" type="checkbox" required><span>{t('Autorizo el tratamiento y la publicación de mi nombre público y mi opinión, después de su revisión.','I consent to the processing and publication of my display name and review after moderation.')} <a href="/privacidad/">{t('Política de privacidad','Privacy policy')}</a></span></label>
          {t('Todas las puntuaciones se valoran por igual. Se revisan el spam, los insultos y los datos personales. Indica solo información que quieras hacer pública.','All ratings are treated equally. Reviews are checked for spam, abuse and personal data. Only include information you want to make public.','p','review-guidance')}
          <button class="button button-solid review-submit" type="submit" disabled><span data-review-submit-label>{t('ENVIAR OPINIÓN','SUBMIT REVIEW')}</span><span aria-hidden="true">→</span></button>
          <p class="review-form-status" role="status" aria-live="polite" data-review-status></p>
          <noscript><p>Para compartir tu opinión, <a href="https://wa.me/34635977484" target="_blank" rel="noopener noreferrer">escribe a Yonathan por WhatsApp</a>.</p></noscript>
        </form>
      </div></details>
    </section>'''
