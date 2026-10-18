import {reviewsConfig as config} from './reviews-config.mjs';
import {approvedReviews, reviewSummary, validateReview, whatsappReviewUrl} from './reviews-core.mjs';

const section=document.querySelector('#opiniones');
if(section){
  const form=section.querySelector('#review-form');
  const list=section.querySelector('[data-reviews-list]');
  const empty=section.querySelector('[data-reviews-empty]');
  const score=section.querySelector('[data-reviews-score]');
  const more=section.querySelector('[data-reviews-more]');
  const submit=form.querySelector('[type=submit]');
  const status=section.querySelector('[data-review-status]');
  const listStatus=section.querySelector('[data-reviews-list-status]');
  const direct=Boolean(config.endpoint && config.publishableKey);
  const words=(es,en)=>document.documentElement.lang==='en'?en:es;
  let rows=[], allRows=[], summary={count:0,average:null}, offset=0, hasMore=false;
  let loading=false, sending=false, listError=false, submissionId=crypto.randomUUID();
  let formState='', preparedUrl='';
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};

  function render(){
    list.replaceChildren();
    for(const review of rows){
      const card=node('article',undefined,'review-card');
      const stars=node('div',undefined,'review-card-stars');
      stars.setAttribute('role','img');stars.setAttribute('aria-label',words(`${review.rating} de 5 estrellas`,`${review.rating} out of 5 stars`));
      const filled=node('span','★'.repeat(review.rating));filled.setAttribute('aria-hidden','true');stars.append(filled);
      if(review.rating<5){const unfilled=node('span','☆'.repeat(5-review.rating),'is-empty');unfilled.setAttribute('aria-hidden','true');stars.append(unfilled);}
      card.append(stars,node('blockquote',review.body));
      const footer=node('div',undefined,'review-card-footer');
      const initials=review.name.trim().split(/\s+/u).slice(0,2).map(p=>Array.from(p)[0]||'').join('').toUpperCase();
      const avatar=node('span',initials,'review-avatar');avatar.setAttribute('aria-hidden','true');
      const author=node('div',undefined,'review-author');author.append(node('strong',review.name),node('small',review.audience==='client'?words('Experiencia como cliente','Client experience'):words('Experiencia como usuario','User experience')));
      footer.append(avatar,author);card.append(footer);
      const date=new Date(review.created_at);
      if(Number.isFinite(date.getTime())){const time=node('time',new Intl.DateTimeFormat(document.documentElement.lang,{month:'long',year:'numeric'}).format(date));time.dateTime=date.toISOString().slice(0,10);card.append(time);}
      list.append(card);
    }
    empty.hidden=rows.length>0||listError||loading;
    score.replaceChildren();score.hidden=!summary.count;
    if(summary.count){score.append(node('strong',`${new Intl.NumberFormat(document.documentElement.lang,{minimumFractionDigits:1,maximumFractionDigits:1}).format(summary.average)} / 5`),node('small',words(`${summary.count} ${summary.count===1?'opinión publicada':'opiniones publicadas'}`,`${summary.count} published ${summary.count===1?'review':'reviews'}`)));}
    more.hidden=!hasMore;more.disabled=loading;
    listStatus.textContent=loading?words('Cargando opiniones…','Loading reviews…'):listError?words('No se han podido cargar las opiniones. Puedes volver a intentarlo recargando la página.','Reviews could not be loaded. Reload the page to try again.'):'';
  }

  function updateForm(){
    const value=Number(new FormData(form).get('rating'));
    form.querySelectorAll('.review-stars label').forEach((label,i)=>label.classList.toggle('is-selected',i<value));
    section.querySelector('[data-review-rating-label]').textContent=value?words(`${value} de 5 estrellas`,`${value} out of 5 stars`):words('Selecciona de 1 a 5 estrellas','Select 1 to 5 stars');
    section.querySelector('[data-review-count]').textContent=`${form.elements.body.value.length} / 1200`;
    section.querySelector('[data-review-channel-note]').textContent=direct
      ?words('Tu opinión se enviará para revisión antes de aparecer en la web.','Your review will be submitted for review before appearing on the website.')
      :words('Envía tu opinión a Yonathan por WhatsApp. Allí confirmarás el envío; después podrá publicarse en la web con tu autorización.','Send your review to Yonathan via WhatsApp. You confirm sending there; it can then be published on the website with your permission.');
    section.querySelector('[data-review-submit-label]').textContent=sending?words('ENVIANDO…','SENDING…'):(direct?words('ENVIAR OPINIÓN','SUBMIT REVIEW'):words('ENVIAR POR WHATSAPP','SEND VIA WHATSAPP'));
    submit.disabled=sending;
    status.replaceChildren();
    const messages={prepared:words('Opinión preparada. Confirma el envío en WhatsApp.','Review prepared. Confirm sending in WhatsApp.'),received:words('Gracias. Tu opinión se ha recibido y queda pendiente de revisión.','Thank you. Your review has been received and is awaiting review.'),invalid:words('Revisa el nombre, las estrellas, el comentario y la autorización.','Check your name, stars, comment and permission.'),limited:words('Has alcanzado el límite de envíos. Inténtalo mañana.','The submission limit has been reached. Please try tomorrow.'),error:words('No se ha podido confirmar la recepción. Tu texto sigue aquí; puedes volver a intentarlo.','Receipt could not be confirmed. Your text is still here; you can try again.')};
    if(formState)status.append(node('span',messages[formState]||messages.error));
    if(formState==='prepared'&&preparedUrl){const link=node('a',words(' Abrir WhatsApp ↗',' Open WhatsApp ↗'));link.href=preparedUrl;link.target='_blank';link.rel='noopener noreferrer';status.append(link);}
  }

  async function loadReviews(){
    if(loading)return;loading=true;listError=false;render();
    try{
      if(direct){
        const url=new URL(config.endpoint);url.searchParams.set('offset',String(offset));url.searchParams.set('limit',String(config.pageSize));
        const response=await fetch(url,{headers:{apikey:config.publishableKey},credentials:'omit',signal:AbortSignal.timeout(12000)});
        if(!response.ok)throw new Error('load');
        const data=await response.json();
        const batch=approvedReviews(data.reviews);
        rows=approvedReviews([...rows,...batch]);offset+=batch.length;
        if(!Number.isInteger(data.summary?.count)||data.summary.count<0||data.summary.count>0&&(!Number.isFinite(data.summary.average)||data.summary.average<1||data.summary.average>5))throw new Error('summary');
        summary=data.summary;hasMore=data.hasMore===true && batch.length>0;
      }else{
        if(!offset){const response=await fetch(new URL('./reviews-published.json',import.meta.url),{cache:'no-cache'});if(!response.ok)throw new Error('load');allRows=approvedReviews(await response.json());summary=reviewSummary(allRows);}
        offset+=config.pageSize;rows=allRows.slice(0,offset);hasMore=offset<allRows.length;
      }
    }catch{listError=true;hasMore=false;}
    finally{loading=false;render();}
  }
  form.addEventListener('input',()=>{formState='';preparedUrl='';submissionId=crypto.randomUUID();updateForm();});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(sending||!form.reportValidity())return;
    let input;
    try{const data=new FormData(form);input=validateReview({...Object.fromEntries(data),consent:form.elements.consent.checked});}
    catch{formState='invalid';updateForm();return;}
    if(!direct){preparedUrl=whatsappReviewUrl(input,config.whatsapp,document.documentElement.lang);window.open(preparedUrl,'_blank','noopener,noreferrer');formState='prepared';updateForm();return;}
    sending=true;formState='';updateForm();
    try{
      const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:config.publishableKey},credentials:'omit',body:JSON.stringify({...input,submissionId}),signal:AbortSignal.timeout(15000)});
      const result=await response.json();
      if(response.status===429){formState='limited';return;}
      if(!response.ok||result.status!=='pending')throw new Error('submit');
      form.reset();submissionId=crypto.randomUUID();formState='received';
    }catch{formState='error';}
    finally{sending=false;updateForm();}
  });
  more.addEventListener('click',loadReviews);
  new MutationObserver(()=>{render();updateForm();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  updateForm();loadReviews();
}
