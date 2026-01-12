# 🔍 Monitor Maternidade TJSE - Registro Civil RCPN

Sistema de monitoramento automático que detecta novas solicitações de maternidade no portal TJSE/RCPN e notifica você instantaneamente.

## 🚀 Início Rápido

**Clique duplo em:** `iniciar-windows.bat`

## 📋 Recursos

- ✅ **Monitoramento Automático** - Verifica status "SOLICITADO" a cada 3 minutos
- ✅ **Ícone na Bandeja** - Verde (OK) / Amarelo (Nova!) / Vermelho (Offline)
- ✅ **Notificações Windows** - Alerta visual e sonoro
- ✅ **Ícone Piscante** - Chama atenção quando tem novidade
- ✅ **Abertura Rápida** - Clique duplo abre Maternidade TJSE
- ✅ **Inicialização Automática** - Configura para iniciar com Windows

## 🎨 Significado das Cores

| Ícone | Tooltip | Descrição |
|-------|---------|-----------|
| 🟢 Verde | "✅ Maternidade TJSE - Online - Sem novidades" | Tudo OK |
| 🟡 Amarelo | "🔔 Maternidade TJSE - 1 NOVA SOLICITAÇÃO!" | **NOVA DETECTADA** |
| 🔴 Vermelho | "❌ Maternidade TJSE - Offline" | Sistema indisponível |

## 📁 Estrutura de Arquivos

```
monitor-maternidade-tjse/
├── src/
│   ├── electron-main.js          ⭐ Código principal
│   ├── simple-start.js           Abre TJSE direto
│   ├── config.js                 Configurações
│   └── launchChrome.js           Lançador Chrome
├── icons/
│   ├── maternidade-ok.ico                    🟢 Verde
│   ├── maternidade-nova-solicitacao.ico      🟡 Amarelo
│   └── maternidade-offline.ico               🔴 Vermelho
├── iniciar-windows.bat           ⭐ INICIAR AQUI
├── INICIAR-COM-WINDOWS.md        📖 Guia configuração
└── README.md
```

## ⚙️ Configurar Inicialização Automática

Veja: **[INICIAR-COM-WINDOWS.md](INICIAR-COM-WINDOWS.md)**

**Resumo:**
1. `Win + R` → `taskschd.msc`
2. Criar Tarefa → "Monitor Maternidade TJSE - RCPN"
3. Programa: `iniciar-windows.bat`
4. Gatilho: "Na inicialização"

## 🖱️ Como Usar

- **Clique direito** no ícone → Menu completo
- **Clique duplo** → Abre Maternidade TJSE
- **Notificação** → Clique para abrir sistema

## 🔍 Detecção

Busca `value="SOLICITADO"` no HTML do TJSE.  
Quando encontra: ícone fica amarelo + pisca + notifica.

## 🛠️ Comandos

```powershell
npm start              # Iniciar monitor
npm run open-tjse      # Abrir TJSE direto
```

## 📊 Status

- ✅ Modo Teste: Desativado
- ✅ Verificação: 3 minutos
- ✅ Monitora: SOLICITADO
- ✅ Notificações: Ativas

---

**v1.0.0 - RCPN - Registro Civil de Pessoas Naturais**
