# Configuração do Magic Link - Supabase

## 🚨 Problema Comum: `authentication_failed`

### Causas Principais:

1. ❌ Redirect URL não configurada
2. ❌ Template de email incorreto
3. ❌ Site URL incorreta
4. ❌ Token expirado

## ✅ Configuração Passo a Passo

### 1. Site URL (CRÍTICO)

**Supabase Dashboard → Settings → API → Configuration**

```
Site URL: https://monolitos-valley-portal.vercel.app
```

⚠️ **IMPORTANTE**:

- Sem barra no final
- Deve ser EXATAMENTE o domínio de produção
- Para dev local: `http://localhost:3000`

### 2. Redirect URLs (CRÍTICO)

**Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**

Adicione TODAS estas URLs:

```
https://monolitos-valley-portal.vercel.app/auth/callback
https://monolitos-valley-portal.vercel.app/*
http://localhost:3000/auth/callback
http://localhost:3000/*
```

⚠️ **IMPORTANTE**:

- Adicione uma por linha
- Clique em "Add URL" para cada uma
- Salve as mudanças

### 3. Template de Email (CRÍTICO)

**Supabase Dashboard → Authentication → Email Templates → Magic Link**

#### ❌ ERRADO (Não funciona):

```html
<a href="{{ .ConfirmationURL }}">Confirmar</a>
```

#### ✅ CORRETO (Funciona):

```html
<a href="{{ .ConfirmationURL }}" target="_blank">Confirmar meu e-mail</a>
```

**Template Completo Testado**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f4;"
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f5f5f4; padding: 40px 20px;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 12px; overflow: hidden;"
          >
            <!-- Header -->
            <tr>
              <td
                style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 30px; text-align: center;"
              >
                <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                  🚀 Bem-vindo à Monólitos Valley!
                </h1>
              </td>
            </tr>

            <!-- Conteúdo -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="margin: 0 0 20px; color: #292524; font-size: 16px;">
                  Olá! 👋
                </p>
                <p style="margin: 0 0 30px; color: #292524; font-size: 16px;">
                  Clique no botão abaixo para acessar sua conta:
                </p>

                <!-- Botão -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <a
                        href="{{ .ConfirmationURL }}"
                        target="_blank"
                        style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;"
                      >
                        ✨ Acessar Minha Conta
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 30px 0 0; color: #78716c; font-size: 14px;">
                  ⏰ Este link expira em 1 hora.
                </p>

                <!-- Link alternativo -->
                <div
                  style="margin: 30px 0; border-top: 1px solid #e7e5e4;"
                ></div>
                <p style="margin: 0 0 10px; color: #78716c; font-size: 13px;">
                  Se o botão não funcionar, copie este link:
                </p>
                <p
                  style="margin: 0; color: #f59e0b; font-size: 12px; word-break: break-all;"
                >
                  {{ .ConfirmationURL }}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background-color: #292524; padding: 30px; text-align: center;"
              >
                <p style="margin: 0; color: #a8a29e; font-size: 14px;">
                  Monólitos Valley - Quixadá, CE
                </p>
              </td>
            </tr>
          </table>

          <p
            style="margin: 20px 0 0; color: #78716c; font-size: 12px; text-align: center;"
          >
            🔒 Se você não solicitou este email, ignore-o.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
