# Авторизация

В проекте используется `next-auth` с route handler для App Router:
`src/app/api/auth/[...nextauth]/route.ts`.

Настройки авторизации находятся в `src/shared/lib/auth/options.ts`:

- Пользователи сохраняются в PostgreSQL через Prisma Adapter.
- Стратегия сессии - JWT.
- Для локального входа используется `CredentialsProvider`.
- Локальная авторизация включена в development-режиме или при наличии
  `LOCAL_AUTH_ENABLED`.
- Логин и пароль по умолчанию: `admin / admin`.
- Локальные логин и пароль можно переопределить через `LOCAL_AUTH_LOGIN` и
  `LOCAL_AUTH_PASSWORD`.
- При успешном локальном входе пользователь создаётся или обновляется в таблице
  `User`.
- В `session.user.id` прокидывается стабильный id пользователя из БД.
- `VkProvider` настроен, но кнопка входа через VK сейчас отключена в UI.

Корневой locale layout подключает `SessionProvider` через
`src/app/providers/index.tsx`, поэтому в клиентских компонентах доступны
`useSession`, `signIn` и `signOut`.

Защита страниц выполняется на сервере в `PageWrapper`:

- `PageWrapper` вызывает `getCurrentUser()` из
  `src/shared/lib/auth/session.ts`.
- Если сессии нет, пользователь перенаправляется на `/login` для дефолтной
  локали или на `/{locale}/login` для остальных локалей.
- Если сессия есть, загружаются сообщения страницы и страница рендерится.

Server-side helpers авторизации находятся в `src/shared/lib/auth/session.ts`:

- `getAuthSession()` возвращает raw `next-auth` session.
- `getCurrentUser()` возвращает текущего пользователя с `id` или `null`.
- `requireCurrentUser()` возвращает пользователя или бросает
  `UnauthorizedError`; этот helper предназначен для будущего BFF-слоя.

Страница входа находится в auth route group:

- `src/app/[locale]/(auth)/login/page.tsx`
- Страница проверяет текущую сессию на сервере.
- Авторизованные пользователи перенаправляются на главную страницу текущей
  локали.
- Неавторизованные пользователи видят форму входа по логину и паролю.
- Auth-страницы используют отдельный layout и не рендерят основной header.

Обычные страницы приложения находятся в app route group:

- `src/app/[locale]/(app)/page.tsx`
- `src/app/[locale]/(app)/tasks/page.tsx`
- Они используют общий `Layout` с header и кнопкой авторизации.

UI авторизации находится в `src/features/auth`:

- `AuthButton` используется в основном `Layout`.
- `Login` используется на странице `/login`.

Поведение `AuthButton` реализовано на клиенте:

- Пока сессия загружается, отображается кнопка в состоянии loading.
- Для авторизованного пользователя открывается окно подтверждения перед
  `signOut`.
- Для неавторизованного пользователя выполняется переход на `/login` через
  локализованный router.
