# Banco de dados (Supabase)

O site usa [Supabase](https://supabase.com) (Postgres na nuvem) para guardar inscrições e login do admin.

## 1. Criar projeto

1. Crie um projeto em https://supabase.com  
2. Em **Project Settings → API**, copie **Project URL** e **anon public** key.

## 2. Variáveis de ambiente

Na raiz do projeto, crie `.env` (não commite):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## 3. Tabela e políticas

No Supabase, abra **SQL Editor**, cole e execute o arquivo `schema.sql`.

## 4. Usuário admin (único login)

1. **Authentication → Users → Add user**  
2. Crie o e-mail e senha do administrador (ou use **Sign up** uma vez e desative novos cadastros em **Authentication → Providers**).  
3. Somente esse usuário consegue abrir `/admin` e ver a lista de inscrições.

Para produção, desative **“Enable email signups”** em Authentication se quiser impedir que outros se registrem.

## 5. Build / deploy

Configure as mesmas variáveis `VITE_SUPABASE_*` no painel do host (Vercel, Netlify, etc.).

## 5.1 Segurança (importante)

- A `anon key` do Supabase em apps frontend **não é secreta**; ela pode aparecer no bundle e DevTools.
- A proteção real vem de **RLS + policies mínimas + grants mínimos** (já contemplados no `schema.sql`).
- **Nunca** use `service_role` no frontend.
- Se você suspeitar vazamento/abuso, faça rotação da `anon key` em **Project Settings -> API** e atualize `.env` + host.
- Considere habilitar CAPTCHA/rate-limit no endpoint de cadastro para reduzir spam.

## 6. Remover inscrição no admin e ela “volta” no F5

Isso quase sempre significa que o **DELETE não apagou no Postgres** (mas a interface antiga podia sumir a linha mesmo assim).

1. No Supabase, **SQL Editor** → rode de novo o arquivo `database/schema.sql` inteiro (idempotente: recria políticas e `grant`).
2. Confirme que você entrou em `/admin/login` com um usuário de **Authentication → Users** (sessão `authenticated`).
3. Se aparecer a mensagem de erro no painel após “Remover permanentemente”, siga o texto dela — o app agora só tira da lista quando o Supabase confirma que a linha foi deletada.
