

# Redesign da pagina /bonus - 100% fidelidade ao spec

## Mudancas

### 1. Layout e fonte global da pagina
- Fundo: `#F5F5F5` (atualmente branco)
- Max-width: `450px` centralizado
- Padding: `0 12px 110px`
- Fonte: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial` (atualmente Montserrat)
- Importar fonte Inter via Google Fonts no `index.css`

### 2. Header
- Font-size: `16px`, weight `600`, cor `#000000`

### 3. Card Saldo
- Background: `rgba(255,255,255,0.95)` com `box-shadow: rgba(0,0,0,0.03) 0px 1px 18.4px 0px`
- Border-radius: `8px` (atualmente 2xl/16px)
- Height: `90px`, padding `20px`
- "Seu saldo": `14px`, weight `500`
- Valor: `22px`, weight `700`, cor `#000000` (atualmente 32px extrabold)
- Botao Sacar: `#FE2B54`, pill (`border-radius: 99px`), `81x27px`, texto `14px/500`
- Badge PIX no canto superior direito do botao

### 4. Bloco Parabens
- Background: `#FFFFFF`, padding `20px`, border-radius `12px`, margin `20px 0`
- "Parabens!": `22px/700`
- "Voce concluiu todas as tarefas": `18px/700`
- Valor vermelho: `22px/700`, cor `#FE2B54`

### 5. Secao Check-in
- Texto tarefa: `14px/500` (atualmente 16px bold)
- Pontos vermelho: `14px/500`, cor `#FE2B54`
- Data: `12px/400`, cor `rgb(206, 66, 95)`
- Botao Concluido: bg `#F1F1F3`, `89x35px`, pill, texto `12px/500`, cor `rgb(212,212,212)`
- Texto conclusao: `11px/500`, cor `rgb(132,132,134)` (sem italico, sem borda esquerda)
- Day tracker boxes: `45x45px`, border-radius `8.82px`, bg `#F8F9FB`
- Overlay concluido: `rgba(255,240,243,0.9)`

### 6. Demais tarefas (anuncios, videos, recompensas, pesquisas, convite)
- Mesma tipografia: titulo `14px/500`, pontos `14px/500` vermelho
- Botoes Concluido: mesmo estilo `#F1F1F3`
- Pill "Ate 756 pontos": bg `#F1F1F1`, pill, `19px` height
- Chip "Assista por 10 min": bg cinza claro, `12px`
- Progress bars com icones de moeda dourada

### 7. Modal "Gol de Premios"
- Overlay: `rgba(0,0,0,0.45)`
- Card: bg branco, border-radius `16px`, padding `20px`, width `320px`
- Titulo: `20px/700`
- Subtitulo: `14px/500`, cor `rgb(64,63,58)`
- Valor: `36px/700`
- Timer boxes: `20x23px`, bg `#F1F1F3`, border-radius `2px`, font `10px`
- "Expira em": `10px/500`, cor `rgb(64,63,58)`
- Botao "Obrigado": `270x53px`, bg `#FE2B54`, pill, texto `16px/600`

## Detalhes tecnicos

### Arquivos editados
- `src/index.css` - Adicionar import da fonte Inter
- `src/pages/Bonus.tsx` - Reescrever com todos os valores exatos do spec

### Constantes atualizadas
```text
TT_RED = "#FE2B54" (era #FE2C55)
TT_BLACK = "#020817" para texto corpo, #000000 para titulos
```

### Resumo das diferencas principais vs codigo atual
| Item | Atual | Spec |
|------|-------|------|
| Fonte | Montserrat | Inter |
| Fundo pagina | branco | #F5F5F5 |
| Card saldo radius | 16px | 8px |
| Valor saldo size | 32px extrabold | 22px/700 |
| Texto tarefas | 16px bold | 14px/500 |
| Botao Concluido | bg #f0f0f0, texto #b0b0b0 | bg #F1F1F3, texto rgb(212,212,212) |
| Botao Sacar size | px-7 h-38px | 81x27px |
| Day tracker box | 48px round | 45px, radius 8.82px |
| Modal bg | #fffdf5 | #FFFFFF |
| Timer boxes | 32x30px bordered | 20x23px, #F1F1F3 |

