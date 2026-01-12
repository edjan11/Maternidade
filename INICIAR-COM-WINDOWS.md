# 🚀 Como Configurar Inicialização Automática no Windows

Este guia mostra como fazer o Monitor TJSE iniciar automaticamente quando você ligar o PC.

## Método 1: Agendador de Tarefas (RECOMENDADO)

### Passo a Passo:

1. **Abra o Agendador de Tarefas:**
   - Pressione `Win + R`
   - Digite: `taskschd.msc`
   - Pressione Enter

2. **Crie Nova Tarefa:**
   - No painel direito, clique em **"Criar Tarefa"** (não "Tarefa Básica")

3. **Guia "Geral":**
   - Nome: `Monitor TJSE - Registro Civil`
   - Descrição: `Monitora novas solicitações de maternidade no TJSE`
   - ✅ Marque: **"Executar estando o usuário conectado ou não"**
   - ✅ Marque: **"Executar com privilégios mais altos"**
   - Configure para: `Windows 10/11`

4. **Guia "Gatilhos":**
   - Clique em **"Novo"**
   - Iniciar a tarefa: **"Na inicialização"**
   - ✅ Marque: **"Habilitado"**
   - Clique OK

5. **Guia "Ações":**
   - Clique em **"Novo"**
   - Ação: **"Iniciar um programa"**
   - Programa/script: Clique **"Procurar"** e selecione:
     ```
     C:\Users\Pichau\Desktop\Projetos\Centralizador\maternidade-tjse\iniciar-windows.bat
     ```
   - Iniciar em: (deixe vazio ou coloque a pasta do projeto)
   - Clique OK

6. **Guia "Condições":**
   - ❌ Desmarque: "Iniciar a tarefa apenas se o computador estiver conectado à energia CA"
   - ✅ Marque: "Ativar tarefa se houver atraso"

7. **Guia "Configurações":**
   - ✅ Marque: "Permitir que a tarefa seja executada sob demanda"
   - ✅ Marque: "Executar tarefa assim que possível após perda de agendamento"
   - Se a tarefa já estiver em execução: **"Não iniciar nova instância"**

8. **Finalize:**
   - Clique **OK**
   - Digite sua senha do Windows se solicitado

---

## Método 2: Pasta de Inicialização (MAIS SIMPLES)

### Passo a Passo:

1. **Abra a Pasta de Inicialização:**
   - Pressione `Win + R`
   - Digite: `shell:startup`
   - Pressione Enter

2. **Crie Atalho:**
   - Clique com botão direito na pasta que abriu
   - Novo → Atalho
   - Localize o arquivo:
     ```
     C:\Users\Pichau\Desktop\Projetos\Centralizador\maternidade-tjse\iniciar-windows.bat
     ```
   - Clique Avançar
   - Nome: `Monitor TJSE`
   - Clique Concluir

3. **Configure o Atalho (opcional):**
   - Clique direito no atalho → Propriedades
   - Executar: **"Minimizada"**
   - Clique OK

---

## ✅ Testar se Funcionou

### Teste 1: Executar Manualmente
- Reinicie o PC
- Aguarde 30 segundos após fazer login
- Procure o ícone na bandeja do sistema (canto inferior direito)

### Teste 2: Verificar Logs
- Abra o PowerShell no VS Code
- Execute: `npm start`
- Veja se aparecem as mensagens de inicialização

---

## 🛠️ Solução de Problemas

### Ícone não aparece após reiniciar:
1. Verifique se o Node.js está instalado: `node --version`
2. Verifique se o Electron está instalado na pasta do projeto
3. Execute manualmente: `iniciar-windows.bat` para ver erros

### Tarefa não executa:
1. Abra o Agendador de Tarefas
2. Localize "Monitor TJSE"
3. Clique direito → Executar
4. Verifique a aba "Histórico" para ver erros

### Múltiplas instâncias rodando:
1. Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc)
2. Procure por "Electron" ou "node"
3. Finalize os processos duplicados
4. Configure a tarefa para "Não iniciar nova instância"

---

## 📋 Comandos Úteis

```powershell
# Ver se está rodando
Get-Process | Where-Object {$_.ProcessName -like "*electron*"}

# Parar o monitor
Stop-Process -Name electron -Force

# Iniciar manualmente
cd "C:\Users\Pichau\Desktop\Projetos\Centralizador\maternidade-tjse"
npm start
```

---

## ⚙️ Configurações Atuais

- **Verificação:** A cada 3 minutos
- **URL Monitorada:** TJSE Maternidade
- **Status Monitorado:** SOLICITADO (novas solicitações)
- **Modo Teste:** DESATIVADO (só notifica quando for real)

---

## 🔔 Comportamento Esperado

Quando você ligar o PC:
1. ✅ Ícone verde aparece na bandeja (30s após login)
2. ✅ Sistema verifica a cada 3 minutos
3. 🟡 Ícone fica amarelo quando detecta "SOLICITADO"
4. 🔔 Notificação aparece: "NOVA SOLICITAÇÃO DE MATERNIDADE!"
5. 💛 Ícone pisca chamando atenção

---

**Dúvidas?** Teste manualmente primeiro com `iniciar-windows.bat` antes de configurar no agendador!
