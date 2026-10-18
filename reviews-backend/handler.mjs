import {validateReview} from '../assets/reviews-core.mjs';

export const allowedOrigins = new Set([
  'https://antonitech.es','https://www.antonitech.es',
  'https://antoni-tech.techantoni380.chatgpt.site',
  'https://techantoni380-create.github.io',
]);

export async function handleReviews(request, {publishableKeys, list, submit, clientHash}) {
  const origin=request.headers.get('origin');
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
  const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(!allowedOrigins.has(origin))return reply({error:'origin'},403);
  headers['Access-Control-Allow-Origin']=origin;
  headers['Access-Control-Allow-Headers']='apikey, content-type';
  headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS';
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  // Public application keys identify the intended project, not an individual person.
  if(!publishableKeys?.length)return reply({error:'unavailable'},503);
  if(!publishableKeys.includes(request.headers.get('apikey')))return reply({error:'apikey'},401);
  if(!['GET','POST'].includes(request.method))return reply({error:'method'},405);
  try{
    if(request.method==='GET'){
      const url=new URL(request.url);
      const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||3);
      if(!Number.isInteger(offset)||offset<0||offset>100000||!Number.isInteger(limit)||limit<1||limit>12)return reply({error:'pagination'},400);
      return reply(await list({offset,limit}));
    }
    if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'content_type'},415);
    if(Number(request.headers.get('content-length'))>10000)return reply({error:'too_large'},413);
    // Enforce the byte cap even when the sender omits Content-Length.
    const reader=request.body?.getReader();if(!reader)return reply({error:'body'},400);
    const chunks=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>10000){await reader.cancel();return reply({error:'too_large'},413);}chunks.push(value);}
    const bytes=new Uint8Array(size);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
    let input,review;
    try{
      input=JSON.parse(new TextDecoder().decode(bytes));
      review=validateReview(input);
      if(typeof input.submissionId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId))throw new Error('id');
    }catch{return reply({error:'validation'},400);}
    const id=await submit({...review,submissionId:input.submissionId,clientHash:await clientHash(request)});
    return reply({id,status:'pending'},202);
  }catch(error){
    if(error?.message==='review_rate_limit')return reply({error:'rate_limit'},429);
    return reply({error:'unavailable'},503);
  }
}
