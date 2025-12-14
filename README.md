# Web Messenger

Учебный веб‑мессенджер с **клиент‑серверной архитектурой**: бэкенд (Node.js + Express) и фронтенд. Общение идёт по **REST API** поверх **HTTPS** (самоподписанный сертификат). Есть **регистрация/логин**, **JWT‑авторизация** и **персонализация**.

- **Клиент‑серверная архитектура**: отдельный сервер (backend) и клиент.
- **Бэкенд + фронтенд**: бэкенд в `backend/`, фронтенд‑часть — в `backend/public/` + отдельная заготовка фронтенда в `frontend/`.
- **REST API**: все операции (auth/messages) сделаны через HTTP‑эндпоинты `/api/...`.
- **HTTPS**: сервер поднимается через `https.createServer` с self‑signed сертификатом (`backend/certs`).
- **Аутентификация/авторизация + персонализация**: регистрация/логин, пароли хешируются `bcrypt`, доступ к защищённым эндпоинтам через JWT (Bearer). Персонализация: `/api/auth/me`, `/api/messages/mine`.
- **Хранение данных на бэкенде**: реализовано в `backend/data/db.json` (полноценная СУБД — опционально).

## Что реализовано

### Backend (Node.js + Express, HTTPS)

- Аутентификация: `POST /api/auth/register`, `POST /api/auth/login`
- Авторизация: JWT в заголовке `Authorization: Bearer <token>`
- Персонализация: `GET /api/auth/me`, `GET /api/messages/mine`
- Сообщения: `GET /api/messages`, `POST /api/messages`
- Вспомогательное: `GET /app/ping`, `POST /api/echo`

### Хранилище (JSON)

Данные хранятся в `backend/data/db.json`:

- `users`: `{ id, login, passwordHash }`
- `messages`: `{ id, content, createdAt, user: { id, login } }`

### Frontend

- **UI** для демонстрации/тестов (без консоли): `https://localhost:3001/ui` (`backend/public/*`).
- **Nuxt‑фронтенд** в `frontend/` (заготовка/в разработке).

## Структура проекта (основное)

```text
web-messenger/
  backend/
    certs/              # self-signed сертификат (key.pem/cert.pem)
    data/               # db.json (локальное хранилище)
    public/             # минимальный UI (/ui)
    index.js            # HTTPS + REST API
  frontend/             # Nuxt (заготовка)
  README.md
```

## Быстрый старт (backend + UI)

### 1) Установка зависимостей

```bash
cd backend
npm install
```

### 2) Конфиг `.env`

Создай файл `backend/.env`:

```env
PORT=3001
JWT_SECRET=change_me_to_random_string
```

### 3) Запуск

```bash
node index.js
```
Открой:
- `https://localhost:3001/ui` — минимальный интерфейс

Если браузер ругается на сертификат, нужно подтвердить исключение/доверие.

## REST API

### Auth

- `POST /api/auth/register` `{ login, password }` → `{ id, login, token }`
- `POST /api/auth/login` `{ login, password }` → `{ id, login, token }`
- `GET /api/auth/me` (Bearer) → `{ id, login }`

### Messages (Bearer)

- `GET /api/messages` → все сообщения
- `GET /api/messages/mine` → только сообщения текущего пользователя
- `POST /api/messages` `{ content }` → созданное сообщение

## Планы и задачи

### Backend

- Валидация данных (login/password/content), единый формат ошибок.
- Безопасность: ограничение частоты запросов (rate‑limit), более аккуратные статусы (401/403), “logout”/refresh‑tokens (опционально).
- Рефакторинг: вынести роуты/сервисы в отдельные файлы, убрать учебные эндпоинты (`/api/echo`) при необходимости.
- Реал‑тайм обновления: WebSocket/Socket.io.
- (Опционально) Реальная СУБД: SQLite/PostgreSQL.

### Frontend

- Доделать приложение в `frontend/` (Nuxt): экран логина/регистрации, чат, список сообщений, “мои сообщения”.
- Настроить работу по HTTPS (или прокси), чтобы соответствовать требованиям при отдельном запуске фронта.
- (Опционально) Стилизация, валидация форм, хранение токена, обработка ошибок.

## Авторы

- Огарышев Павел Олегович
- Лепиев Абдул‑Малик Саламбекович
