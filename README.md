# Portal Monólitos Valley

Portal da comunidade Monólitos Valley - conectando startups, empreendedores e oportunidades no Sertão Central do Ceará.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Datas**: date-fns
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd monolitos-valley-portal
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Brevo (opcional - para emails customizados)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@monolitosvalley.com
BREVO_SENDER_NAME=Monólitos Valley
```

4. Execute as migrations do Supabase:

```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref your-project-ref

# Execute as migrations
supabase db push
```

5. Configure os buckets de storage no Supabase:

Execute o script SQL em `supabase/migrations/002_storage_buckets.sql` no SQL Editor do Supabase.

6. Configure as URLs de redirecionamento no Supabase:

No painel do Supabase, vá em Authentication > URL Configuration e adicione:

**Site URL:**

```
http://localhost:3000
```

**Redirect URLs:**

```
http://localhost:3000
http://localhost:3000/auth/callback
```

## 🏃 Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de produção

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
monolitos-valley-portal/
├── app/                          # App Router do Next.js
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (public)/                 # Rotas públicas
│   │   ├── blog/
│   │   ├── events/
│   │   ├── opportunities/
│   │   ├── startups/
│   │   └── store/
│   ├── profile/                  # Área do usuário
│   ├── api/                      # API Routes
│   └── auth/callback/            # Callback de autenticação
├── components/                   # Componentes React
│   ├── features/                 # Componentes por feature
│   │   ├── blog/
│   │   ├── events/
│   │   ├── opportunities/
│   │   ├── profile/
│   │   └── startups/
│   ├── layout/                   # Componentes de layout
│   └── ui/                       # Componentes shadcn/ui
├── lib/                          # Utilitários e configurações
│   ├── supabase/                 # Clientes Supabase
│   ├── utils/                    # Funções utilitárias
│   └── validations/              # Schemas Zod
├── types/                        # Tipos TypeScript
├── supabase/                     # Migrations e configurações
│   └── migrations/
└── public/                       # Arquivos estáticos
```

## 🔐 Autenticação

O projeto suporta dois métodos de autenticação:

1. **Email e Senha**: Login tradicional
2. **Magic Link**: Link enviado por email (sem senha)

### Fluxos de autenticação:

- **Login**: `/auth/login` → autenticação → `/profile`
- **Magic Link**: `/auth/login` → email → `/auth/callback` → `/profile`
- **Recuperação de senha**: `/auth/forgot-password` → email → `/auth/reset-password` → `/profile`

## 👤 Área do Usuário

A área de perfil (`/profile`) possui 4 tabs:

1. **Minhas Informações**: Dados pessoais e avatar
2. **Minha Startup**: Cadastro e edição da startup
3. **Oportunidades**: O que o usuário está buscando
4. **Segurança**: Trocar senha e deletar conta

## 🗄️ Banco de Dados

### Tabelas principais:

- `profiles`: Perfis dos usuários
- `startups`: Startups cadastradas
- `events`: Eventos da comunidade
- `blog_posts`: Posts do blog
- `opportunities`: Oportunidades (investimentos, editais, vagas, etc)
- `partners`: Parceiros da comunidade
- `store_products`: Produtos da lojinha

### Storage Buckets:

- `avatars`: Fotos de perfil
- `logos`: Logos de startups
- `pitch-decks`: Pitch decks (público)
- `events`: Imagens de eventos
- `blog`: Imagens de posts
- `products`: Imagens de produtos

## 🎨 Componentes UI

O projeto usa shadcn/ui com os seguintes componentes:

- Button, Card, Input, Label, Tabs
- Avatar, Badge, Carousel
- Alert Dialog, Dialog, Dropdown Menu
- Skeleton (loading states)
- Toast (notificações)

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Variáveis de ambiente para produção:

Adicione as mesmas variáveis do `.env.local` no painel do Vercel.

Não esqueça de adicionar as URLs de produção no Supabase:

**Site URL:**

```
https://seu-dominio.vercel.app
```

**Redirect URLs:**

```
https://seu-dominio.vercel.app
https://seu-dominio.vercel.app/auth/callback
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📧 Contato

Monólitos Valley - [@monolitosvalley](https://instagram.com/monolitosvalley)

---

Feito com ❤️ pela comunidade Monólitos Valley
