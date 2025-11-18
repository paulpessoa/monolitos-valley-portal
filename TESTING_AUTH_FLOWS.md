# Guia de Testes - Fluxos de Autenticação

## 🧪 Testes em Produção

### Preparação

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Mantenha aberto durante os testes
4. Anote todos os logs que aparecerem

---

## 1️⃣ Magic Link (Homepage)

### Teste: Cadastro via Homepage

**URL**: https://monolitos-valley-portal.vercel.app

**Passos**:

1. Role até o final da página (seção CTA)
2. Digite seu email no campo
3. Clique em "Cadastrar Startup"
4. **Observe o console** - deve aparecer:
   ```
   🔗 Magic Link - Redirect URL: https://...
   ✅ Magic Link Response: {...}
   ```

**Email**:

1. Abra seu email
2. Procure email de "Monólitos Valley"
3. **Inspecione o HTML** (botão direito → View Source)
4. Procure por `{{ .ConfirmationURL }}` - NÃO deve estar assim!
5. Deve ter um link real como: `https://...supabase.co/auth/v1/verify?token=...`

**Clicar no Link**:

1. Clique no botão/link do email
2. **Observe a URL** no navegador
3. Deve passar por: `/auth/callback?token_hash=...&type=magiclink`
4. **Observe o console** - deve aparecer:
   ```
   🔐 Auth Callback - URL: ...
   📋 Auth Params: { token_hash: 'present', type: 'magiclink', ... }
   🔄 Verifying OTP with token_hash...
   ✅ OTP verification successful: seu@email.com
   ```
5. Deve redirecionar para `/profile`

**Resultado Esperado**:

- ✅ Usuário autenticado
- ✅ Redirecionado para perfil
- ✅ Pode ver/editar dados

**Se der erro**:

- Anote a mensagem de erro na URL
- Anote os logs do console
- Tire screenshot

---

## 2️⃣ Recuperação de Senha

### Teste: Esqueci Minha Senha

**URL**: https://monolitos-valley-portal.vercel.app/forgot-password

**Passos**:

1. Digite seu email
2. Clique em "Enviar Link de Recuperação"
3. **Observe o console**

**Email**:

1. Abra o email de recuperação
2. Clique no link
3. **Observe a URL**: deve ter `type=recovery`
4. **Observe o console**:
   ```
   🔐 Auth Callback - URL: ...
   📋 Auth Params: { token_hash: 'present', type: 'recovery', ... }
   ```
5. Deve redirecionar para `/reset-password`

**Redefinir Senha**:

1. Digite nova senha
2. Confirme a senha
3. Clique em "Redefinir Senha"
4. Deve mostrar sucesso
5. Tente fazer login com a nova senha

**Resultado Esperado**:

- ✅ Email recebido
- ✅ Link funciona
- ✅ Redireciona para reset-password
- ✅ Senha alterada com sucesso
- ✅ Login funciona com nova senha

---

## 3️⃣ Confirmação de Cadastro

### Teste: Cadastro com Confirmação

**Configuração Necessária**:

```
Supabase → Authentication → Providers → Email
✅ Confirm email: ON (ativar para este teste)
```

**URL**: https://monolitos-valley-portal.vercel.app/login

**Passos**:

1. Clique em "Criar conta"
2. Preencha email e senha
3. Clique em "Criar conta"
4. Deve mostrar mensagem: "Verifique seu email"

**Email**:

1. Abra email de confirmação
2. Clique no link
3. **Observe a URL**: deve ter `type=signup`
4. **Observe o console**
5. Deve redirecionar e autenticar

**Resultado Esperado**:

- ✅ Email de confirmação recebido
- ✅ Link funciona
- ✅ Conta confirmada
- ✅ Usuário autenticado automaticamente

---

## 4️⃣ Convidar Usuário (Admin)

### Teste: Convite de Usuário

**Pré-requisito**: Ser admin

**Método 1: Via Supabase Dashboard**

```
Supabase → Authentication → Users → Invite User
```

1. Digite email do usuário
2. Clique em "Send Invite"
3. Usuário recebe email

**Método 2: Via API (futuro)**

```typescript
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  "usuario@email.com"
);
```

**Email de Convite**:

1. Usuário recebe email
2. Clica no link
3. **Observe a URL**: deve ter `type=invite`
4. Deve redirecionar para criar senha
5. Usuário define senha
6. Usuário é autenticado

**Resultado Esperado**:

- ✅ Email de convite recebido
- ✅ Link funciona
- ✅ Usuário define senha
- ✅ Usuário autenticado

---

## 📊 Checklist de Testes

### Magic Link

- [ ] Email enviado
- [ ] Email recebido (não está no spam)
- [ ] Template correto (sem `{{ .ConfirmationURL }}`)
- [ ] Link funciona
- [ ] Console mostra logs corretos
- [ ] Redireciona para /profile
- [ ] Usuário autenticado
- [ ] Pode acessar áreas protegidas

### Recuperação de Senha

- [ ] Email enviado
- [ ] Email recebido
- [ ] Link funciona
- [ ] Redireciona para /reset-password
- [ ] Pode definir nova senha
- [ ] Nova senha funciona no login

### Confirmação de Cadastro

- [ ] Email enviado
- [ ] Email recebido
- [ ] Link funciona
- [ ] Conta confirmada
- [ ] Usuário autenticado

### Convite de Usuário

- [ ] Email enviado
- [ ] Email recebido
- [ ] Link funciona
- [ ] Pode definir senha
- [ ] Usuário autenticado

---

## 🐛 Problemas Comuns

### Email não chega

**Verificar**:

1. Pasta de spam
2. Supabase → Logs → Auth Logs
3. Email está correto
4. SMTP configurado

### Link não funciona

**Verificar**:

1. Redirect URLs no Supabase
2. Site URL no Supabase
3. Template de email
4. Token não expirou (1 hora)

### Erro `authentication_failed`

**Verificar**:

1. Console do navegador (logs)
2. URL do callback (parâmetros)
3. Supabase → Logs → Auth Logs
4. Configurações de Redirect URLs

---

## 📝 Relatório de Teste

Após testar, preencha:

### Magic Link

- Status: ✅ / ❌
- Erro (se houver):
- Logs do console:
- Screenshot:

### Recuperação de Senha

- Status: ✅ / ❌
- Erro (se houver):
- Logs do console:
- Screenshot:

### Confirmação de Cadastro

- Status: ✅ / ❌
- Erro (se houver):
- Logs do console:
- Screenshot:

### Convite de Usuário

- Status: ✅ / ❌
- Erro (se houver):
- Logs do console:
- Screenshot:

---

## 🔍 Debug Avançado

### Ver Logs do Vercel

```bash
vercel logs --follow
```

### Ver Logs do Supabase

```
Supabase Dashboard → Logs → Auth Logs
```

### Testar Manualmente

```javascript
// No console do navegador
const {
  data: { session },
} = await supabase.auth.getSession();
console.log("Session:", session);

const {
  data: { user },
} = await supabase.auth.getUser();
console.log("User:", user);
```

---

## ✅ Próximos Passos

Após os testes:

1. Compartilhe os resultados
2. Se houver erros, compartilhe logs
3. Ajustaremos conforme necessário
