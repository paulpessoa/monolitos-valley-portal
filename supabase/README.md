# Supabase Database Setup

## Executar Migration

### Opção 1: Via Supabase CLI (Recomendado)

1. Instale o Supabase CLI:

```bash
npm install -g supabase
```

2. Faça login no Supabase:

```bash
supabase login
```

3. Link o projeto:

```bash
supabase link --project-ref your-project-ref
```

4. Execute a migration:

```bash
supabase db push
```

### Opção 2: Via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo do arquivo `migrations/001_initial_schema.sql`
5. Execute o SQL
6. Repita para `migrations/002_storage_buckets.sql`

## Estrutura do Banco de Dados

### Tabelas

- **profiles**: Perfis de usuários
- **startups**: Startups cadastradas
- **events**: Eventos da comunidade
- **blog_posts**: Posts do blog
- **opportunities**: Oportunidades (investimento, editais, vagas, etc)
- **partners**: Parceiros da comunidade
- **store_products**: Produtos da lojinha

### Enums

- **estagio_maturidade**: Ideação, Validação, Operação, Tração, Scale-up
- **opportunity_type**: Investidor, Edital, InovacaoAberta, Beneficio, Talento, Vaga

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com políticas apropriadas:

- Leitura pública para conteúdo público
- Escrita restrita ao proprietário dos dados
- Proteção automática via Supabase Auth

### Triggers

- **updated_at**: Atualiza automaticamente o timestamp em profiles, startups e blog_posts
- **on_auth_user_created**: Cria automaticamente um perfil quando um usuário se registra

### Storage Buckets

- **avatars**: Avatares de usuários (público, 5MB, imagens)
- **logos**: Logos de startups (público, 5MB, imagens)
- **pitch-decks**: Pitch decks (privado, 10MB, PDF)
- **events**: Imagens de eventos (público, 5MB, imagens)
- **blog**: Imagens de blog posts (público, 5MB, imagens)
- **products**: Imagens de produtos (público, 5MB, imagens)

Cada bucket tem políticas RLS apropriadas para controlar acesso.
