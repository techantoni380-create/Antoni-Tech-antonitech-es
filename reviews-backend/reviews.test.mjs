import test from 'node:test';
import assert from 'node:assert/strict';
import {validateReview,approvedReviews,reviewSummary,whatsappReviewUrl} from '../assets/reviews-core.mjs';
import {handleReviews} from './handler.mjs';

const draft={name:'Persona de prueba',body:'Esta es una opinión de prueba, nunca se publica.',rating:1,audience:'client',consent:true,submissionId:'aab878ed-caa3-4b3e-a0f4-a04ecc3628de'};
const origin='https://antonitech.es';
function request(body=draft,options={}){
 return new Request('https://example.invalid/reviews'+(options.query||''),{method:options.method||'POST',headers:{origin,apikey:'public-test','Content-Type':'application/json',...options.headers},...((options.method||'POST')==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
}
function deps(overrides={}){return {publishableKeys:['public-test'],list:async()=>({reviews:[],summary:{count:0,average:null},hasMore:false}),submit:async()=> 'pending-id',clientHash:async()=> 'a'.repeat(64),...overrides};}

test('one and five star opinions are equally accepted; invalid ratings and missing consent fail',()=>{
 for(const rating of [1,2,3,4,5])assert.equal(validateReview({...draft,rating}).rating,rating);
 for(const rating of [0,6,2.5,true,'five',null])assert.throws(()=>validateReview({...draft,rating}));
 assert.throws(()=>validateReview({...draft,consent:false}));
 assert.throws(()=>validateReview({...draft,website:'spam.example'}));
 assert.throws(()=>validateReview({...draft,body:'short'}));
});
test('only unique approved reviews contribute to the real average',()=>{
 const low={...draft,id:'a',status:'approved'},high={...draft,id:'b',rating:5,status:'approved'};
 const rows=[low,high,high,{...draft,id:'c',rating:5,status:'pending'},{...draft,id:'d',status:'rejected'}];
 assert.equal(approvedReviews(rows).length,2);
 assert.deepEqual(reviewSummary(rows),{count:2,average:3});
 assert.deepEqual(reviewSummary([]),{count:0,average:null});
});
test('WhatsApp handoff contains the selected rating and consent, encoded without sending',()=>{
 const url=new URL(whatsappReviewUrl({...draft,body:'Texto de prueba & símbolos: <script>texto</script>.'},'34635977484'));
 assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/34635977484');
 assert.match(url.searchParams.get('text'),/Valoración: 1\/5/);assert.match(url.searchParams.get('text'),/Autorizo la publicación/);
 assert.match(url.searchParams.get('text'),/& símbolos/);
});
test('API refuses wrong origins and keys without touching storage',async()=>{
 let calls=0;const d=deps({submit:async()=>{calls++;}});
 assert.equal((await handleReviews(request(draft,{headers:{origin:'https://untrusted.example'}}),d)).status,403);
 assert.equal((await handleReviews(request(draft,{headers:{apikey:'wrong'}}),d)).status,401);
 assert.equal(calls,0);
});
test('valid submission stays pending and ignores a client attempt to approve it',async()=>{
 let stored;
 const result=await handleReviews(request({...draft,status:'approved'}),deps({submit:async data=>{stored=data;return 'new-id';}}));
 assert.equal(result.status,202);assert.deepEqual(await result.json(),{id:'new-id',status:'pending'});
 assert.equal(stored.rating,1);assert.equal(stored.status,undefined);assert.equal(stored.clientHash,'a'.repeat(64));
});
test('validation and byte limits prevent writes',async()=>{
 let writes=0;const d=deps({submit:async()=>{writes++;}});
 assert.equal((await handleReviews(request({...draft,rating:0}),d)).status,400);
 assert.equal((await handleReviews(request({...draft,submissionId:'not-a-uuid'}),d)).status,400);
 assert.equal((await handleReviews(request('x'.repeat(10001)),d)).status,413);
 assert.equal((await handleReviews(request('{broken'),d)).status,400);
 assert.equal(writes,0);
});
test('rate limit and database errors never look like successful reception',async()=>{
 const limited=await handleReviews(request(),deps({submit:async()=>{throw new Error('review_rate_limit');}}));
 assert.equal(limited.status,429);
 const failed=await handleReviews(request(),deps({submit:async()=>{throw new Error('secret database detail');}}));
 assert.equal(failed.status,503);assert.deepEqual(await failed.json(),{error:'unavailable'});
});
test('pagination bounds and approved empty state are returned through read path',async()=>{
 let params;const d=deps({list:async data=>{params=data;return {reviews:[],summary:{count:0,average:null},hasMore:false};}});
 const result=await handleReviews(request(null,{method:'GET',query:'?offset=3&limit=3'}),d);
 assert.equal(result.status,200);assert.deepEqual(params,{offset:3,limit:3});assert.equal((await result.json()).summary.average,null);
 assert.equal((await handleReviews(request(null,{method:'GET',query:'?limit=1000'}),d)).status,400);
});
