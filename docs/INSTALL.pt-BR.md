# Documentação em português

O guia principal está no [README](../README.md).

## Instalação

Abra [Cloudflare Workers & Pages](https://dash.cloudflare.com/), crie um Worker com a opção **Start with Hello World**, abra **Edit code**, substitua o código pelo arquivo [src/worker.js](../src/worker.js) e clique em **Deploy**.

No navegador, teste a URL do seu Worker com o caminho `/v1/health`. Então insira **apenas a URL base** em **BitChord → Configurações → Assinaturas de artistas → URL da API**.

## Segurança e privacidade

- Não forneça senhas de contas musicais nem tokens da Cloudflare a terceiros.
- Este Worker não tem autenticação de usuário e responde apenas a consultas públicas de assinaturas.
- Outras pessoas devem instalar a própria cópia, para não consumir a cota do projeto original.
- A instalação não requer SoundCloud, Spotify ou API keys.
- A cota gratuita e as condições de serviço da Cloudflare podem variar.

## Limitações

É uma busca *best-effort*. Nem todas as imagens são autênticas, nem todas são reutilizáveis sem atribuição. Confira [SOURCES.md](SOURCES.md).

Este é um projeto independente, não oficial do BitChord.
