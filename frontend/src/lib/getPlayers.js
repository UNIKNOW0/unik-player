import { style } from '$lib/stores/stores.js'
import { get } from 'svelte/store';
// загружаем сразу при сборке — модули уже доступны как объект { path: module }
const modules = import.meta.glob('$lib/players/*.svelte', { eager: true });

export function getAllPlayers() {
  return Object.entries(modules).map(([path, mod]) => ({
    component: mod.default,
    name: path.split('/').pop().replace('.svelte','')
  }));
}

export function getPickedPlayer(styleName) {
  //const styleName = get(style);
  if (!styleName) return [];
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${styleName}.svelte`)
  );
  if (!entry) return [];
  const [, mod] = entry;
  return [{ component: mod.default, name: styleName }];
}
