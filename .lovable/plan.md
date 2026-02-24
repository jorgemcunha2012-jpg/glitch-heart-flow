

## Plano: Buscar foto de perfil do TikTok via Unavatar.io

### O que muda

O serviço [unavatar.io](https://unavatar.io) oferece avatares de redes sociais gratuitamente, incluindo TikTok. Basta fazer uma requisicao para `https://unavatar.io/tiktok/{username}` e ele retorna a imagem diretamente. Nao precisa de API key nem do Firecrawl.

### Alteracoes

**1. `supabase/functions/tiktok-avatar/index.ts`** -- Reescrever a edge function
- Remover toda a logica do Firecrawl
- Fazer um `fetch` para `https://unavatar.io/tiktok/{username}?json` que retorna um JSON com a URL do avatar
- Se falhar, retornar `avatarUrl: null` como fallback
- Manter os CORS headers existentes

**2. `src/pages/Landing.tsx`** -- Reativar a busca de avatar
- Restaurar o import do `supabase` client e o state `avatarUrl`
- No `handleVerify`, chamar `supabase.functions.invoke('tiktok-avatar')` novamente
- Salvar o avatar no `localStorage` para uso em outras paginas
- Exibir a foto real no circulo de sucesso, com fallback para a inicial colorida

### Por que funciona

- Unavatar.io e um servico open-source e gratuito (ate 50 req/s sem autenticacao)
- Suporta TikTok nativamente -- nao depende de scraping
- Nao precisa de API key nem do conector Firecrawl
- A edge function serve como proxy, evitando problemas de CORS no navegador

### Detalhes tecnicos

A edge function fara:
```text
GET https://unavatar.io/tiktok/{username}?json
-> { "url": "https://..." }
```

Se o servico retornar uma URL valida, ela sera enviada ao frontend. Caso contrario, o avatar com a inicial do usuario sera exibido.

