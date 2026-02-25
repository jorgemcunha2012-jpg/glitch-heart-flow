

# Ajuste do Modal "Gol de Premios" para fidelidade ao iPhone 16

Baseado no print do iPhone 16, o modal atual esta muito pequeno em relacao ao esperado. Segue o plano de ajustes:

## Mudancas no arquivo `src/pages/Bonus.tsx`

### 1. Tamanho do modal (card)
- **Atual**: `width: calc(100% - 90px)`, `maxWidth: 271px`
- **Correto**: `width: calc(100% - 50px)`, `maxWidth: 340px`
- Padding: de `14px 16px 16px` para `20px 24px 24px`
- PaddingTop: de `41px` para `55px`

### 2. Imagem da bola dourada
- **Atual**: `102x102px`, `top: -47px`
- **Correto**: `130x130px`, `top: -60px` (maior e mais acima, como no print)

### 3. Titulo "Gol de Premios"
- **Atual**: `14px/700`
- **Correto**: `20px/700`

### 4. Subtitulo (paragrafo descritivo)
- **Atual**: `9px/500`
- **Correto**: `14px/500`, margin-bottom `16px`

### 5. Valor "R$ 2.834,72"
- **Atual**: `25px/700`
- **Correto**: `36px/700`, margin-bottom `16px`

### 6. Timer (Expira em)
- **Atual**: boxes `14x15px`, font `7px`, label `7px`
- **Correto**: boxes `20x23px`, font `10px`, label `10px/500`

### 7. Botao "Obrigado"
- **Atual**: `184x36px`, font `11px`
- **Correto**: `270x53px`, font `16px/600`, border-radius `99px`

### 8. Posicao do modal na tela
- Manter `alignItems: "center"` (centralizado verticalmente como no print)

## Resumo
Todos os elementos do modal estao subdimensionados. O ajuste escala tudo para o tamanho real visivel no print do iPhone 16, mantendo as proporcoes corretas.

