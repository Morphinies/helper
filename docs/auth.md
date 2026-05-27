# Авторизация

В проекте используется `next-auth` с route handler для App Router:
`src/app/api/auth/[...nextauth]/route.ts`.

Настройки авторизации находятся в `src/shared/lib/auth/options.ts`:

- Пользователи сохраняются в PostgreSQL через Prisma Adapter.
- Стратегия сессии - JWT.
- Для локального входа используется `CredentialsProvider`.
- Для зарегистрированных пользователей вход выполняется по email и паролю.
- Локальная авторизация включена в development-режиме или при наличии
  `LOCAL_AUTH_ENABLED`.
- Логин и пароль по умолчанию: `admin / admin`.
- Локальные логин и пароль можно переопределить через `LOCAL_AUTH_LOGIN` и
  `LOCAL_AUTH_PASSWORD`.
- При успешном локальном входе пользователь создаётся или обновляется в таблице
  `User`.
- При регистрации пароль хранится только в виде PBKDF2 hash в `User.passwordHash`.
- В `session.user.id` прокидывается стабильный id пользователя из БД.
- `VkProvider` настроен, но кнопка входа через VK сейчас отключена в UI.

## Регистрация

Регистрация находится на той же странице, что и вход:
`src/app/[locale]/(auth)/login/page.tsx`.

UI регистрации реализован в `src/features/auth/ui/Login.tsx`:

- пользователь переключается с формы входа на регистрацию текстовой ссылкой
  под кнопкой;
- регистрация запрашивает email, пароль и подтверждение пароля;
- после отправки формы вызывается `POST /api/auth/register/request-code`;
- пользователь вводит код подтверждения без перехода на отдельную страницу;
- после подтверждения вызывается `POST /api/auth/register/confirm`;
- после успешного подтверждения выполняется автоматический вход через
  `signIn("credentials")`.

Server-side логика регистрации находится в
`src/features/auth/server/registration.ts`.

Для подтверждения email используется таблица `RegistrationVerification`:

- `email` - нормализованный email пользователя;
- `passwordHash` - hash пароля до завершения регистрации;
- `codeHash` - hash одноразового кода;
- `attempts` - количество неуспешных попыток;
- `expiresAt` - срок действия кода.

Код действует 10 минут. После успешного подтверждения создаётся `User` с
`emailVerified`, а pending-запись удаляется.

## Почта

Отправка писем находится в `src/shared/lib/mail/sendMail.ts` и использует
`nodemailer`.

Для реальной отправки нужно задать SMTP-переменные окружения:

```env
SMTP_HOST=""
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""
```

Если `SMTP_HOST` или `SMTP_FROM` не заданы, письмо не отправляется наружу, а код
выводится в server log через dev fallback. Это нужно только для локальной
разработки.

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
  `UnauthorizedError`; этот helper используется BFF route handlers перед
  доступом к пользовательским данным.

Страница входа находится в auth route group:

- `src/app/[locale]/(auth)/login/page.tsx`
- Страница проверяет текущую сессию на сервере.
- Авторизованные пользователи перенаправляются на главную страницу текущей
  локали.
- Неавторизованные пользователи видят форму входа по логину и паролю.
- В этой же форме можно переключиться на регистрацию и подтверждение email.
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
