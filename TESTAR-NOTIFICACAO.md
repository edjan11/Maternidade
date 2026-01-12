# 🧪 Como Testar as Notificações

## Problema Identificado

A página do TJSE retorna HTML vazio quando acessada via HTTPS sem cookies/sessão.
Isso significa que **você precisa estar logado no Chrome** para o sistema detectar as solicitações.

---

## ✅ Solução: Fazer Login Primeiro

### 1️⃣ Abra o TJSE Manualmente

1. Abra o Google Chrome
2. Acesse: https://www.tjse.jus.br/registrocivil/seguro/maternidade/solicitacaoExterna/consultaSolicitacaoExterna.tjse
3. Faça login com suas credenciais
4. **IMPORTANTE**: Marque "Manter conectado" ou "Lembrar senha"
5. Feche o Chrome

### 2️⃣ Inicie o Monitor

Execute `iniciar-windows.bat` ou `npm start`

Agora o monitor usará os cookies salvos do seu Chrome!

---

## 🧪 Teste Manual de Notificação

Mesmo que não haja solicitações reais, você pode testar:

1. Clique com **botão direito** no ícone verde da bandeja
2. Selecione: **"🧪 Testar Notificação (Simular Nova)"**
3. Observe:
   - 🔔 Notificação aparece na tela
   - 💛 Ícone muda para amarelo e pisca
   - 🔊 Som de alerta (se habilitado no Windows)

---

## 🔍 Verificar se o Sistema Está Detectando

### Ver Logs em Tempo Real

```powershell
cd "C:\Users\Usuario\Desktop\PROJETOS\maternidade-tjse"
npm start
```

Você verá mensagens como:
- ✅ `[10:20:30] Status: 🟢 | Novas: 0` - Sistema online, nenhuma solicitação
- 🟡 `[10:20:30] Status: 🟢 | Novas: 1` - 1 solicitação detectada!

---

## 🎯 Cores dos Ícones

- 🟢 **Verde**: Sistema online, sem novas solicitações
- 🟡 **Amarelo**: NOVA SOLICITAÇÃO detectada!
- 🔴 **Vermelho**: Sistema offline ou com erro

---

## ⚠️ Solução de Problemas

### HTML Vazio (nenhuma detecção)
**Causa**: Não está logado no TJSE  
**Solução**: Faça login no Chrome primeiro (passo 1 acima)

### Múltiplos Ícones na Bandeja
**Causa**: Várias instâncias rodando  
**Solução**: Feche todos os ícones, execute:
```powershell
Stop-Process -Name electron -Force
```
Depois inicie novamente com `iniciar-windows.bat`

### Notificação Não Aparece
1. Verifique permissões de notificação do Windows:
   - Configurações → Sistema → Notificações
   - Certifique-se que notificações estão ativadas
2. Teste com o menu: "🧪 Testar Notificação"

---

## 📋 Próximos Passos

Se as notificações de teste funcionarem mas as reais não:

1. Abra o console: `npm start`
2. Veja se aparece: "⚠️ HTML vazio"
3. Faça login manual no TJSE pelo Chrome
4. Tente novamente

**O sistema agora bloqueia múltiplas instâncias automaticamente!** ✅
