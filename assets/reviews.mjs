import {reviewsConfig as config} from './reviews-config.mjs?v=20261018-direct';
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
  let rows=[], summary={count:0,average:null}, offset=0;
  let loading=false, sending=false, listError=false, submissionId=crypto.randomUUID();
  let formState='', preparedUrl='', refreshing=false, inView=false, lastLoaded=0;
  let hasMore=false, renderedCards='', scrollFrame=0;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};

  const compact=window.matchMedia('(max-width:600px)');
  const tablet=window.matchMedia('(max-width:960px)');
  const pageSize=()=>compact.matches?1:tablet.matches?2:3;
  const carousel=node('div',undefined,'reviews-carousel');
  const previous=node('button','‹','reviews-arrow reviews-arrow-previous');
  const next=node('button','›','reviews-arrow reviews-arrow-next');
  const counter=node('p',undefined,'reviews-total');
  previous.type=next.type='button';
  list.id='reviews-carousel-list';
  list.tabIndex=0;list.setAttribute('role','region');
  previous.setAttribute('aria-controls',list.id);next.setAttribute('aria-controls',list.id);
  counter.setAttribute('data-reviews-total','');
  counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');
  list.before(carousel);carousel.append(previous,list,next);
  more.parentElement.replaceWith(counter);

  const invite=section.querySelector('.review-compose > summary');
  const inviteIcon=node('span','☆','review-invite-icon');inviteIcon.setAttribute('aria-hidden','true');
  const inviteCopy=node('div',undefined,'review-invite-copy');
  const inviteTitle=node('strong'),inviteHint=node('small');inviteCopy.append(inviteTitle,inviteHint);
  const invitePlus=node('span','＋','review-invite-plus');invitePlus.setAttribute('aria-hidden','true');
  invite.replaceChildren(inviteIcon,inviteCopy,invitePlus);

  function render(){
    inviteTitle.textContent=words('Dejar mi opinión','Leave a review');
    inviteHint.textContent=words('Pulsa aquí para valorar con estrellas y escribir tu comentario.','Click here to rate with stars and write your review.');
    const signature=JSON.stringify(rows)+document.documentElement.lang;
    if(signature!==renderedCards){
    const scrollPositions=new Map([...list.querySelectorAll('.review-card')].map(card=>[card.dataset.reviewId,card.querySelector('blockquote').scrollTop]));
    list.replaceChildren();
    for(const review of rows){
      const card=node('article',undefined,'review-card');card.dataset.reviewId=review.id;
      const stars=node('div',undefined,'review-card-stars');
      stars.setAttribute('role','img');stars.setAttribute('aria-label',words(`${review.rating} de 5 estrellas`,`${review.rating} out of 5 stars`));
      const filled=node('span','★'.repeat(review.rating));filled.setAttribute('aria-hidden','true');stars.append(filled);
      if(review.rating<5){const unfilled=node('span','☆'.repeat(5-review.rating),'is-empty');unfilled.setAttribute('aria-hidden','true');stars.append(unfilled);}
      const body=node('blockquote',review.body);body.tabIndex=0;
      body.setAttribute('aria-label',words(`Comentario de ${review.name}`,`Review by ${review.name}`));
      card.append(stars,body);
      const footer=node('div',undefined,'review-card-footer');
      const initials=review.name.trim().split(/\s+/u).slice(0,2).map(p=>Array.from(p)[0]||'').join('').toUpperCase();
      const avatar=node('span',initials,'review-avatar');avatar.setAttribute('aria-hidden','true');
      const author=node('div',undefined,'review-author');author.append(node('strong',review.name),node('small',review.audience==='client'?words('Experiencia como cliente','Client experience'):words('Experiencia como usuario','User experience')));
      footer.append(avatar,author);card.append(footer);
      const date=new Date(review.created_at);
      if(Number.isFinite(date.getTime())){const time=node('time',new Intl.DateTimeFormat(document.documentElement.lang,{month:'long',year:'numeric'}).format(date));time.dateTime=date.toISOString().slice(0,10);card.append(time);}
      list.append(card);body.scrollTop=scrollPositions.get(review.id)||0;
    }
    renderedCards=signature;
    }
    empty.hidden=rows.length>0||listError||loading;
    score.replaceChildren();score.hidden=!summary.count;
    if(summary.count){score.append(node('strong',`${new Intl.NumberFormat(document.documentElement.lang,{minimumFractionDigits:1,maximumFractionDigits:1}).format(summary.average)} / 5`));}
    previous.setAttribute('aria-label',words('Opiniones anteriores','Previous reviews'));
    next.setAttribute('aria-label',words('Opiniones siguientes','Next reviews'));
    list.setAttribute('aria-label',words('Opiniones publicadas','Published reviews'));
    list.setAttribute('aria-busy',String(loading&&!refreshing));
    previous.hidden=next.hidden=summary.count<=pageSize();
    previous.disabled=loading||offset===0;
    next.disabled=loading||offset+pageSize()>=summary.count||!rows.length;
    counter.hidden=!summary.count;
    const first=offset+1,last=Math.min(offset+pageSize(),summary.count);
    const range=first===last?String(first):`${first}–${last}`;
    counter.textContent=summary.count?words(`${range} de ${summary.count} ${summary.count===1?'comentario':'comentarios'}`,`${range} of ${summary.count} ${summary.count===1?'review':'reviews'}`):'';
    listStatus.textContent=loading&&!refreshing?words('Cargando opiniones…','Loading reviews…'):listError?words('No se han podido cargar las opiniones. Puedes volver a intentarlo recargando la página.','Reviews could not be loaded. Reload the page to try again.'):'';
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

  function cardStep(){
    const cards=list.children;
    return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:cards[0]?.getBoundingClientRect().width||1;
  }
  function syncPosition(){
    const current=Math.max(0,Math.min(Math.max(0,rows.length-pageSize()),Math.round(list.scrollLeft/cardStep())));
    if(current!==offset){offset=current;render();}
  }
  async function loadReviews(replace=false,quiet=false){
    if(loading)return;
    loading=true;refreshing=quiet;listError=false;render();
    const anchor=rows[offset]?.id,oldOffset=offset,loadedCount=rows.length;
    try{
      let batch,nextSummary,nextHasMore=false;
      if(direct){
        const read=async start=>{
          const url=new URL(config.endpoint);url.searchParams.set('offset',String(start));url.searchParams.set('limit','12');
          const response=await fetch(url,{headers:{apikey:config.publishableKey},credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(12000)});
          if(!response.ok)throw new Error('load');
          const data=await response.json();
          if(!Number.isInteger(data.summary?.count)||data.summary.count<0||data.summary.count>0&&(!Number.isFinite(data.summary.average)||data.summary.average<1||data.summary.average>5))throw new Error('summary');
          return data;
        };
        batch=replace?[]:[...rows];
        do{
          const data=await read(batch.length),page=approvedReviews(data.reviews);
          const before=batch.length;batch=approvedReviews([...batch,...page]);nextSummary=data.summary;
          nextHasMore=data.hasMore===true&&batch.length>before;
          if(nextSummary.count>0&&!batch.length)throw new Error('empty batch');
        }while(replace&&nextHasMore&&batch.length<loadedCount);
      }else{
        const response=await fetch(new URL('./reviews-published.json',import.meta.url),{cache:'no-cache'});
        if(!response.ok)throw new Error('load');
        batch=approvedReviews(await response.json());nextSummary=reviewSummary(batch);
      }
      rows=batch;summary=nextSummary;hasMore=nextHasMore;lastLoaded=Date.now();
      const anchorOffset=replace&&anchor?rows.findIndex(review=>review.id===anchor):-1;
      offset=Math.min(anchorOffset>=0?anchorOffset:oldOffset,Math.max(0,rows.length-pageSize()));
      render();list.scrollTo({left:offset*cardStep(),behavior:'instant'});
    }catch{listError=true;}
    finally{loading=false;refreshing=false;render();}
  }
  async function navigate(direction){
    if(loading)return;
    let target=Math.max(0,Math.min(offset+direction,Math.max(0,summary.count-pageSize())));
    if(target+pageSize()>rows.length&&hasMore)await loadReviews(false);
    target=Math.min(target,Math.max(0,rows.length-pageSize()));
    list.scrollTo({left:target*cardStep(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  previous.addEventListener('click',()=>navigate(-1));
  next.addEventListener('click',()=>navigate(1));
  list.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncPosition();});
  },{passive:true});
  list.addEventListener('keydown',event=>{
    if(event.target!==list||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const control=event.key==='ArrowLeft'?previous:next;
    if(!control.hidden&&!control.disabled)control.click();
  });
  const resizeCarousel=()=>{
    offset=Math.min(offset,Math.max(0,rows.length-pageSize()));
    list.scrollTo({left:offset*cardStep(),behavior:'instant'});render();
  };
  compact.addEventListener('change',resizeCarousel);
  tablet.addEventListener('change',resizeCarousel);
  const refresh=()=>{if(inView&&!document.hidden&&!sending&&Date.now()-lastLoaded>15000)loadReviews(true,true);};
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;if(inView)refresh();
  }).observe(section);
  else inView=true;
  window.setInterval(refresh,60000);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',refresh);
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
      if(response.status!==202||result.status!=='pending')throw new Error('submit');
      form.reset();submissionId=crypto.randomUUID();formState='received';
    }catch{formState='error';}
    finally{sending=false;updateForm();}
  });
  new MutationObserver(()=>{render();updateForm();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  updateForm();loadReviews(true);
}
