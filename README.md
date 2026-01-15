<p align="center">
  <img width="541" height="183" alt="Снимок экрана 2026-01-15 100101" src="https://github.com/user-attachments/assets/1210ccc5-1d73-416f-ab32-c63790be01fd" />
</p>

---

# 🎵 unik-player

**Музыкальный виджет для OBS, который показывает текущий трек с любого приложения на вашем устройстве**

[![Windows](https://img.shields.io/badge/Platform-Windows-0078D6?style=flat-square&logo=windows)](https://github.com/UNIKNOW0/unik-player)
[![Release](https://img.shields.io/github/v/release/UNIKNOW0/unik-player?style=flat-square&color=green)](https://github.com/UNIKNOW0/unik-player/releases)
[![License](https://img.shields.io/badge/License-WTFPL-blue?style=flat-square)](LICENSE)

---

https://github.com/user-attachments/assets/b2710d57-1137-494b-a54d-e566e40b7385


## ✨ Возможности

- 🎧 **Универсальный захват** — работает с любым музыкальным приложением (Spotify, Яндекс.Музыка, VK Music, браузер и др.)
- 📺 **Интеграция с OBS** — готовый виджет для стримов
- 🎨 **Кастомизация** — настройка внешнего вида под ваш стиль
- ⚡ **Лёгкий** — минимальное потребление ресурсов
- 🔄 **Авто-обновление** — автоматическое определение смены трека

---

## ✨ Вариации плееров

<img width="518" height="172" alt="image" src="https://github.com/user-attachments/assets/0796aa66-2e62-498f-87bb-9860b2715606" />

<img width="518" height="172" alt="image" src="https://github.com/user-attachments/assets/7bb229e4-20f2-4e9f-88cd-b638ea819f47" />

<img width="518" height="172" alt="image" src="https://github.com/user-attachments/assets/002314dc-a1a6-4dff-9c84-42552066fc90" />

<img width="518" height="172" alt="image" src="https://github.com/user-attachments/assets/d167507d-1a90-4387-a5a1-58abad732dc7" />

<img width="518" height="172" alt="image" src="https://github.com/user-attachments/assets/ef7eac36-33c2-48b9-bf4d-e4dcf02ea8c8" />


### Сборка из исходников

```bash
# Клонируйте репозиторий
git clone https://github.com/UNIKNOW0/unik-player.git
cd unik-player

# Установите зависимости backend
cd backend
npm install

# Установите зависимости frontend
cd ../frontend
npm install

# Запустите в режиме разработки
npm run dev
```

---

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| Frontend | Svelte |
| Backend | Node.js |
| Стили | CSS |

---

## 📁 Структура проекта

```
unik-player/
├── backend/        # Серверная часть (Node.js)
├── frontend/       # Клиентская часть (Svelte)
├── frontBuild/     # Собранный фронтенд
└── README.md
```

---

## 📝 Лицензия

This project is open source and available under the [WTFPL](https://www.wtfpl.net/).
