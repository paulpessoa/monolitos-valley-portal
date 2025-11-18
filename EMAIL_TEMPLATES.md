# Templates de Email - Supabase

## 🔗 Magic Link Template

### Configuração no Supabase Dashboard

**Caminho**: Authentication → Email Templates → Magic Link

### Template HTML Recomendado

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bem-vindo à Monólitos Valley</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f4;"
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
            style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
          >
            <!-- Header com gradiente -->
            <tr>
              <td
                style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 30px; text-align: center;"
              >
                <h1
                  style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;"
                >
                  🚀 Bem-vindo à Monólitos Valley!
                </h1>
              </td>
            </tr>

            <!-- Conteúdo -->
            <tr>
              <td style="padding: 40px 30px;">
                <p
                  style="margin: 0 0 20px; color: #292524; font-size: 16px; line-height: 1.6;"
                >
                  Olá! 👋
                </p>
                <p
                  style="margin: 0 0 20px; color: #292524; font-size: 16px; line-height: 1.6;"
                >
                  Você está a um clique de fazer parte do maior ecossistema de
                  inovação do Sertão Central Cearense!
                </p>
                <p
                  style="margin: 0 0 30px; color: #292524; font-size: 16px; line-height: 1.6;"
                >
                  Clique no botão abaixo para acessar sua conta e começar a
                  explorar oportunidades, conectar-se com outros empreendedores
                  e fazer sua startup crescer.
                </p>

                <!-- Botão CTA -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);"
                      >
                        ✨ Acessar Minha Conta
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="margin: 30px 0 0; color: #78716c; font-size: 14px; line-height: 1.6;"
                >
                  <strong>⏰ Este link expira em 1 hora</strong> por questões de
                  segurança.
                </p>

                <!-- Divider -->
                <div
                  style="margin: 30px 0; border-top: 1px solid #e7e5e4;"
                ></div>

                <!-- Link alternativo -->
                <p
                  style="margin: 0 0 10px; color: #78716c; font-size: 13px; line-height: 1.6;"
                >
                  Se o botão não funcionar, copie e cole este link no seu
                  navegador:
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
                <p style="margin: 0 0 10px; color: #a8a29e; font-size: 14px;">
                  <strong style="color: #f59e0b;">Monólitos Valley</strong>
                </p>
                <p style="margin: 0 0 15px; color: #78716c; font-size: 13px;">
                  Ecossistema de Inovação do Sertão Central Cearense
                </p>
                <p style="margin: 0; color: #78716c; font-size: 12px;">
                  Quixadá, CE - Brasil
                </p>
                <div style="margin-top: 20px;">
                  <a
                    href="https://instagram.com/monolitosvalley"
                    style="color: #f59e0b; text-decoration: none; margin: 0 10px; font-size: 12px;"
                    >Instagram</a
                  >
                  <a
                    href="https://linkedin.com/company/monolitosvalley"
                    style="color: #f59e0b; text-decoration: none; margin: 0 10px; font-size: 12px;"
                    >LinkedIn</a
                  >
                </div>
              </td>
            </tr>
          </table>

          <!-- Texto de segurança -->
          <p
            style="margin: 20px 0 0; color: #78716c; font-size: 12px; text-align: center; max-width: 600px;"
          >
            🔒 Se você não solicitou este email, pode ignorá-lo com segurança.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
```

### Template de Texto Simples (Fallback)

```
Bem-vindo à Monólitos Valley! 🚀

Você está a um clique de fazer parte do maior ecossistema de inovação do Sertão Central Cearense!

Clique no link abaixo para acessar sua conta:

{{ .ConfirmationURL }}

⏰ Este link expira em 1 hora por questões de segurança.

Se você não solicitou este email, pode ignorá-lo com segurança.

---
Monólitos Valley
Ecossistema de Inovação do Sertão Central Cearense
Quixadá, CE - Brasil
```

## 🔑 Variáveis Disponíveis

O Supabase fornece estas variáveis no template:

- `{{ .ConfirmationURL }}` - Link mágico completo (OBRIGATÓRIO)
- `{{ .Token }}` - Token de confirmação
- `{{ .TokenHash }}` - Hash do token
- `{{ .SiteURL }}` - URL do seu site
- `{{ .Email }}` - Email do usuário

## ⚙️ Configurações Adicionais

### 1. Site URL

```
Supabase Dashboard → Settings → API → Site URL
```

Configure: `https://seudominio.com` ou `http://localhost:3000` (dev)

