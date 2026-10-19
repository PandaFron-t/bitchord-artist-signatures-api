# Artist Signatures API — English

**Independent, self-hosted artist-signature API for BitChord v1.8.1+**, running on Cloudflare Workers.

## Quick start (no terminal)

1. Create a Worker in [Cloudflare Workers & Pages](https://dash.cloudflare.com/) using **Start with Hello World**.
2. Open **Edit code** and replace the sample with [src/worker.js](../src/worker.js).
3. Click **Deploy** and check `https://YOUR-WORKER.workers.dev/v1/health`.
4. In BitChord's artist-signature settings, enable the feature and paste **your Worker's base URL**, without the `/v1/health` path.

Every user deploys their own instance. **No shared community endpoint, passwords, API tokens, databases, or music streaming accounts are required.**

## Sources and behavior

The Worker checks curated Commons links, [Signature Archive](https://github.com/itsmeadarsh2008/signature-archive), [Wikidata P109](https://www.wikidata.org/wiki/Property:P109), then a restricted Wikimedia Commons filename search. If it finds no suitable candidate, it returns an empty `signatures` array. Results are **not authenticated autographs**.

## Endpoints

- `GET /v1/health`: status JSON.
- `GET /v1/signatures?artist=2Pac`: candidate signature for a named artist.
- `GET /v1/catalog`: pre-indexed artists only.

## Tests and license

Run `npm test` with Node.js 22+. Tests use mocked upstream data and do not verify Cloudflare deployment.

The source code is under the [MIT License](../LICENSE). **External image rights are separate**; see [SOURCES.md](SOURCES.md).

## Acknowledgements

Credits: [BitChord](https://github.com/kushagrasinghx/BitChord), [Signature Archive](https://github.com/itsmeadarsh2008/signature-archive), Wikidata, Wikimedia Commons. ChatGPT (OpenAI) helped with development and docs.

This is an **independent project**, not an official collaboration, affiliation, or endorsement by any of those parties.
