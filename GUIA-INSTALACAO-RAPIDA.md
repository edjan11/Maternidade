# 📦 Guia de Instalação Rápida - Monitor Maternidade TJSE

## ✅ Pré-requisitos

1. **Node.js** instalado
   - Download: https://nodejs.org/
   - Versão recomendada: 18.x ou superior

2. **Google Chrome** instalado
   - O sistema detecta automaticamente

---

## 🚀 Instalação em 3 Passos

### 1️⃣ Copie a pasta do projeto

Copie a pasta `maternidade-tjse` para qualquer lugar no PC (Desktop, Documentos, etc.)

### 2️⃣ Execute o instalador

- Clique duas vezes em **`INSTALAR.bat`**
- Aguarde a instalação das dependências (1-2 minutos)
- Pronto!

### 3️⃣ Inicie o monitor

**Opção A - Iniciar Manualmente:**
- Clique duas vezes em **`iniciar-windows.bat`**
- O ícone aparecerá na bandeja do sistema

**Opção B - Iniciar Automaticamente:**
- Siga as instruções em **`INICIAR-COM-WINDOWS.md`**

---

## 🔧 O Sistema Detecta Automaticamente

✅ Localização do Google Chrome  
✅ Perfil do usuário atual do Windows  
✅ Credenciais salvas no navegador  
✅ Configurações do sistema

**Nenhuma configuração manual necessária!**

---

## 🖱️ Como Usar

### Ícone na Bandeja
- 🟢 **Verde**: Sistema online, sem novas solicitações
- 🟡 **Amarelo**: NOVA SOLICITAÇÃO DETECTADA!
- 🔴 **Vermelho**: Sistema offline ou com erro

### Interagir com o Ícone
- **Clique duplo**: Abre o TJSE Maternidade no Chrome
- **Botão direito**: Menu com opções

### Notificações
Quando uma nova solicitação for detectada:
- 🔔 Notificação na tela
- 💛 Ícone pisca amarelo
- 🔊 Som de alerta (se habilitado no Windows)

---

## 🛠️ Solução de Problemas

### ❌ "Node.js não encontrado"
1. Instale o Node.js: https://nodejs.org/
2. Reinicie o PC
3. Execute o `INSTALAR.bat` novamente

### ❌ "Chrome não encontrado"
- Instale o Google Chrome: https://www.google.com/chrome/
- O sistema detectará automaticamente após instalação

### ❌ Notificação não aparece
1. Verifique se as notificações do Windows estão ativadas
2. Execute manualmente: abra PowerShell na pasta e digite `npm start`
3. Observe o console para mensagens de erro

### ❌ Acesso negado ao clicar no ícone
- Feche todas as janelas do Chrome
- Execute o `iniciar-windows.bat` novamente

---

## 📋 Instalação em Múltiplas Máquinas

1. **Copie a pasta completa** para cada PC
2. Execute **`INSTALAR.bat`** em cada máquina
3. Configure inicialização automática (opcional)

**Nada mais é necessário!** O sistema se adapta automaticamente a cada máquina.

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console (execute `npm start` no PowerShell)
2. Procure mensagens de erro
3. Verifique se o Chrome e Node.js estão instalados

---

## ⚙️ Configurações Padrão

- **Intervalo de verificação**: 3 minutos
- **URL monitorada**: TJSE Maternidade
- **Status detectado**: SOLICITADO (novas pendentes)
- **Modo teste**: Desativado (só notifica quando real)

Todas as configurações são aplicadas automaticamente!
