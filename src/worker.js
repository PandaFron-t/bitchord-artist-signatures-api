/**
 * BitChord Artist Signatures — Expanded Catalog (Cloudflare Workers)
 * Compatible with BitChord v1.8.1's /v1/health and /v1/signatures?artist=... API.
 *
 * Sources, in priority order:
 *   1. Curated Wikimedia Commons links for Lady Gaga and Michael Jackson.
 *   2. Automatically updated community signature-archive on GitHub.
 *   3. Wikidata P109 (signature image), resolved by *exact artist-name match*.
 *   4. Conservative Wikimedia Commons file-name search when Wikidata has none.
 *
 * The worker never fabricates autographs, never serves artist photographs as
 * signatures, and returns [] when the source or identity is uncertain.
 * It runs with ZERO npm packages, storage accounts or API keys.
 *
 * Wikimedia API docs: https://www.mediawiki.org/wiki/Wikibase/API
 * P109: https://www.wikidata.org/wiki/Property:P109
 * Wikimedia images: https://www.mediawiki.org/wiki/API:Imageinfo
 */

const ARCHIVE_REPO = 'itsmeadarsh2008/signature-archive';
const TREE_URL = `https://api.github.com/repos/${ARCHIVE_REPO}/git/trees/main?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${ARCHIVE_REPO}/main/assets/`;
const WD = 'https://www.wikidata.org/w/api.php';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const APP_ID = 'ArtistSignaturesWorker/2.0 (https://github.com/PandaFron-t/bitchord-artist-signatures-api)';
const INDEX_TTL = 3600;
const HIT_TTL = 43200;
const MISS_TTL = 900;

// Snapshot as a safety net; the complete archive is loaded dynamically.
const ARCHIVE_FALLBACK = [
  '$uicideboy$.webp', '2Pac.png', 'AURORA.webp', 'Alex Turner.png',
  'Arjan Dhillon.webp', 'BLACKPINK.png', 'Cameron Winter.png',
  'Diljit Dosanjh.webp', 'Eliott Smith.png', 'EsDeeKid.png',
  'Freddie Dredd.webp', 'Jeff Buckley.png', 'Karan Aujla.webp',
  'LEEHI.webp', 'Ravyn Lenae.webp', 'Rupam Islam.webp',
  'Thom Yorke.webp', 'Wave To Earth.webp', 'bbno$.webp',
];

