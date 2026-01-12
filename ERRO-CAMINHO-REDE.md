# ⚠️ ERRO: Caminho de Rede (UNC)

Se apareceu este erro:
```
Não há suporte para caminhos UNC
EPERM: operation not permitted
```

## ✅ Solução 1: Copiar para Pasta Local (RECOMENDADO)

Copie a pasta para uma pasta local:
```
C:\maternidade-tjse
```

Ou:
```
C:\Users\EDJAN\Desktop\maternidade-tjse
```

Depois execute o instalador normalmente.

## ✅ Solução 2: Mapear Unidade de Rede

1. **Abra o Explorer**
2. **Clique com direito em** `Este Computador` → `Mapear unidade de rede`
3. **Escolha uma letra** (ex: Z:)
4. **Cole o caminho:**
   ```
   \\Servidor\usuarios\EDJAN\APPS
   ```
5. **Marque:** "Reconectar ao fazer logon"
6. **OK**

Agora acesse via: `Z:\maternidade-tjse\`

## ✅ Solução 3: PowerShell com pushd

```powershell
pushd "\\Servidor\usuarios\EDJAN\APPS\maternidade-tjse"
npm install
npm start
```

## 🚫 Não Funciona

❌ Caminhos UNC direto no CMD:
```
\\Servidor\usuarios\...
```

## 💡 Por Que?

O CMD.exe e npm não suportam caminhos UNC (\\Servidor\...).
É uma limitação do Windows.
