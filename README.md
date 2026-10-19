<div align="center">

# ✍️ Artist Signatures API

**Assinaturas de artistas no BitChord — com uma API só sua.**

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white&style=for-the-badge)](https://workers.cloudflare.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)](src/worker.js)
[![License MIT](https://img.shields.io/badge/Code-MIT-8B5CF6?style=for-the-badge)](LICENSE)

**[Instalar](#-instalação-em-5-minutos) · [Como funciona](#-como-funciona) · [Prévia](#-prévia-no-bitchord) · [API](#-endpoints) · [English](docs/README.en.md)**

</div>

---

> [!NOTE]
> **Projeto independente da comunidade, compatível com [BitChord v1.8.1+](https://github.com/kushagrasinghx/BitChord).** Não é uma funcionalidade oficial, parceria ou endosso do aplicativo.

## 🎧 O projeto

Este Worker fornece ao BitChord URLs de **imagens de assinaturas de artistas** a partir de acervos e dados públicos. Cada usuário instala sua **própria cópia** em uma conta Cloudflare, sem usar a conta ou a cota do desenvolvedor deste projeto.

- **Sem API key:** não pede tokens do BitChord, SoundCloud ou Spotify.
- **Deploy pelo navegador:** copie um arquivo JavaScript; não precisa instalar ferramentas.
- **Busca em diferentes fontes:** Signature Archive, Wikidata P109 e Wikimedia Commons.
- **Cache de resultados:** aproveita o cache do Cloudflare Worker quando disponível.
- **Sem resultados inventados:** a API retorna uma lista vazia quando não encontra uma imagem adequada.

## 📱 Prévia no BitChord

As capturas de tela reais da integração serão adicionadas aqui, com foco no visual das assinaturas dentro da página de cada artista.

<!-- Quando receber os prints, adicionar assets/preview/ e assets/banner.png.
     Não reutilizar logos ou screenshots oficiais sem verificar permissão. -->

## 🚀 Instalação em 5 minutos

Tudo pode ser feito no navegador, inclusive pelo celular.

1. Entre no [painel da Cloudflare](https://dash.cloudflare.com/) e vá em **Workers & Pages**.
2. Clique em **Create** e escolha **Start with Hello World** (o nome da opção pode mudar).
3. Escolha um nome para o Worker, por exemplo `artist-signatures`, e clique em **Deploy**.
4. Abra **Edit code**, substitua todo o código de exemplo pelo conteúdo de **[src/worker.js](src/worker.js)** e clique em **Deploy** novamente.
5. Abra `https://SEU-WORKER.workers.dev/v1/health`. A resposta deverá conter `"ok": true`.
6. No **BitChord**, abra **Configurações → Assinaturas de artistas**, ative a opção e cole a **URL base** do Worker (sem `/v1/health`).

> [!TIP]
> Cada pessoa hospeda sua própria instância. **Não é necessário compartilhar senhas, login ou token.** Uma conta gratuita da Cloudflare pode ser suficiente para uso pessoal, sujeita às cotas do serviço.

### Exemplo da URL para configurar no aplicativo

```text
https://artist-signatures.SEU-SUBDOMINIO.workers.dev
```

Substitua pelo endereço gerado na **sua conta Cloudflare**. Não copie a URL de outra pessoa.

## 🔎 Como funciona

```text
BitChord → Seu Cloudflare Worker
                 │
                 ├─ Signature Archive (acervo)
                 ├─ Wikidata (propriedade P109)
                 └─ Wikimedia Commons (busca complementar)
                         │
                         ▼
                 Imagem encontrada?
                   Sim → URL da assinatura
                   Não → signatures: []
```

O catálogo do acervo é consultado dinamicamente; o resultado depende das fontes disponíveis. As correspondências automáticas **não equivalem a autenticação de autógrafos**.

## 🧩 Endpoints

| Rota | Função |
| :-- | :-- |
| `GET /v1/health` | Verifica se o Worker responde |
| `GET /v1/signatures?artist=2Pac` | Busca assinatura pelo nome do artista |
| `GET /v1/catalog` | Lista apenas artistas do acervo pré-indexado |
| `GET /` | Informações gerais da API |

Exemplo ilustrativo de resposta de `/v1/signatures?artist=2Pac`:

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

O retorno real pode incluir metadados adicionais. Nem todos os artistas possuem imagens disponíveis.

## 🛠️ Desenvolvimento e testes

```text
src/worker.js          API Cloudflare Workers
tests/smoke.mjs        Testes locais com fontes simuladas
docs/README.en.md      Documentation in English
docs/SOURCES.md        Fontes, créditos e direitos de imagem
README.md              Guia principal
LICENSE                Licença MIT para o código
```

Para executar os testes com Node.js 22+:

```bash
npm test
```

Os testes usam respostas simuladas, portanto não garantem disponibilidade de Wikidata, Wikimedia Commons ou Cloudflare. **Nenhum segredo é necessário para executar o projeto.**

## 💜 Fontes e agradecimentos

- **[BitChord](https://github.com/kushagrasinghx/BitChord)** — aplicativo que oferece a integração opcional.
- **[Signature Archive](https://github.com/itsmeadarsh2008/signature-archive)** — acervo comunitário de assinaturas.
- **[Wikidata](https://www.wikidata.org/)** — identificação de artistas e propriedade [P109](https://www.wikidata.org/wiki/Property:P109).
- **[Wikimedia Commons](https://commons.wikimedia.org/)** — URLs das imagens e informações sobre licenças.
- **ChatGPT (OpenAI)** — assistência na implementação e documentação; **não é parceria oficial**.

## ⚖️ Licença e aviso

**Código-fonte:** [MIT](LICENSE). **Imagens e nomes de artistas:** permanecem sujeitos aos direitos e licenças das fontes originais; a licença MIT **não se aplica a elas**. Este repositório não distribui um pacote de imagens. Consulte [fontes e atribuição](docs/SOURCES.md) antes de republicar qualquer arquivo.

A compatibilidade com BitChord **não implica afiliação** ao projeto, aos artistas, à Wikimedia ou à OpenAI. Os resultados são apresentados *como encontrados* e podem conter erros.

---

<div align="center">

Feito por **[PandaFron-t](https://github.com/PandaFron-t)** · 🐼

</div>
