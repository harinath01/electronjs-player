const installer = require('electron-winstaller');
const path = require('path');

async function main() {
    try {
        await installer.createWindowsInstaller({
            appDirectory: path.resolve(__dirname, 'dist/TpStreams-win32-x64'),
            outputDirectory: path.resolve(__dirname, 'dist/installer'),
            authors: 'Testpress',
            exe: 'TpStreams.exe',
            version: '1.0.0',

        });
        console.log('Installer created successfully');
    } catch (e) {
        console.error(`Failed to create installer: ${e.message}`);
    }
}

main();