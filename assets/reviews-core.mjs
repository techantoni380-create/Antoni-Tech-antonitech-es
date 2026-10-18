export function validateReview(input) {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const body = typeof input.body === 'string' ? input.body.trim() : '';
  const rating = ['number','string'].includes(typeof input.rating) ? Number(input.rating) : NaN;
  if (name.length < 2 || name.length > 60) throw new Error('name');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('rating');
  if (body.length < 20 || body.length > 1200) throw new Error('body');
  if (!['client', 'visitor'].includes(input.audience)) throw new Error('audience');
  if (input.consent !== true) throw new Error('consent');
  if (input.website) throw new Error('spam');
  return {name, body, rating, audience:input.audience, consent:true};
}

export function approvedReviews(rows) {
  return (Array.isArray(rows) ? rows : []).filter(r => r?.status === 'approved'
    && typeof r.id === 'string' && typeof r.name === 'string' && r.name.length <= 60
    && typeof r.body === 'string' && r.body.length <= 1200
    && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5
    && ['client','visitor'].includes(r.audience))
    .filter((r,i,all) => all.findIndex(x=>x.id===r.id) === i);
}

export function reviewSummary(rows) {
  const reviews = approvedReviews(rows);
  return {count:reviews.length, average:reviews.length ? reviews.reduce((sum,r)=>sum+r.rating,0)/reviews.length : null};
}

export function whatsappReviewUrl(input, phone, language='es') {
  const r=validateReview(input);
  const kind=language==='es' ? (r.audience==='client'?'Cliente':'Usuario de un proyecto') : (r.audience==='client'?'Client':'Project user');
  const message=language==='es'
    ? `Hola, Yonathan. Quiero compartir mi opinión sobre Antoni Tech.\n\nNombre público: ${r.name}\nRelación: ${kind}\nValoración: ${r.rating}/5\n\n${r.body}\n\nAutorizo la publicación de mi nombre, valoración y comentario tras su revisión.`
    : `Hi Yonathan. I would like to share my review of Antoni Tech.\n\nPublic name: ${r.name}\nRelationship: ${kind}\nRating: ${r.rating}/5\n\n${r.body}\n\nI agree to the publication of my name, rating and comment after review.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
