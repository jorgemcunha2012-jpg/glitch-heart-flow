

# Funil de Monetização TikTok

Aplicação estilo funil com identidade visual inspirada no TikTok (preto #010101, branco #FFFFFF, vermelho/rosa #EE1D52, teal #69C9D0) usando Montserrat como fonte principal.

---

## Página 1: Landing — Verificação de Conta (`/landing`)

- **Tela principal** com fundo escuro (#010101), logo estilizado e título em branco
- Campo para o usuário inserir seu **@username do TikTok**
- Botão "Verificar Conta" em destaque vermelho (#EE1D52)
- Ao clicar, abre **Modal de Verificação**: animação de loading/spinner simulando análise da conta com texto "Verificando sua conta..."
- Após alguns segundos, transição para **Modal de Parabéns**: ícone de sucesso em teal (#69C9D0), texto "Conta verificada com sucesso!" com confete/animação sutil
- Botão "Continuar" no modal redireciona para `/progresso`

## Página 2: Progresso (`/progresso`)

- **Barra de progresso animada** que preenche gradualmente
- Texto dinâmico mostrando etapas sendo "analisadas" (seguidores, engajamento, monetização)
- Ao completar 100%, redireciona automaticamente para `/bonus`

## Página 3: Bônus (`/bonus`)

- Exibe um **valor em dinheiro disponível** para saque (ex: R$ 487,32)
- Animação do valor "subindo" como um contador
- Mensagem explicativa sobre o bônus de monetização
- Botão "Sacar Agora" em vermelho que leva para `/pix`

## Página 4: PIX (`/pix`)

- **Seleção de método de saque**: PIX, conta bancária, etc.
- Ao selecionar, exibe campos para inserir dados (chave PIX, banco, etc.)
- Botão "Confirmar Saque" que leva para `/checkout`

## Página 5: Checkout (`/checkout`)

- Página de pagamento/oferta para desbloquear o saque
- Card com valor da "taxa de liberação" ou produto
- Design limpo com botão de ação principal em vermelho

---

## Design & UX

- Tema **100% dark** com fundo #010101
- Tipografia **Montserrat** bold para títulos, regular para corpo
- Transições suaves entre modais e páginas
- Layout mobile-first, centralizado e minimalista
- Acentos em vermelho (#EE1D52) para CTAs e teal (#69C9D0) para elementos de sucesso/destaque

