# Artist Signatures API — English

An independent Cloudflare Workers API compatible with BitChord's optional artist-signature feature.

## How it works

The Worker checks curated Wikimedia Commons links, the [Signature Archive](https://github.com/itsmeadarsh2008/signature-archive), [Wikidata P109](https://www.wikidata.org/wiki/Property:P109), and finally a conservative Wikimedia Commons filename search. It returns an empty `signatures` array when it cannot find a suitable image. Results are not authenticated autographs.

## Deploy

1. Create a Worker using [Cloudflare Workers & Pages](https://dash.cloudflare.com/).
2. Replace the sample source with [`src/worker.js`](../src/worker.js) and deploy.
3. Open `https://YOUR-WORKER.workers.dev/v1/health`.
4. In BitChord's artist signature settings, enable the option and enter your Worker's **base URL**.

## Endpoints

- `GET /v1/health`: status JSON.
- `GET /v1/signatures?artist=2Pac`: artist signature results, if available.
- `GET /v1/catalog`: pre-indexed names only, **not** all dynamically supported artists.

## Acknowledgements and legal notes

This is **not an official BitChord integration** and not an endorsement or partnership by BitChord, Wikimedia, any artists, or OpenAI. Built with AI assistance from ChatGPT. Source services: [BitChord](https://github.com/kushagrasinghx/BitChord), [Signature Archive](https://github.com/itsmeadarsh2008/signature-archive), Wikidata and Wikimedia Commons. See [SOURCES.md](SOURCES.md) for detailed attribution and licensing limitations.

This repo contains source code and external image URLs, not a redistributed image collection. There is **no code license selected yet**, and the external repository's CC0 notice does not automatically cover this project's code or every third-party image.
