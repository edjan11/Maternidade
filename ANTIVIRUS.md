# 🛡️ Configuração de Antivírus

Se o monitor não iniciar ou for bloqueado, adicione estas exceções no seu antivírus:

## Windows Defender

1. **Abrir Segurança do Windows**
   - `Win + I` → Privacidade e segurança → Segurança do Windows → Proteção contra vírus e ameaças

2. **Adicionar Exclusões**
   - Gerenciar configurações → Exclusões → Adicionar ou remover exclusões
   
3. **Adicionar esta pasta:**
   ```
   C:\Users\Usuario\Desktop\PROJETOS\maternidade-tjse
   ```

## Outros Antivírus (Avast, AVG, Norton, etc)

### Avast / AVG
1. Configurações → Geral → Exceções
2. Adicionar exceção → Procurar → Selecionar a pasta `maternidade-tjse`

### Norton
1. Configurações → Antivírus → Verificações e riscos → Itens excluídos
2. Adicionar pasta → Selecionar `maternidade-tjse`

### Kaspersky
1. Configurações → Adicional → Ameaças e exclusões → Especificar aplicativos confiáveis
2. Adicionar → Selecionar pasta `maternidade-tjse`

## ✅ Arquivos Seguros

Este projeto é 100% legítimo:
- ✅ Código-fonte aberto no GitHub
- ✅ Apenas automatiza login no site do TJSE
- ✅ Credenciais armazenadas apenas localmente
- ✅ Sem conexão com servidores externos
- ✅ Sem coleta de dados

## 🚨 Sintomas de Bloqueio

- ❌ App não inicia
- ❌ Janela fecha sozinha
- ❌ Notificação do antivírus
- ❌ Arquivo .vbs ou .bat deletado
- ❌ Electron.exe bloqueado

## 📞 Alternativa sem .vbs

Se o antivírus bloquear `iniciar-invisivel.vbs`, use:

```bash
INICIAR.bat
```

Esse arquivo BAT é menos suspeito para antivírus.
