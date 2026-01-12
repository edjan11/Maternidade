import { spawn } from "node:child_process";

export function launchChrome({ chromeExePath, profileDirectory, url, extraArgs = [] }) {
  if (!chromeExePath) throw new Error("chromeExePath ausente");
  if (!profileDirectory) throw new Error("profileDirectory ausente");
  if (!url) throw new Error("url ausente");

  const args = [
    `--profile-directory=${profileDirectory}`,
    ...extraArgs,
    url
  ];

  const child = spawn(chromeExePath, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: false
  });

  // solta o processo do Node (deixa o Chrome aberto)
  child.unref();
}
