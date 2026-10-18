// Prepared Supabase Edge Function. Deploy only to the selected Antoni Tech project.
// verify_jwt=false is required for new publishable keys; handler.mjs checks apikey.
import {handleReviews} from './handler.mjs';

function keys(name: string): string[] {
  try { return Object.values(JSON.parse(Deno.env.get(name)||'{}')).filter((v): v is string=>typeof v==='string' && v.length>0); }
  catch { return []; }
}
const publishableKeys=keys('SUPABASE_PUBLISHABLE_KEYS');
const secretKey=keys('SUPABASE_SECRET_KEYS')[0]||'';
const projectUrl=Deno.env.get('SUPABASE_URL')||'';
async function rpc(name: string,body: unknown){
  if(!secretKey||!projectUrl)throw new Error('configuration');
  const response=await fetch(`${projectUrl}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:secretKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
  const result=await response.json();
  if(!response.ok){if(result.message==='review_rate_limit')throw new Error('review_rate_limit');throw new Error('database');}
  return result;
}
Deno.serve((request: Request)=>handleReviews(request,{
  publishableKeys,
  list:({offset,limit}: {offset:number;limit:number})=>rpc('antoni_list_reviews',{p_offset:offset,p_limit:limit}),
  submit:(r: {name:string;audience:string;rating:number;body:string;submissionId:string;clientHash:string})=>rpc('antoni_submit_review',{p_submission_id:r.submissionId,p_name:r.name,p_audience:r.audience,p_rating:r.rating,p_body:r.body,p_client_hash:r.clientHash}),
  clientHash:async(req: Request)=>{
    // The global database cap also applies when a client disguises its address.
    const address=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secretKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const digest=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${new Date().toISOString().slice(0,10)}:${address}`));
    return Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
  }
}));