### 2. Redirect URLs

```
Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
```

Adicione:

- `http://localhost:3000/auth/callback` (desenvolvimento)
- `https://seudominio.com/auth/callback` (produção)

### 3. Email Settings

```
Supabase Dashboard → Authentication → Email → SMTP Settings
```

**Opção A: Usar Supabase (Padrão)**

- Funciona out-of-the-box
- Limite de emails por hora
- Bom para desenvolvimento

**Opção B: Usar Brevo SMTP (Recomendado para Produção)**

```
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
SMTP User: seu-email@brevo.com
SMTP Password: sua-senha-smtp
From Email: noreply@monolitosvalley.com
From Name: Monólitos Valley
```

## 📧 Configuração do Brevo

### Passo 1: Criar Conta Brevo

1. Acesse https://www.brevo.com
2. Crie conta gratuita (300 emails/dia)
3. Verifique seu domínio

### Passo 2: Obter Credenciais SMTP

```
Brevo Dashboard → SMTP & API → SMTP
```

### Passo 3: Configurar no Supabase

Cole as credenciais nas configurações de email do Supabase

## 🧪 Como Testar

### Teste 1: Desenvolvimento Local

```bash
# 1. Configure Site URL
http://localhost:3000

# 2. Adicione Redirect URL
http://localhost:3000/auth/callback

# 3. Teste o magic link
# Digite seu email no formulário
# Verifique o email
# Clique no link
```

### Teste 2: Verificar Email no Supabase

```
Supabase Dashboard → Authentication → Users
```

Após clicar no link, o usuário deve aparecer aqui!

### Teste 3: Verificar Sessão

```javascript
// No console do navegador após clicar no link
const {
  data: { session },
} = await supabase.auth.getSession();
console.log(session); // Deve mostrar a sessão ativa
```

## 🐛 Troubleshooting

### Problema: Email não chega

**Solução**:

1. Verifique spam/lixo eletrônico
2. Confirme Site URL no Supabase
3. Verifique logs em Supabase Dashboard → Logs

### Problema: Link não funciona

**Solução**:

1. Verifique Redirect URLs
2. Confirme que `/auth/callback` existe
3. Verifique se o link não expirou (1 hora)

### Problema: Usuário não é criado

**Solução**:

1. Verifique se "Enable email confirmations" está desabilitado (para magic link)
2. Confirme que o email é válido
3. Verifique RLS policies na tabela profiles

## 📝 Checklist de Configuração

- [ ] Template de email configurado no Supabase
- [ ] Site URL configurado
- [ ] Redirect URLs adicionados
- [ ] SMTP configurado (Brevo ou Supabase)
- [ ] Domínio verificado (se usar Brevo)
- [ ] Testado em desenvolvimento
- [ ] Testado em produção
- [ ] Email chega na caixa de entrada (não spam)
- [ ] Link funciona e autentica
- [ ] Usuário é criado automaticamente
- [ ] Redirecionamento funciona

## 🎨 Personalização do Email

### Cores da Marca

- Primária: `#f59e0b` (Amber 500)
- Secundária: `#ea580c` (Orange 600)
- Texto: `#292524` (Stone 900)
- Fundo: `#f5f5f4` (Stone 100)

### Emojis Recomendados

- 🚀 Lançamento/Início
- ✨ Magia/Especial
- 👋 Boas-vindas
- 🔒 Segurança
- ⏰ Tempo/Urgência
- 💡 Inovação

## 🔐 Segurança

### Boas Práticas

1. ✅ Link expira em 1 hora (padrão Supabase)
2. ✅ Token único por solicitação
3. ✅ HTTPS obrigatório em produção
4. ✅ Rate limiting automático
5. ✅ Validação de email no backend

### Avisos de Segurança

- Nunca compartilhe o link mágico
- Link é de uso único
- Sempre use HTTPS em produção
- Configure SPF/DKIM no domínio

## 📊 Métricas

### Monitorar

- Taxa de abertura de emails
- Taxa de cliques no link
- Taxa de conversão (cadastros completos)
- Tempo médio até primeiro acesso

### Ferramentas

- Brevo Analytics (se usar Brevo)
- Supabase Logs
- Google Analytics (eventos customizados)
