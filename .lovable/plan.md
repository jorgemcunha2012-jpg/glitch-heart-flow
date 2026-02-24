
## Redesign da pagina /bonus para seguir o padrao da referencia

### Mudancas principais

**1. Header**
- Substituir o logo TikTok + avatar por um titulo centralizado "TikTok Bonus" em negrito

**2. Card de Saldo**
- Adicionar icone de moeda ao lado de "Seu saldo"
- Adicionar logo PIX acima do botao "Sacar"
- Manter o valor com animacao de contagem

**3. Banner Parabens**
- Aumentar a imagem do calendario com moedas
- Remover o badge "100%"
- Manter layout lado a lado (texto esquerda, imagem direita)

**4. Secao Check-in (redesign completo)**
- Adicionar linha tracejada separando do banner
- Texto "Entre por 14 dias para ganhar" com "8.414 pontos" em vermelho
- Botao "Concluido" cinza/neutro no lugar do badge verde
- Data "12 de nov - 25 de nov" com bullet
- Mensagem "Voce concluiu todos os dias de check-in." em caixa cinza
- Circulos de check-in com icone de moeda, valores (50, 100, 150, 200, 250, 300) e checkmarks rosas

**5. Remover cards extras**
- Remover os cards de "Anuncios assistidos", "Assistir videos", "Recompensas resgatadas" e "Pesquisas diarias" que nao aparecem na referencia

### Detalhes tecnicos

- Arquivo editado: `src/pages/Bonus.tsx`
- Usar assets existentes: `pix-logo-icon.png` para o logo PIX
- Manter a logica do modal "Gol de Premios" intacta
- Manter animacao de contagem do saldo
- Estilizar circulos de check-in com bordas rosas claras e icones de moeda/checkmark
- Usar fonte Montserrat (ja configurada) com pesos bold/extrabold
