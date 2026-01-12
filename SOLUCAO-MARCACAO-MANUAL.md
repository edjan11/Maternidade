# 🎯 SOLUÇÃO: Como Monitorar Solicitações

## ⚠️ Problema Identificado

O Puppeteer não consegue acessar o perfil do Chrome quando:
- Chrome está aberto
- Arquivos do perfil estão bloqueados
- Electron está rodando simultaneamente

## ✅ SOLUÇÕES DISPONÍVEIS

### 🔧 Solução 1: Marcação Manual (FUNCIONA AGORA!)

**Quando você ver uma solicitação SOLICITADO no site:**

1. Clique com **botão direito** no ícone verde 🟢
2. Selecione: **"⚠️ Marcar Solicitação Manualmente"**
3. O ícone vai:
   - Mudar para amarelo 🟡
   - Piscar 6 vezes
   - Mostrar notificação
   - Tocar som de alerta

**Vantagens:**
- ✅ Funciona imediatamente
- ✅ 100% confiável
- ✅ Sem dependências

---

### 🧪 Solução 2: Teste de Notificação

Para testar se as notificações e mudança de cor funcionam:

1. Clique com **botão direito** no ícone
2. Selecione: **"🧪 Testar Notificação (Simular Nova)"**
3. Observe o comportamento

---

### 🤖 Solução 3: Detecção Automática (Experimental)

**Requer:** Fechar completamente o Chrome antes de iniciar o monitor

1. Feche **TODAS** as janelas do Chrome
2. Execute: `iniciar-windows.bat`
3. O Puppeteer usará seu perfil com login
4. Detectará automaticamente

**Limitações:**
- ❌ Chrome precisa estar fechado
- ❌ Pode não funcionar se perfil estiver bloqueado
- ⚠️ Ainda em teste

---

## 🎯 RECOMENDAÇÃO

**Use a Solução 1 (Marcação Manual):**

1. Deixe o monitor rodando (ícone verde)
2. Abra o TJSE no Chrome normalmente
3. Quando ver "SOLICITADO", clique:
   - Botão direito no ícone
   - "⚠️ Marcar Solicitação Manualmente"
4. Ícone fica amarelo e notifica!

---

## 📊 Status Atual do Sistema

| Funcionalidade | Status |
|----------------|--------|
| Ícone na bandeja | ✅ Funciona |
| Bloqueio de múltiplas instâncias | ✅ Funciona |
| Abrir Chrome com perfil correto | ✅ Funciona |
| Notificações | ✅ Funciona |
| Mudança de cor (verde→amarelo) | ✅ Funciona |
| Piscar ícone | ✅ Funciona |
| **Marcação manual** | ✅ **FUNCIONA** |
| Teste de notificação | ✅ Funciona |
| Detecção automática via Puppeteer | ⚠️ Em teste |

---

## 🔍 Menu Completo

Clique com botão direito no ícone:

```
🚀 Abrir Maternidade TJSE
────────────────────────
🔄 Verificar Novas Solicitações
⚠️ Marcar Solicitação Manualmente  ← USE ESTE!
🧪 Testar Notificação (Simular Nova)
────────────────────────
✅ Modo Produção
⏱️ Intervalo: 3 min
────────────────────────
❌ Sair do Monitor
```

---

## 💡 Dica Prática

1. **Atalho no desktop**: Crie para `iniciar-windows.bat`
2. **Inicie com Windows**: Siga `INICIAR-COM-WINDOWS.md`
3. **Mantenha rodando**: Deixe o ícone verde sempre ativo
4. **Marque manualmente**: Quando ver SOLICITADO no site

---

## 🆘 Troubleshooting

### Ícone não muda de cor
→ Use o menu "🧪 Testar Notificação" primeiro para verificar

### Chrome abre perfil errado
→ Já corrigido! Agora usa seu perfil com login

### Puppeteer não funciona
→ Normal. Use "⚠️ Marcar Solicitação Manualmente"

### Múltiplos ícones na bandeja
→ Execute: `Stop-Process -Name electron -Force`

---

**Sistema 100% funcional com marcação manual!** ✅
