import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const worker = (await import(pathToFileURL(resolve('src/worker.js')).href)).default;
globalThis.fetch = async (input) => {
  const u = new URL(input);
  if (u.hostname === 'api.github.com') return Response.json({ tree: [{type:'blob',path:'assets/2Pac.png'},{type:'blob',path:'assets/AURORA.webp'}] });
  if (u.hostname === 'www.wikidata.org') return Response.json({search:[]});
  if (u.hostname === 'commons.wikimedia.org') return Response.json({query:{search:[]}});
  throw new Error('Unexpected upstream: '+u);
};
const request = async (path) => {
  const r = await worker.fetch(new Request('https://unit.example'+path), {}, {waitUntil(){}});
  return {status:r.status, body:await r.json()};
};
assert.equal((await request('/v1/health')).body.ok,true);
assert.equal((await request('/v1/signatures?artist=2Pac')).body.signatures[0].artist,'2Pac');
assert.equal((await request('/v1/signatures?artist=AURORA')).body.signatures[0].asset.format,'webp');
assert.equal((await request('/v1/signatures?artist=Lady%20Gaga')).body.signatures[0].artist,'Lady Gaga');
assert.deepEqual((await request('/v1/signatures?artist=An%20Unknown%20Musician')).body.signatures,[]);
assert.equal((await request('/v1/signatures?artist=X')).status,400);
assert.equal((await request('/missing')).status,404);
console.log('PASS: 7 local smoke checks (mock upstream, not live Cloudflare tests)');
