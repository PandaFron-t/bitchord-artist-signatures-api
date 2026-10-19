# Sources, attribution & image licensing

## Image provenance

| Source | Usage | Link |
|---|---|---|
| Signature Archive by itsmeadarsh2008 | Community signature assets referenced by URL | https://github.com/itsmeadarsh2008/signature-archive |
| Wikidata | Artist lookup and P109 claims (signature image property) | https://www.wikidata.org/wiki/Property:P109 |
| Wikimedia Commons | Signature file URLs and per-file metadata | https://commons.wikimedia.org/ |
| BitChord by kushagrasinghx | Open-source music client compatible with this API | https://github.com/kushagrasinghx/BitChord |

The [Signature Archive's LICENSE](https://github.com/itsmeadarsh2008/signature-archive/blob/main/LICENSE) includes CC0 1.0. **That notice does not establish that each autograph was contributed by its rights holder or that each separate image is free from all other rights.** Do not relicense upstream images by copying its declaration.

Wikimedia Commons files can have different licenses, attribution requirements, and public-domain rationales. Inspect the **individual Commons file description page** before redistributing a file; credit the author, link the source, state the license, and indicate modifications when required. Some files can also involve trademark, personality, or other rights in specific uses.

Two curated candidate URLs in the Worker refer to [Lady Gaga](https://commons.wikimedia.org/wiki/File:Ladygaga_sig.svg) and [Michael Jackson](https://commons.wikimedia.org/wiki/File:Michael_Jackson_signature.svg); review these individual file pages before downstream publication.

## Identity and reliability

- A file named after an artist is **not authentication** that the signature belongs to them.
- Wikidata P109 and Commons searches are best-effort and can be incomplete or mistaken.
- The current Worker returns `verification: "unverified"` for signature records.
- If a mistake or rights concern is reported, review and remove the affected mapping or data source.

## Copyright and project licensing

The source code in this repository is distributed under the [MIT License](../LICENSE). This license covers the original project code and documentation only, **not** external images, upstream trademarks, or third-party rights. This guide is not legal advice.

## Independence and AI assistance

**BitChord** is credited for compatibility and interface contract, not as a sponsor or partner. This repository has **no official affiliation or endorsement** from BitChord, Wikimedia, musical artists, OpenAI, or ChatGPT. ChatGPT assisted with code and documentation.