```

### 4. Email Auth Settings

**Supabase Dashboard → Authentication → Providers → Email**

Certifique-se que:

- ✅ **Enable Email provider** está ATIVADO
- ✅ **Confirm email** está DESATIVADO (para magic link)
- ✅ **Secure email change** está ATIVADO

### 5. Verificar Logs

**Supabase Dashboard → Logs → Auth Logs**

Procure por:

- `auth.magiclink.sent` - Email enviado
- `auth.magiclink.verified` - Link clicado
- Erros de autenticação

## 🔍 Debug em Produção

### Ver Logs no Vercel

```bash
# Instale Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Veja logs em tempo real
vercel logs --follow
```

### Ver Logs no Console do Navegador

1. Abra DevTools (F12)
2. Vá para Console
3. Procure por logs com 🔐, ✅, ❌

### Testar o Link Manualmente

1. Copie o link do email
2. Cole no navegador
3. Veja o que acontece na URL
4. Verifique os parâmetros: `token_hash`, `type`, `code`

## 🧪 Teste Completo

### Passo 1: Limpar Tudo

```javascript
// No console do navegador
localStorage.clear();
sessionStorage.clear();
// Recarregue a página
```

### Passo 2: Solicitar Magic Link

1. Digite seu email
2. Clique em "Cadastrar Startup"
3. Verifique o console para logs

### Passo 3: Verificar Email

1. Abra o email
2. Inspecione o HTML (View Source)
3. Procure por `{{ .ConfirmationURL }}`
4. Se ainda estiver assim, o template não foi salvo!

### Passo 4: Clicar no Link

1. Clique no botão/link
2. Observe a URL no navegador
3. Deve ter `token_hash` ou `code`
4. Verifique logs no console

### Passo 5: Verificar Autenticação

```javascript
// No console após clicar no link
const {
  data: { session },
} = await supabase.auth.getSession();
console.log("Session:", session);
```

## 🐛 Troubleshooting

### Erro: `authentication_failed`

**Causa**: Redirect URL não configurada

**Solução**:

1. Vá para Supabase → Authentication → URL Configuration
2. Adicione: `https://monolitos-valley-portal.vercel.app/auth/callback`
3. Adicione: `https://monolitos-valley-portal.vercel.app/*`
4. Salve e teste novamente

### Erro: `missing_auth_params`

**Causa**: Link do email está incorreto

**Solução**:

1. Verifique o template de email
2. Certifique-se que `{{ .ConfirmationURL }}` está presente
3. Salve o template
4. Solicite novo magic link

### Erro: `otp_verification_failed`

**Causa**: Token expirou (1 hora)

**Solução**:

1. Solicite novo magic link
2. Clique no link em até 1 hora

### Email não chega

**Solução**:

1. Verifique spam/lixo eletrônico
2. Verifique Supabase → Logs → Auth Logs
3. Configure SMTP customizado (Brevo)

## 📊 Verificar Configuração Atual

### Checklist Rápido

```bash
# 1. Site URL
Supabase → Settings → API → Site URL
✅ Deve ser: https://monolitos-valley-portal.vercel.app

# 2. Redirect URLs
Supabase → Authentication → URL Configuration
✅ Deve ter: https://monolitos-valley-portal.vercel.app/auth/callback

# 3. Email Template
Supabase → Authentication → Email Templates → Magic Link
✅ Deve ter: {{ .ConfirmationURL }}

# 4. Email Provider
Supabase → Authentication → Providers → Email
✅ Enable Email provider: ON
✅ Confirm email: OFF
```

## 🔧 Configuração Alternativa: PKCE Flow

Se o magic link continuar falhando, use PKCE flow:

```typescript
const { data, error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
    shouldCreateUser: true,
  },
});
```

O Supabase automaticamente usa PKCE flow quando disponível.

## 📝 Variáveis de Ambiente

Certifique-se que no Vercel você tem:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_SITE_URL=https://monolitos-valley-portal.vercel.app
```

## 🎯 Solução Rápida

Se nada funcionar, faça isso:

1. **Supabase Dashboard → Authentication → URL Configuration**

   - Site URL: `https://monolitos-valley-portal.vercel.app`
   - Redirect URLs: Adicione `https://monolitos-valley-portal.vercel.app/**`

2. **Supabase Dashboard → Authentication → Email Templates → Magic Link**

   - Cole o template HTML acima
   - Salve

3. **Teste novamente**

   - Solicite novo magic link
   - Verifique email
   - Clique no link

4. **Veja os logs**
   - Console do navegador
   - Vercel logs
   - Supabase logs

## 📞 Suporte

Se ainda não funcionar:

1. Compartilhe os logs do console
2. Compartilhe a URL do callback (sem o token)
3. Verifique se o email chegou
4. Verifique o HTML do email (View Source)
