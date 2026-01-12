const { app, Tray, Menu, nativeImage, Notification, BrowserWindow, session } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// ========================================
// CONFIGURAÇÃO
// ========================================
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos
const LOGIN_RETRY_MS = 5 * 60 * 1000;    // 5 minutos

const TARGET_URL = 'https://www.tjse.jus.br/registrocivil/seguro/maternidade/solicitacaoExterna/consultaSolicitacaoExterna.tjse';
const LOGIN_URL = 'https://www.tjse.jus.br/controleacesso/paginas/loginTJSE.tjse';
const PORTAL_URL = 'https://www.tjse.jus.br/portalExterno/';
const REGISTRO_CIVIL_URL = 'https://www.tjse.jus.br/registrocivil/';

const ICONS_DIR = path.join(__dirname, '..', 'icons');
const CREDENTIALS_FILE = path.join(__dirname, '..', 'credentials.enc');
const SECRET_KEY = 'tjse-monitor-2024-secure-key-32b';

// ========================================
// ESTADO GLOBAL
// ========================================
let tray = null;
let mainWindow = null;
let checkInterval = null;
let loginRetryTimeout = null;
let isLoggedIn = false;
let lastCount = 0;

// ========================================
// CRIPTOGRAFIA
// ========================================
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = Buffer.from(parts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch {
        return null;
    }
}

function saveCredentials(login, senha) {
    const data = JSON.stringify({ login, senha });
    fs.writeFileSync(CREDENTIALS_FILE, encrypt(data));
}

function loadCredentials() {
    try {
        if (fs.existsSync(CREDENTIALS_FILE)) {
            const encrypted = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
            const decrypted = decrypt(encrypted);
            return decrypted ? JSON.parse(decrypted) : null;
        }
    } catch { }
    return null;
}

// ========================================
// ÍCONES
// ========================================
function getIcon(type) {
    const iconMap = {
        'ok': 'maternidade-ok.ico',
        'alert': 'maternidade-nova-solicitacao.ico',
        'offline': 'maternidade-offline.ico'
    };
    const iconPath = path.join(ICONS_DIR, iconMap[type] || iconMap['offline']);
    if (fs.existsSync(iconPath)) {
        return nativeImage.createFromPath(iconPath);
    }
    return null;
}

function updateTrayIcon(type, tooltip) {
    if (tray) {
        const icon = getIcon(type);
        if (icon) tray.setImage(icon);
        tray.setToolTip(tooltip || 'Monitor Maternidade TJSE');
    }
}

// ========================================
// NOTIFICAÇÃO
// ========================================
function showNotification(title, body) {
    new Notification({ title, body }).show();
}

// ========================================
// HORÁRIO DE TRABALHO
// ========================================
function isWorkHours() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeNum = hours * 100 + minutes;
    
    // Seg-Sex, 8:05 - 17:10
    return day >= 1 && day <= 5 && timeNum >= 805 && timeNum <= 1710;
}

