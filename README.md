# 🎤 Artist Signatures API

<p align="center">
  <strong>Signatures for BitChord, powered by public data.</strong>
</p>

![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)
![BitChord](https://img.shields.io/badge/BitChord-Compatible-8B5CF6)

A lightweight artist autograph lookup API, created for **BitChord v1.8.1+**. It runs on Cloudflare Workers without API keys, npm packages or a database.

## ✨ Features

- 🎧 Compatible with BitChord's optional artist signature API.
- 🔎 Searches the community Signature Archive, Wikidata P109 and Wikimedia Commons.
- ⚡ Uses Cloudflare edge caching where available.
- 🎨 Returns existing image URLs rather than generating fake autographs.
- 🛡️ Returns an empty list when no suitable image is found.

## 🎧 Use now — BitChord (no deployment required)

**Community API base URL:**

```text
https://bitchord-signature.pandanimation15.workers.dev
```

In BitChord, enable **Artist Signatures** under Settings and enter the URL above in the signature API URL field. The app tests `/v1/health` when you save it.

**Try an artist:**
[`2Pac`](https://bitchord-signature.pandanimation15.workers.dev/v1/signatures?artist=2Pac) ·
[`Lady Gaga`](https://bitchord-signature.pandanimation15.workers.dev/v1/signatures?artist=Lady%20Gaga) ·
[`Michael Jackson`](https://bitchord-signature.pandanimation15.workers.dev/v1/signatures?artist=Michael%20Jackson)

> **Community endpoint:** Offered as a best-effort free service, without availability guarantees. This URL is managed by the project maintainer and uses their Cloudflare Worker quota. Please use responsibly. For greater control, host your own Worker using the source below. No artist result is guaranteed.

## 🚀 Deploy in a browser

1. Open [Cloudflare Workers & Pages](https://dash.cloudflare.com/) and create a Worker using **Start with Hello World**.
2. Select **Edit code** and replace the sample with [src/worker.js](src/worker.js).
3. Click **Deploy** and check `https://YOUR-WORKER.workers.dev/v1/health`.
4. In BitChord: **Settings → Artist Signatures → API URL**. Enter only the Worker base URL.

No paid Cloudflare plan or local development environment is required for this manual deployment.

## 🔌 Endpoints

| Request | Response |
|---|---|
| `GET /v1/health` | Service health |
| `GET /v1/signatures?artist=2Pac` | Image URLs and metadata when found |
| `GET /v1/catalog` | Pre-indexed entries only |
| `GET /` | Service information |

**Example:** `/v1/signatures?artist=2Pac`

```json
{
  "artist": "2Pac",
  "signatures": [
    {
      "artist": "2Pac",
      "asset": {
        "url": "https://raw.githubusercontent.com/itsmeadarsh2008/signature-archive/main/assets/2Pac.png",
        "format": "png"
      }
    }
  ]
}
```

The exact response can include more fields such as source information and license metadata. This is an illustrative example; availability can change.

## 📂 Project structure

```text
src/worker.js         Cloudflare Worker API
tests/smoke.mjs       Local mocked endpoint tests
docs/SOURCES.md       Image sources, rights and credits
docs/README.en.md     English documentation
README.md             Project overview
```

Run tests from the repository root with Node.js 22+: `node tests/smoke.mjs`. These tests simulate upstream services and do not validate actual Cloudflare deployment.

## 🙏 Credits

- [BitChord](https://github.com/kushagrasinghx/BitChord) — compatible music app; **not an official integration**.
- [Signature Archive](https://github.com/itsmeadarsh2008/signature-archive) — community artist signature archive.
- [Wikidata](https://www.wikidata.org/) — artist identity data and signature image property P109.
- [Wikimedia Commons](https://commons.wikimedia.org/) — source files and license metadata.
- **ChatGPT (OpenAI)** — AI-assisted development and documentation. Not an official collaboration.

## ⚖️ Copyright & independence

This repository references external images but does **not** redistribute an image collection. Individual signatures may be subject to separate licenses and rights. Their online availability does not automatically authorize reuse. See [source attribution and licensing notes](docs/SOURCES.md).

The code has **no open-source license selected yet**. The upstream archive's CC0 notice does not automatically license this project's code or every third-party image.

**Independent community project:** not affiliated with or endorsed by BitChord, artists, Wikimedia or OpenAI. Artist/signature matches from public data may be incorrect and are not verified autographs.

Made by [PandaFron-t](https://github.com/PandaFron-t) 🐼
