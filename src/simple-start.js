import { config } from "./config.js";
import { launchChrome } from "./launchChrome.js";

function main() {
  console.log("╔═══════════════════════════════════════════╗");
  console.log("║  🚀 Abrir Maternidade TJSE - RCPN        ║");
  console.log("╚═══════════════════════════════════════════╝\n");
  
  console.log("🌐 Abrindo Chrome no seu perfil...");
  console.log(`📋 URL: ${config.targetUrl}\n`);
  
  // Abre o Chrome com o perfil onde você já está logado
  launchChrome({
    chromeExePath: config.chromeExePath,
    profileDirectory: config.chromeProfileDirectory,
    url: config.targetUrl,
    extraArgs: config.extraArgs
  });

  console.log("✅ Chrome aberto no sistema Maternidade TJSE!");
  console.log("💡 Você já deve estar logado (cookies salvos)\n");
  console.log("⚠️  Se não estiver logado, faça login manualmente");
  console.log("   e o Chrome salvará para as próximas vezes.\n");
}

main();
