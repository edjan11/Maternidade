export const config = {
  // URL do TJSE para monitoramento e automação
  targetUrl: "https://www.tjse.jus.br/registrocivil/seguro/maternidade/solicitacaoExterna/consultaSolicitacaoExterna.tjse",

  // Caminho do Chrome no Windows
  chromeExePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

  // Perfil do Chrome (pra manter login/cookies). Ajuste se usar outro.
  // Opções comuns: "Default", "Profile 1", "Profile 2"...
  chromeProfileDirectory: "Default",

  // Flags úteis (não mexa se não souber)
  extraArgs: [
    "--no-first-run",
    "--disable-features=Translate",
    "--disable-notifications"
  ],

  // Intervalo de verificação do monitor (em minutos)
  checkIntervalMinutes: 5,

  // Timeout para requisições (em segundos)
  requestTimeoutSeconds: 30,

  // Porta do servidor de configuração local
  setupServerPort: 3030
};