// ========================================
// VERIFICAÇÃO EM BACKGROUND (INVISÍVEL)
// ========================================
async function checkNewRecords() {
    console.log('\n🔍 Verificando em background...');
    
    return new Promise((resolve) => {
        const win = new BrowserWindow({
            width: 1200,
            height: 800,
            show: false, // INVISÍVEL!
            webPreferences: {
                partition: 'persist:tjse-monitor',
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        let resolved = false;
        const done = (result) => {
            if (!resolved) {
                resolved = true;
                win.destroy();
                resolve(result);
            }
        };

        // Intercepta popups e navega na mesma janela
        win.webContents.setWindowOpenHandler(({ url }) => {
            console.log('🔗 Popup interceptado:', url);
            if (!url.includes('blank.tjse')) {
                win.loadURL(url);
            }
            return { action: 'deny' };
        });

        // Timeout de 30 segundos
        setTimeout(() => done({ success: false, count: 0, needsLogin: true }), 30000);

        win.webContents.on('did-finish-load', async () => {
            const url = win.webContents.getURL();
            
            // Ignora blank.tjse
            if (url.includes('blank.tjse')) return;
            
            console.log('📄', url);

            // Se redirecionou para login ou acesso negado = sessão expirada
            if (url.includes('loginTJSE') || url.includes('acessonegado')) {
                console.log('⚠️ Sessão expirada');
                isLoggedIn = false;
                done({ success: false, count: 0, needsLogin: true });
                return;
            }

            // Se está na página de consultas
            if (url.includes('consultaSolicitacaoExterna')) {
                try {
                    // Aguarda tabela carregar
                    await new Promise(r => setTimeout(r, 3000));
                    
                    // Conta SOLICITADO na tabela
                    const count = await win.webContents.executeJavaScript(`
                        (function() {
                            const cells = document.querySelectorAll('td');
                            let count = 0;
                            cells.forEach(td => {
                                if (td.textContent.trim() === 'SOLICITADO') count++;
                            });
                            // Também verifica spans com ui-message-warn
                            document.querySelectorAll('span.ui-message-warn, span').forEach(span => {
                                if (span.textContent.trim() === 'SOLICITADO') count++;
                            });
                            return count;
                        })();
                    `);
                    
                    console.log(`✅ Encontrados: ${count} SOLICITADO(s)`);
                    isLoggedIn = true;
                    done({ success: true, count, needsLogin: false });
                } catch (err) {
                    console.log('❌ Erro ao contar:', err.message);
                    done({ success: false, count: 0, needsLogin: false });
                }
                return;
            }

            // Se está no portal após login, navega para consultas
            if (url.includes('portalExterno') || url.includes('portal')) {
                console.log('📍 Portal detectado, indo para Registro Civil...');
                win.loadURL(REGISTRO_CIVIL_URL);
                return;
            }

            // Se está no Registro Civil, vai para consultas
            if (url.includes('/registrocivil/') && !url.includes('consultaSolicitacaoExterna') && !url.includes('acessonegado')) {
                console.log('📍 Registro Civil, indo para consultas...');
                await new Promise(r => setTimeout(r, 1000));
                win.loadURL(TARGET_URL);
                return;
            }
        });

        // Carrega diretamente a URL de consultas
        win.loadURL(TARGET_URL);
    });
}

// ========================================
// AUTO-LOGIN (INVISÍVEL - SEM 2FA)
// ========================================
async function tryAutoLogin() {
    const creds = loadCredentials();
    if (!creds) {
        console.log('❌ Sem credenciais salvas');
        return false;
    }

    console.log('🔐 Iniciando login em background...');

    return new Promise((resolve) => {
        const win = new BrowserWindow({
            width: 1200,
            height: 800,
            show: false, // INVISÍVEL!
            webPreferences: {
                partition: 'persist:tjse-monitor',
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        let resolved = false;
        let loginAttempted = false;
        
        const done = (success) => {
            if (!resolved) {
                resolved = true;
                if (!win.isDestroyed()) win.destroy();
                resolve(success);
            }
        };

        // Intercepta popups e navega na mesma janela
        win.webContents.setWindowOpenHandler(({ url }) => {
            console.log('🔗 Popup interceptado:', url);
            if (!url.includes('blank.tjse')) {
                win.loadURL(url);
            }
            return { action: 'deny' };
        });

        // Timeout de 60 segundos
        setTimeout(() => {
            console.log('⏰ Timeout no login');
            done(false);
        }, 60000);

        win.webContents.on('did-finish-load', async () => {
            const url = win.webContents.getURL();
            
            // Ignora blank.tjse
            if (url.includes('blank.tjse')) return;
            
            console.log('📄 Login:', url);

            // Se chegou na página de login
            if (url.includes('loginTJSE') && !loginAttempted) {
                loginAttempted = true;
                await new Promise(r => setTimeout(r, 1500));

                try {
                    // 1. Clica no botão "Login e senha"
                    console.log('📝 Clicando em "Login e senha"...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const btn = document.querySelector('img[alt="Entrar com login e senha"]');
                            if (btn) btn.click();
                        })();
                    `);
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    // 2. Preenche credenciais
                    console.log('📝 Preenchendo credenciais...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const loginField = document.querySelector('#loginName');
                            const senhaField = document.querySelector('#loginSenha');
                            if (loginField) {
                                loginField.value = '${creds.login}';
                                loginField.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                            if (senhaField) {
                                senhaField.value = '${creds.senha}';
                                senhaField.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        })();
                    `);
                    
                    await new Promise(r => setTimeout(r, 1000));
                    
                    // 3. Clica em Entrar
                    console.log('📝 Clicando em Entrar...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const btn = document.querySelector('input[value="Entrar"]') || 
                                       document.querySelector('button[type="submit"]') ||
                                       document.querySelector('input[type="submit"]');
                            if (btn) btn.click();
                        })();
                    `);
                    
                    console.log('⏳ Aguardando redirecionamento...');
                    
                } catch (err) {
                    console.log('❌ Erro no login:', err.message);
                }
                return;
            }

            // Se chegou no portal = login OK!
            if ((url.includes('portalExterno') || url.includes('portal') || url.includes('sistemasTJSE')) && !url.includes('login')) {
                console.log('✅ Login OK! Clicando em Registro Civil...');
                isLoggedIn = true;
                await new Promise(r => setTimeout(r, 2000));
                
                // Clica no botão Registro Civil - busca pelo texto no h2
                await win.webContents.executeJavaScript(`
                    (function() {
                        const allLinks = document.querySelectorAll('a[id*="clAcessar"]');
                        for (let link of allLinks) {
                            const h2 = link.querySelector('h2');
                            if (h2 && h2.textContent.trim() === 'Registro Civil') {
                                link.click();
                                return;
                            }
                        }
                    })();
                `);
                return;
            }

            // Se está no Registro Civil, clica no menu Maternidade
            if (url.includes('/registrocivil/') && !url.includes('acessonegado') && !url.includes('login') && !url.includes('consultaSolicitacaoExterna')) {
                console.log('✅ Registro Civil! Navegando via menu...');
                await new Promise(r => setTimeout(r, 2000));
                
                // Abre dropdown Maternidade
                await win.webContents.executeJavaScript(`
                    (function() {
                        const maternidadeMenu = Array.from(document.querySelectorAll('span.ui-menuitem-text'))
                            .find(span => span.textContent.includes('Maternidade'));
                        if (maternidadeMenu) {
                            const parentLi = maternidadeMenu.closest('li');
                            if (parentLi) {
                                parentLi.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                                parentLi.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                            }
                        }
                    })();
                `);
                
                await new Promise(r => setTimeout(r, 1500));
                
                // Clica no link de Solicitação Externa
                await win.webContents.executeJavaScript(`
                    (function() {
                        const link = document.querySelector('a[href*="consultaSolicitacaoExterna"]');
                        if (link) {
                            link.click();
                        } else {
                            window.location.href = '/registrocivil/seguro/maternidade/solicitacaoExterna/consultaSolicitacaoExterna.tjse';
                        }
                    })();
                `);
                return;
            }

            // Se chegou nas consultas = tudo OK!
            if (url.includes('consultaSolicitacaoExterna')) {
                console.log('✅ LOGIN COMPLETO!');
                isLoggedIn = true;
                showNotification('Monitor TJSE', '✅ Login realizado com sucesso!');
                done(true);
                return;
            }
        });

        win.loadURL(LOGIN_URL);
    });
}

// ========================================
// LOOP PRINCIPAL
// ========================================
async function mainLoop() {
    const result = await checkNewRecords();
    
    if (result.success) {
        // Sessão OK, verificou com sucesso
        if (result.count > 0) {
            updateTrayIcon('alert', `⚠️ ${result.count} SOLICITADO(s) pendente(s)!`);
            if (result.count > lastCount) {
                showNotification('Nova Solicitação!', `Existem ${result.count} solicitação(ões) pendente(s).`);
            }
        } else {
            updateTrayIcon('ok', '✅ Nenhuma solicitação pendente');
        }
        lastCount = result.count;
        
        // Cancela retry de login se estava agendado
        if (loginRetryTimeout) {
            clearTimeout(loginRetryTimeout);
            loginRetryTimeout = null;
        }
    } else if (result.needsLogin) {
        // Precisa fazer login
        updateTrayIcon('offline', '🔴 Sessão expirada - faça login');
        
        // Se horário de trabalho, agenda retry
        if (isWorkHours() && !loginRetryTimeout) {
            scheduleAutoLoginRetry();
        }
    }
}

function scheduleAutoLoginRetry() {
    if (loginRetryTimeout) return;
    
    console.log('⏰ Próxima tentativa de login em 5 minutos...');
    loginRetryTimeout = setTimeout(async () => {
        loginRetryTimeout = null;
        
        if (!isLoggedIn && isWorkHours()) {
            const success = await tryAutoLogin();
            if (success) {
                // Login OK, verifica imediatamente
                await mainLoop();
            } else if (isWorkHours()) {
                // Ainda não logado, agenda outra tentativa
                scheduleAutoLoginRetry();
            }
        }
    }, LOGIN_RETRY_MS);
}

// ========================================
// MENU DO TRAY
// ========================================
function createTrayMenu() {
    const creds = loadCredentials();
    
    return Menu.buildFromTemplate([
        {
            label: '🏥 Monitor Maternidade TJSE',
            enabled: false
        },
        { type: 'separator' },
        {
            label: '🔑 Fazer Login (background)',
            click: async () => {
                const success = await tryAutoLogin();
                if (success) {
                    await mainLoop();
                }
            }
        },
        {
            label: '👁️ Ver Login (debug)',
            click: async () => {
                const success = await tryLoginVisible();
                if (success) {
                    await mainLoop();
                }
            }
        },
        {
            label: '🔄 Verificar Agora',
            click: () => mainLoop()
        },
        {
            label: '🌐 Abrir Site',
            click: () => {
                const { shell } = require('electron');
                shell.openExternal(TARGET_URL);
            }
        },
        { type: 'separator' },
        {
            label: creds ? `⚙️ ${creds.login}` : '⚙️ Configurar Login',
            click: () => promptCredentials()
        },
        { type: 'separator' },
        {
            label: '❌ Sair',
            click: () => app.quit()
        }
    ]);
}

function promptCredentials() {
    const creds = loadCredentials();
    
    const win = new BrowserWindow({
        width: 400,
        height: 320,
        resizable: false,
        alwaysOnTop: true,
        title: 'Credenciais TJSE',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload-creds.js')
        }
    });

    // Cria preload se não existir
    const preloadPath = path.join(__dirname, 'preload-creds.js');
    if (!fs.existsSync(preloadPath)) {
        fs.writeFileSync(preloadPath, `
            const { contextBridge, ipcRenderer } = require('electron');
            contextBridge.exposeInMainWorld('api', {
                saveCredentials: (data) => ipcRenderer.send('save-credentials', data)
            });
        `);
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Segoe UI, sans-serif; padding: 20px; background: #f5f5f5; }
                h2 { color: #333; margin-bottom: 20px; text-align: center; }
                label { display: block; margin: 10px 0 5px; font-weight: 500; }
                input { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
                .buttons { text-align: center; margin-top: 20px; }
                button { background: #0078d4; color: white; border: none; padding: 10px 25px; border-radius: 4px; cursor: pointer; margin: 0 5px; font-size: 14px; }
                button:hover { background: #106ebe; }
                button.cancel { background: #666; }
            </style>
        </head>
        <body>
            <h2>🔑 Credenciais TJSE</h2>
            <label>Login:</label>
            <input type="text" id="login" value="${creds ? creds.login : ''}" placeholder="seu.usuario">
            <label>Senha:</label>
            <input type="password" id="senha" value="${creds ? creds.senha : ''}" placeholder="sua senha">
            <div class="buttons">
                <button onclick="salvar()">💾 Salvar</button>
                <button class="cancel" onclick="window.close()">Cancelar</button>
            </div>
            <script>
                function salvar() {
                    const login = document.getElementById('login').value;
                    const senha = document.getElementById('senha').value;
                    if (login && senha) {
                        window.api.saveCredentials({ login, senha });
                        window.close();
                    } else {
                        alert('Preencha login e senha');
                    }
                }
            </script>
        </body>
        </html>
    `;

    const tempFile = path.join(app.getPath('temp'), 'tjse-creds.html');
    fs.writeFileSync(tempFile, html);
    win.loadFile(tempFile);
    win.setMenu(null);

    const { ipcMain } = require('electron');
    ipcMain.once('save-credentials', (event, data) => {
        saveCredentials(data.login, data.senha);
        console.log('✅ Credenciais salvas:', data.login);
        tray.setContextMenu(createTrayMenu());
    });
}

// ========================================
// LOGIN VISÍVEL (PARA DEBUG)
// ========================================
async function tryLoginVisible() {
    const creds = loadCredentials();
    if (!creds) {
        console.log('❌ Configure as credenciais primeiro');
        return false;
    }

    console.log('🔐 Login VISÍVEL para debug...');

    return new Promise((resolve) => {
        const win = new BrowserWindow({
            width: 1000,
            height: 700,
            show: true,
            title: 'TJSE Login - Debug',
            webPreferences: {
                partition: 'persist:tjse-monitor',
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        let resolved = false;
        let loginAttempted = false;
        let currentWin = win; // Rastreia a janela ativa
        
        const done = (success) => {
            if (!resolved) {
                resolved = true;
                resolve(success);
                // NÃO fecha a janela para debug
            }
        };

        // Intercepta popups e navega na mesma janela
        const setupPopupHandler = (browserWin) => {
            browserWin.webContents.setWindowOpenHandler(({ url }) => {
                console.log('🔗 [DEBUG] Popup interceptado:', url);
                // Ignora blank.tjse e navega diretamente
                if (!url.includes('blank.tjse')) {
                    browserWin.loadURL(url);
                }
                return { action: 'deny' };
            });
        };

        setupPopupHandler(win);

        win.webContents.on('did-finish-load', async () => {
            const url = win.webContents.getURL();
            
            // Ignora páginas blank.tjse
            if (url.includes('blank.tjse')) {
                console.log('⏭️ [DEBUG] Ignorando blank.tjse');
                return;
            }
            
            console.log('📄 [DEBUG]', url);

            if (url.includes('loginTJSE') && !loginAttempted) {
                loginAttempted = true;
                await new Promise(r => setTimeout(r, 1500));

                try {
                    console.log('📝 [DEBUG] Clicando em "Login e senha"...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const btn = document.querySelector('img[alt="Entrar com login e senha"]');
                            if (btn) { btn.click(); return 'OK'; }
                            return 'Botão não encontrado';
                        })();
                    `).then(r => console.log('   Resultado:', r));
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    console.log('📝 [DEBUG] Preenchendo credenciais...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const loginField = document.querySelector('#loginName');
                            const senhaField = document.querySelector('#loginSenha');
                            let result = [];
                            if (loginField) {
                                loginField.value = '${creds.login}';
                                loginField.dispatchEvent(new Event('input', { bubbles: true }));
                                result.push('login OK');
                            } else {
                                result.push('login NÃO ENCONTRADO');
                            }
                            if (senhaField) {
                                senhaField.value = '${creds.senha}';
                                senhaField.dispatchEvent(new Event('input', { bubbles: true }));
                                result.push('senha OK');
                            } else {
                                result.push('senha NÃO ENCONTRADO');
                            }
                            return result.join(', ');
                        })();
                    `).then(r => console.log('   Resultado:', r));
                    
                    await new Promise(r => setTimeout(r, 1000));
                    
                    console.log('📝 [DEBUG] Clicando em Entrar...');
                    await win.webContents.executeJavaScript(`
                        (function() {
                            const btn = document.querySelector('input[value="Entrar"]') || 
                                       document.querySelector('button[type="submit"]') ||
                                       document.querySelector('input[type="submit"]');
                            if (btn) { btn.click(); return 'Clicou em: ' + btn.tagName; }
                            return 'Botão Entrar não encontrado';
                        })();
                    `).then(r => console.log('   Resultado:', r));
                    
                } catch (err) {
                    console.log('❌ [DEBUG] Erro:', err.message);
                }
                return;
            }

            if ((url.includes('portalExterno') || url.includes('portal') || url.includes('sistemasTJSE')) && !url.includes('login')) {
                console.log('✅ [DEBUG] Portal/Sistemas! Procurando botão Registro Civil...');
                isLoggedIn = true;
                await new Promise(r => setTimeout(r, 2000));
                
                // Clica no botão Registro Civil - busca pelo texto exato no h2
                const clickResult = await win.webContents.executeJavaScript(`
                    (function() {
                        // Lista todos os botões disponíveis para debug
                        const allH2 = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim());
                        console.log('H2 encontrados:', allH2);
                        
                        // Procura h2 com texto "Registro Civil" e clica no link pai
                        const allLinks = document.querySelectorAll('a[id*="clAcessar"]');
                        for (let link of allLinks) {
                            const h2 = link.querySelector('h2');
                            if (h2 && h2.textContent.trim() === 'Registro Civil') {
                                console.log('Encontrou link:', link.id);
                                link.click();
                                return 'Clicou em Registro Civil (id: ' + link.id + ')';
                            }
                        }
                        
                        return 'Botão Registro Civil não encontrado. H2s: ' + allH2.join(', ');
                    })();
                `);
                console.log('   ', clickResult);
                return;
            }

            // Se está no Registro Civil, clica no menu Maternidade
            if (url.includes('/registrocivil/') && !url.includes('acessonegado') && !url.includes('login') && !url.includes('consultaSolicitacaoExterna')) {
                console.log('✅ [DEBUG] Registro Civil! Navegando para consultas via menu...');
                await new Promise(r => setTimeout(r, 2000));
                
                // Tenta clicar no menu Maternidade e depois no submenu
                const menuResult = await win.webContents.executeJavaScript(`
                    (function() {
                        // Procura o menu Maternidade
                        const maternidadeMenu = Array.from(document.querySelectorAll('span.ui-menuitem-text'))
                            .find(span => span.textContent.includes('Maternidade'));
                        
                        if (maternidadeMenu) {
                            // Dispara evento de mouse para abrir o dropdown
                            const parentLi = maternidadeMenu.closest('li');
                            if (parentLi) {
                                parentLi.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                                parentLi.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                            }
                            return 'Menu Maternidade encontrado, abrindo dropdown...';
                        }
                        return 'Menu Maternidade não encontrado';
                    })();
                `);
                console.log('   ', menuResult);
                
                await new Promise(r => setTimeout(r, 1500));
                
                // Agora clica no link de Solicitação Externa
                const linkResult = await win.webContents.executeJavaScript(`
                    (function() {
                        // Tenta encontrar o link direto
                        const link = document.querySelector('a[href*="consultaSolicitacaoExterna"]');
                        if (link) {
                            link.click();
                            return 'Clicou em Solicitação Externa';
                        }
                        
                        // Se não achou, tenta navegar direto
                        window.location.href = '/registrocivil/seguro/maternidade/solicitacaoExterna/consultaSolicitacaoExterna.tjse';
                        return 'Navegando direto para URL';
                    })();
                `);
                console.log('   ', linkResult);
                return;
            }

            if (url.includes('consultaSolicitacaoExterna')) {
                console.log('✅ [DEBUG] LOGIN COMPLETO!');
                isLoggedIn = true;
                showNotification('Monitor TJSE', '✅ Login realizado!');
                done(true);
                return;
            }
        });

        win.loadURL(LOGIN_URL);
    });
}

// ========================================
// INICIALIZAÇÃO
// ========================================
app.whenReady().then(() => {
    // Instância única
    const gotLock = app.requestSingleInstanceLock();
    if (!gotLock) {
        console.log('❌ Já existe uma instância rodando!');
        app.quit();
        return;
    }

    const creds = loadCredentials();
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  🏥 Monitor Maternidade TJSE               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`├─ Intervalo: 5 min`);
    console.log(`├─ Auto-login: 8:05 - 17:10`);
    console.log(`├─ Login: ${creds ? creds.login : '(não configurado)'}`);
    console.log(`├─ Horário trabalho: ${isWorkHours() ? 'SIM' : 'NÃO'}`);

    // Cria tray
    tray = new Tray(getIcon('offline'));
    tray.setToolTip('Monitor Maternidade - Iniciando...');
    tray.setContextMenu(createTrayMenu());
    
    // Duplo clique abre site
    tray.on('double-click', () => {
        const { shell } = require('electron');
        shell.openExternal(TARGET_URL);
    });

    // Primeira verificação
    mainLoop();
    
    // Loop de verificação a cada 5 min
    checkInterval = setInterval(mainLoop, CHECK_INTERVAL_MS);
});

app.on('window-all-closed', (e) => e.preventDefault());
