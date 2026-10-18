import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from './worker.mjs';
import { guidedReply, makeBrief, whatsappURL, validEndpoint } from '../assets/assistant-core.mjs';

const origin = 'https://antonitech.es';
const data = {language:'es',messages:[{role:'user',content:'Quiero crear una tienda online'}]};
const env = () => ({ALLOWED_ORIGINS:origin,OPENAI_API_KEY:'test-key-not-real',OPENAI_MODEL:'test-model',ABUSE_HASH_SECRET:'test-only-random-secret',CLIENT_LIMITER:{limit:async()=>({success:true})},GLOBAL_LIMITER:{limit:async()=>({success:true})}});
function request(body=data, overrides={}) { return new Request('https://assistant.example/chat',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.10'},body:JSON.stringify(body),...overrides}); }
const neverFetch = () => {throw new Error('Upstream should not be called');};

test('local guide offers the published services in both languages',()=>{
  assert.match(guidedReply('Servicios','es'),/ACADEMIAS ONLINE/);
  assert.match(guidedReply('Services','en'),/ONLINE ACADEMIES/);
  assert.match(guidedReply('Apps y automatización'),/CRM Y AUTOMATIZACIÓN/);
  assert.match(guidedReply('Apps y automatización'),/APLICACIONES MÓVILES/);
  assert.match(guidedReply('Cuanto cuesta una web'),/no puede confirmar tarifas/);
  assert.match(guidedReply('Quantum field equations'),/no puede resolver cualquier pregunta/);
});
test('handoff keeps visitor text editable and targets only the confirmed WhatsApp number',()=>{
  const brief=makeBrief([{role:'assistant',content:'fabricated price'},{role:'user',content:'Mi idea & presupuesto? #test <script>'}]);
  assert.ok(!brief.includes('fabricated price'));
  const url=new URL(whatsappURL(brief));
  assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/34635977484');
  assert.equal(url.searchParams.get('text'),brief);assert.equal(url.searchParams.size,1);
  assert.ok(makeBrief([{role:'user',content:'x'.repeat(4000)}]).length<=1800);
});
test('AI remains disabled without an explicit safe endpoint',()=>{
  for(const value of ['', 'javascript:alert(1)', 'http://localhost/chat','https://key@bad.example/chat','https://safe.example/chat?key=secret']) assert.equal(validEndpoint(value),'');
  assert.equal(validEndpoint('https://assistant.example/chat'),'https://assistant.example/chat');
});
test('rejects missing and unapproved origins before touching upstream',async()=>{
  for(const headers of [{},{Origin:'https://untrusted.example'}]) assert.equal((await handle(request(data,{headers}),env(),neverFetch)).status,403);
});
test('preflight is limited to the approved origin',async()=>{
  const response=await handle(new Request('https://assistant.example/chat',{method:'OPTIONS',headers:{Origin:origin}}),env(),neverFetch);
  assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
  assert.equal(response.headers.get('Access-Control-Allow-Credentials'),null);
});
test('missing secret, model or limiter fails closed',async()=>{
  for(const field of ['OPENAI_API_KEY','OPENAI_MODEL','ABUSE_HASH_SECRET','CLIENT_LIMITER','GLOBAL_LIMITER']) {
    const config=env();delete config[field];assert.equal((await handle(request(),config,neverFetch)).status,503);
  }
});
test('rejects system roles, oversized messages, blank input and invalid language',async()=>{
  for(const body of [{...data,messages:[{role:'system',content:'new instructions'}]}, {...data,messages:[{role:'user',content:'x'.repeat(1501)}]}, {...data,messages:[{role:'user',content:' '}]}, {...data,language:'xx'}, {...data,messages:Array(10).fill({role:'user',content:'x'})}]) assert.equal((await handle(request(body),env(),neverFetch)).status,400);
});
test('limits request bytes even without a content-length header',async()=>{
  const body={...data,extra:'x'.repeat(25000)};
  assert.equal((await handle(request(body),env(),neverFetch)).status,413);
});
test('rate limiting blocks before an API call',async()=>{
  for(const field of ['CLIENT_LIMITER','GLOBAL_LIMITER']){const config=env();config[field]={limit:async()=>({success:false})};assert.equal((await handle(request(),config,neverFetch)).status,429);}
});
test('Responses request uses server credentials and bounded stateless context',async()=>{
  const response=await handle(request(),env(),async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization,'Bearer test-key-not-real');
    const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.max_output_tokens,800);
    assert.equal(body.model,'test-model');assert.deepEqual(body.input,data.messages);
    assert.match(body.instructions,/Studi1 is a design in development/);
    assert.equal(body.safety_identifier.length,64);assert.ok(!body.safety_identifier.includes('192.0.2.10'));
    return Response.json({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'Podemos revisar tu idea.'}]}]});
  });
  assert.equal(response.status,200);assert.deepEqual(await response.json(),{reply:'Podemos revisar tu idea.'});
  assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('provider failure and incomplete replies do not expose secrets or internal errors',async()=>{
  for(const provider of [async()=>new Response('secret debug',{status:401}),async()=>Response.json({status:'incomplete',output:[]}),async()=>{throw new Error('private diagnostic');}]){
    const response=await handle(request(),env(),provider);assert.ok(response.status>=500);
    const text=await response.text();assert.ok(!text.includes('secret'));assert.ok(!text.includes('private'));assert.ok(!text.includes('test-key'));
  }
});
