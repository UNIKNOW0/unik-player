import { mkdir } from 'fs/promises';
import path from 'path';
import { env } from 'process';

export function makingAppDataDir(){

    createFolderInAppData()

}



async function createFolderInAppData() {
  const appDataPath = env.APPDATA; // Обычно 'C:\\Users\Username\AppData\
  const newFolderPath = path.join(appDataPath, 'UnikPlayer');
  const newSkinFolderPaths = path.join(appDataPath + '/UnikPlayer', 'skins');

  try {
    await mkdir(newFolderPath, { recursive: true });
    await mkdir(newSkinFolderPaths, {recursive:true})
    console.log('Папка в AppData создана!!!');
  } catch (err) {
    console.error('чето не так:', err);
  }
}