// Explicit images are references to *actual* Commons files, not generated
// signatures. Verify their licenses/attribution on Wikimedia Commons.
const CURATED = {
  ladygaga: {
    artist: 'Lady Gaga',
    asset: { url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Ladygaga_sig.svg', format: 'svg' },
    width: 291, height: 148,
    verification: 'unverified',
    license: { status: 'requires_review', source: 'Wikimedia Commons',
      page: 'https://commons.wikimedia.org/wiki/File:Ladygaga_sig.svg' },
  },
  michaeljackson: {
    artist: 'Michael Jackson',
    asset: { url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Michael_Jackson_signature.svg', format: 'svg' },
    width: 623, height: 613,
    verification: 'unverified',
    license: { status: 'requires_review', source: 'Wikimedia Commons',
      page: 'https://commons.wikimedia.org/wiki/File:Michael_Jackson_signature.svg' },
  },
};

const ALIASES = {
  tupac: '2Pac', tupacshakur: '2Pac', '2pacshakur': '2Pac',
  auroraaksnes: 'AURORA', suicideboys: '$uicideboy$',
  elliottsmith: 'Eliott Smith',
};

function normalized(s) {
  return String(s || '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function json(data, status = 200, ttl = 300) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': status === 200 ? `public, max-age=${ttl}` : 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
function validImage(filename) {
  return typeof filename === 'string' && filename.length <= 260 &&
    /\.(svg|png|jpg|jpeg|webp|gif)$/i.test(filename) && !/[<>\n\r]/.test(filename);
}
function extension(filename) { return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase(); }
function artistFromFile(f) { return f.slice(0, f.lastIndexOf('.')); }
function commonsFilePage(filename) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename.replace(/ /g, '_'))}`;
}
function params(base, values) {
  const url = new URL(base);
  for (const [key, value] of Object.entries(values)) url.searchParams.set(key, String(value));
  return url.toString();
}
function cacheClient() { return typeof caches !== 'undefined' ? caches.default : null; }
async function safeFetchJson(url, timeout = 4500) {
  try {
    const r = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': APP_ID },
      signal: AbortSignal.timeout(timeout),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}
async function cachedJson(url, ctx, ttl) {
  const cache = cacheClient();
  const request = new Request(url);
  try {
    const hit = cache && await cache.match(request);
    if (hit) return await hit.json();
  } catch { /* worker edge cache may not be present */ }
  const data = await safeFetchJson(url);
  if (data !== null && cache && ctx && typeof ctx.waitUntil === 'function') {
    const response = json(data, 200, ttl);
    ctx.waitUntil(cache.put(request, response).catch(() => {}));
  }
  return data;
}
function archiveFiles(data) {
  if (!data || !Array.isArray(data.tree) || data.truncated) return null;
  return data.tree.filter(x => x.type === 'blob' && /^assets\/[^/]+\.(png|jpg|jpeg|webp|svg|gif)$/i.test(x.path))
    .map(x => x.path.slice(7));
}
async function getArchiveFiles(ctx) {
  const j = await cachedJson(TREE_URL, ctx, INDEX_TTL);
  return archiveFiles(j)?.length ? archiveFiles(j) : ARCHIVE_FALLBACK;
}
function archiveSignature(filename) {
  const url = RAW_BASE + encodeURIComponent(filename);
  return { artist: artistFromFile(filename), asset: { url, format: extension(filename) },
    original_url: url, verification: 'unverified',
    license: { status: 'unknown', source: `https://github.com/${ARCHIVE_REPO}` } };
}
function isMusicDescription(s) {
  return /music|singer|rapper|vocalist|songwriter|composer|musician|band|record|hip.hop|pop artist|disc jockey|dj\b|rock|jazz|producer|performer|saxophon|guitarist|pianist|drummer|dancer|entertainer/i.test(s || '');
}

/** Only accept 1 unambiguous exact label (or the artist's matched alias).
 * Never silently attach a same-name author's/politician's signature.
 */
async function findWikidataArtist(artist, ctx) {
  const queryUrl = params(WD, {
    action: 'wbsearchentities', search: artist, language: 'en', uselang: 'en',
    type: 'item', limit: 10, format: 'json', origin: '*',
  });
  const result = await cachedJson(queryUrl, ctx, HIT_TTL);
  const candidates = (result?.search || []).filter(x =>
    /^Q\d+$/.test(x.id || '') &&
    (normalized(x.label) === normalized(artist) || normalized(x.match?.text) === normalized(artist)) &&
    isMusicDescription(x.description));
  // Multiple exact-name music entities => ambiguous; don't guess.
  if (candidates.length !== 1) return null;
  return candidates[0];
}
async function resolveCommonsFilename(filename, artist, ctx, wikidataId = '') {
  if (!validImage(filename)) return null;
  const q = params(COMMONS, {
    action: 'query', prop: 'imageinfo', iiprop: 'url|size|extmetadata',
    titles: `File:${filename}`, format: 'json', origin: '*',
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|UsageTerms',
  });
  const result = await cachedJson(q, ctx, HIT_TTL);
  const page = Object.values(result?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url || !info.url.startsWith('https://upload.wikimedia.org/')) return null;
  const metadata = info.extmetadata || {};
  return {
    artist,
    asset: { url: info.url, format: extension(filename), width: info.width, height: info.height },
    original_url: info.url,
    width: info.width, height: info.height,
    verification: 'unverified',
    license: {
      status: 'requires_review',
      source: 'Wikimedia Commons',
      name: metadata.LicenseShortName?.value || null,
      url: metadata.LicenseUrl?.value || null,
      page: commonsFilePage(filename),
    },
    provenance: wikidataId ? `https://www.wikidata.org/wiki/${wikidataId}` : commonsFilePage(filename),
  };
}
async function wikidataSignature(artist, ctx) {
  const entity = await findWikidataArtist(artist, ctx);
  if (!entity) return null;
  const q = params(WD, {
    action: 'wbgetentities', ids: entity.id, props: 'claims', format: 'json', origin: '*',
  });
  const j = await cachedJson(q, ctx, HIT_TTL);
  const claims = j?.entities?.[entity.id]?.claims?.P109 || [];
  const claim = claims.find(c => c.rank === 'preferred' && c.mainsnak?.datavalue?.value)
    || claims.find(c => c.rank !== 'deprecated' && c.mainsnak?.datavalue?.value);
  const filename = claim?.mainsnak?.datavalue?.value;
  return resolveCommonsFilename(filename, artist, ctx, entity.id);
}
function strictCommonsFileName(title, artist) {
  if (!title?.startsWith('File:')) return false;
  const filename = title.slice(5);
  if (!validImage(filename)) return false;
  const titleKey = normalized(artistFromFile(filename));
  const artistKey = normalized(artist);
  if (!artistKey || !titleKey.includes(artistKey)) return false;
  if (!/(signature|autograph|sign[ea]ture)/i.test(filename)) return false;
  if (/(photo|portrait|selfie|giving|signing|album|cover|record|booklet)/i.test(filename)) return false;
  return true;
}
/** Fallback: only use an exact full-name signature or autograph filename.
 * Search titles are less trustworthy than explicit Wikidata P109: avoid fuzzy
 * matching or guessing the person from partial surnames.
 */
async function commonsSignature(artist, ctx) {
  const queryUrl = params(COMMONS, {
    action: 'query', list: 'search', srnamespace: 6,
    srsearch: `intitle:"${artist.replace(/"/g, '').slice(0,80)}" signature`,
    srlimit: 15, format: 'json', origin: '*',
  });
  const j = await cachedJson(queryUrl, ctx, HIT_TTL);
  const titles = (j?.query?.search || []).map(x => x.title)
    .filter(title => strictCommonsFileName(title, artist));
  if (!titles.length) return null;
  // Prefer vector files and scans over photographs. A clear file name is
  // still unverified; BitChord should never present it as authenticated.
  const score = title => (/\.svg$/i.test(title) ? 3 : /\.png$/i.test(title) ? 2 : 1) +
    (/signature/i.test(title) ? 2 : 0);
  const sorted = [...new Set(titles)].sort((a,b) => score(b)-score(a));
  return resolveCommonsFilename(sorted[0].slice(5), artist, ctx);
}

async function fetchDynamicSignature(artist, ctx) {
  const key = normalized(artist);
  const cache = cacheClient();
  const keyUrl = `https://signatures.local/internal/${encodeURIComponent(key)}`;
  const request = new Request(keyUrl);
  try {
    const hit = cache && await cache.match(request);
    if (hit) return await hit.json();
  } catch { /* keep going */ }
  // Wikidata is authoritative for identifying whose signature this is.
  const sig = await wikidataSignature(artist, ctx) || await commonsSignature(artist, ctx);
  const payload = { artist, signatures: sig ? [sig] : [] };
  if (cache && ctx?.waitUntil) {
    ctx.waitUntil(cache.put(request, json(payload, 200, sig ? HIT_TTL : MISS_TTL)).catch(() => {}));
  }
  return payload;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' } });
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/v1/health') return json({ ok: true, service: 'bitchord-artist-signatures', version: '2.0' });
    if (path === '/') return json({
      service: 'BitChord Artist Signatures — Expanded Catalog',
      version: '2.0',
      sources: ['GitHub signature-archive', 'Wikidata P109', 'Wikimedia Commons'],
      note: 'Not all artists have publicly documented signatures. Never invented.',
      endpoints: ['/v1/health', '/v1/catalog', '/v1/signatures?artist=2Pac'],
    });
    if (path !== '/v1/catalog' && path !== '/v1/signatures') return json({ error: 'Not found' }, 404);

    if (path === '/v1/catalog') {
      const files = await getArchiveFiles(ctx);
      const artists = [...new Set([...files.map(artistFromFile), ...Object.values(CURATED).map(s => s.artist)])]
        .sort((a,b) => a.localeCompare(b));
      return json({ count: artists.length, artists,
        note: 'This lists pre-indexed entries only. Other artists are checked dynamically via Wikidata and Commons.' });
    }

    const artist = (url.searchParams.get('artist') || '').trim();
    if (artist.length < 2 || artist.length > 100 || /[\r\n<>]/.test(artist)) {
      return json({ error: 'Provide artist (2-100 characters)' }, 400);
    }
    const key = normalized(artist);
    if (CURATED[key]) return json({ artist, signatures: [CURATED[key]] }, 200, HIT_TTL);

    const files = await getArchiveFiles(ctx);
    const target = normalized(ALIASES[key] || artist);
    const matches = files.filter(f => normalized(artistFromFile(f)) === target);
    if (matches.length > 1) return json({ artist, matches: matches.map(artistFromFile) });
    if (matches.length === 1) return json({ artist, signatures: [archiveSignature(matches[0])] }, 200, HIT_TTL);

    return json(await fetchDynamicSignature(artist, ctx), 200, 120);
  },
};