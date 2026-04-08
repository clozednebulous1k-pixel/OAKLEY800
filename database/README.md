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
