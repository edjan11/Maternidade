# 🏥 Monitor TJSE Maternidade

Monitor automático de solicitações pendentes no sistema de maternidade do TJSE.

## 🚀 Instalação

⚠️ **Importante:** Não funciona em pastas de rede (`\\Servidor\...`). Copie para uma pasta local primeiro!

```bash
npm install
```

❌ **Erro "caminho UNC"?** Veja: **[ERRO-CAMINHO-REDE.md](ERRO-CAMINHO-REDE.md)**

## ▶️ Executar

**Opção 1 - Simples (recomendado):**
```bash
INICIAR.bat
```

**Opção 2 - Invisível:**
```bash
wscript iniciar-invisivel.vbs
```

**Opção 3 - Com terminal:**
```bash
npm start
```

## 🛡️ Antivírus Bloqueando?

Se o app não iniciar, veja: **[ANTIVIRUS.md](ANTIVIRUS.md)**

**Resumo:** Adicione a pasta `maternidade-tjse` nas exceções do antivírus.

## ⚙️ Configuração

1. Execute o aplicativo
2. Clique no ícone na bandeja do sistema
3. Selecione "Configurar Login"
4. Digite suas credenciais do TJSE

## 📦 Funcionalidades

- ✅ Monitoramento automático a cada 5 minutos
- ✅ Notificações quando aparecem solicitações "SOLICITADO"
- ✅ Auto-login durante horário de trabalho (8:05-17:10)
- ✅ Credenciais criptografadas com AES-256-CBC
- ✅ Roda em background (sem janela)

## 📊 Ícones

- 🟢 Verde = Nenhuma solicitação pendente
- 🟡 Amarelo = Novas solicitações encontradas
- 🔴 Vermelho = Sessão expirada
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
