# 🏥 Monitor Maternidade TJSE

Monitor automático de solicitações pendentes no sistema de maternidade do TJSE.

## 📦 Instalação em Outro Computador

1. **Copie a pasta completa** `maternidade-tjse` para o outro computador
2. **Certifique-se** que o Node.js está instalado (https://nodejs.org)
3. **Execute** `INSTALAR-APP.bat`
4. Pronto! O app estará instalado com atalhos

## 🚀 Primeiro Uso

1. Clique no atalho **"Monitor Maternidade TJSE"** no Menu Iniciar
2. Clique no ícone vermelho na bandeja
3. Selecione **"⚙️ edjan.santos"** (ou "Configurar Login")
4. Digite seu **login** e **senha** do TJSE
5. Clique em **"Salvar"**
6. Clique em **"👁️ Ver Login (debug)"** para testar
7. Aguarde o login completar
8. Pronto! O monitor está ativo

## ⚙️ Como Funciona

- **Verifica automaticamente** a cada 5 minutos
- **Ícone verde** = Nenhuma solicitação pendente
- **Ícone amarelo** = Novas solicitações SOLICITADO encontradas
- **Ícone vermelho** = Sessão expirada, faça login
- **Auto-login** durante horário de trabalho (8:05-17:10)

## 🔧 Opções do Menu

- **🔑 Fazer Login (background)** - Login invisível
- **👁️ Ver Login (debug)** - Login visível para acompanhar
- **🔄 Verificar Agora** - Verifica imediatamente
- **🌐 Abrir Site** - Abre o site do TJSE
- **⚙️ edjan.santos** - Alterar credenciais
- **❌ Sair** - Fechar o monitor

## 📁 Arquivos Importantes

- `INSTALAR-APP.bat` - Instalador com atalhos
- `iniciar-maternidade.bat` - Inicia o monitor
- `credentials.enc` - Credenciais criptografadas (criado após configurar)
- `src/electron-main.js` - Código principal

## 🗑️ Desinstalar

Execute: `powershell -ExecutionPolicy Bypass -File DESINSTALAR-APP.ps1`

## 💾 Requisitos

- Windows 7 ou superior
- Node.js 14 ou superior
- Credenciais válidas do TJSE

## 🔒 Segurança

- Credenciais são criptografadas com AES-256-CBC
- Armazenadas localmente em `credentials.enc`
- Nunca compartilhadas ou enviadas para terceiros
- Sessão isolada do navegador principal

## 📝 Observações

- O monitor funciona **apenas durante horário de trabalho** (8:05-17:10)
- Tenta fazer login automaticamente a cada 5 minutos se desconectado
- Notificações aparecem quando novas solicitações são encontradas
- O login deve ser aprovado **uma vez por dia** (2FA do TJSE)

## 🆘 Problemas Comuns

**Ícone sempre vermelho:**
- Configure suas credenciais: Clique no ícone → "⚙️ edjan.santos"
- Teste o login: Clique no ícone → "👁️ Ver Login (debug)"

**Login não funciona:**
- Verifique se as credenciais estão corretas
- Certifique-se que está dentro do horário de trabalho (8:05-17:10)
- Verifique se consegue acessar o site manualmente

**Node.js não encontrado:**
- Instale o Node.js de https://nodejs.org
- Reinicie o computador após a instalação
- Execute `INSTALAR-APP.bat` novamente

## 📞 Suporte

Este é um monitor automatizado para uso interno do cartório.
Para problemas com o sistema TJSE, contate o suporte oficial do tribunal.

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026
