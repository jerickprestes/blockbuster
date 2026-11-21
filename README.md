# BlockBuster — Video Club

Site de streaming inspirado em locadoras de VHS, em **HTML5, CSS3 e JavaScript puro** (sem frameworks, sem build). O layout foi desenhado no FigCraft (`BlockBuster_v2`) e implementado de forma fiel, com todas as seções do design.

## Preview local

O embed do YouTube costuma ser recusado quando a página é aberta direto do arquivo (`file://`). Rode um servidor local:

```bash
cd blockbuster
python3 -m http.server 8000
# abra http://localhost:8000
```

Em hospedagem normal com https (GitHub Pages, Netlify etc.) funciona sem ajustes.

## Estrutura

```
blockbuster/
├── index.html
├── css/style.css
├── js/main.js
├── img/                    # tv.png, target.svg, vhs-stack.webp, connector.svg, og-image.png
├── favicon.svg / .ico / .png  # letra B (Block Display, #E9A945)
├── fonts/                  # woff2 (Block Display, VHS Menu, Inter)
└── README.md
```

## Recursos

- **Tela de carregamento:** logo BlockBuster piscando por exatamente 4 s (CSS + JS; some sozinha mesmo sem JS).
- **Fade-in** em todas as seções e nos elementos internos (IntersectionObserver, com fallback sem JS e respeito a `prefers-reduced-motion`).
- **Hero:** fita VHS e capa flutuando em ritmos diferentes, com uma TV na frente. Dentro da tela, um vídeo do YouTube mudo e em loop, preenchendo a tela (cover). Um poster estático (letra B) aparece até o YouTube confirmar que está tocando.
- **Trends Now:** abas, filtro por gênero e carrossel.
- **Gêneros:** o botão ⊕ de cada linha abre um carrossel de títulos.
- **System Map:** slider 16:9, uma imagem por vez, com autoplay, setas e arraste. Para usar fotos reais, troque o `<svg>` dentro de cada `<figure class="slide">` por `<img src="..." alt="...">` (ele já usa `object-fit: cover`).
- **How it works:** mira com fitas VHS e passos PICK / PLAY / REWIND ligados por conectores.
- **Movies:** filtro por gênero, ordenação (Latest / Year / A-Z), nota mínima e contador.
- **Player:** play/pause, barra clicável (também por teclado), tela cheia, SP/EP/SLP e qualidade.
- **Recommended:** botão "Load more".
- **Carrosséis arrastáveis:** deslize por toque (scroll-snap nativo) e arraste com o mouse.
- Responsivo, mobile-first, HTML semântico e navegação por teclado.

## Personalização

**Imagem de compartilhamento (Open Graph)** — `img/og-image.png` (1200x630) aparece na prévia do link no WhatsApp, Facebook, LinkedIn etc. As tags `og:*` e `twitter:*` ficam no `<head>` do `index.html`; o `og:image` precisa de URL absoluta, então troque `https://jerickprestes.github.io/blockbuster/` pelo endereço final do site. Se trocar a imagem depois, o WhatsApp pode manter a antiga em cache (use `?v=2` no link ou o depurador de compartilhamento do Facebook).

**Vídeo da TV** — troque o ID `gul5c2CYGQ4` no `data-src` do `<iframe class="tv__yt">` (aparece também em `playlist=`, necessário para o loop).

**Tempo do loader** — constante `LOAD_MS` em `js/main.js` e a duração (`4s`) das animações `ldOut` e `fill` em `css/style.css`.

**Cores** (variáveis em `:root`):

| Token | Valor |
|---|---|
| `--blue` | `#3262AA` |
| `--orange` | `#E9A945` |
| `--cream` | `#E7E1CD` |
| `--ink` | `#292927` |
| `--tan` | `#B99A5B` |
| `--dblue` | `#274F8C` |

## Fontes

- **Block Display** e **VHS Menu**: fontes próprias vetorizadas para este projeto. A VHS Menu só tem letras, números e `& - : . + = ( ) [ ] /`, então os textos em mono evitam outra pontuação.
- **Inter** / **Inter Display** (subset latino): [SIL Open Font License 1.1](https://openfontlicense.org).

## Observações

- Capas e títulos são fictícios (arte vetorial em SVG gerada no código).
- Os números "240 titles", notas e anos são dados de exemplo.
- Sem dependências, sem etapa de build: basta servir a pasta.
