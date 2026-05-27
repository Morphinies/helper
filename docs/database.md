# База данных

Проект использует PostgreSQL и Prisma.

Документ описывает текущее состояние подключения. По мере добавления схемы,
миграций и BFF-слоя его нужно расширять.

## Текущее состояние

- ORM: Prisma.
- БД: PostgreSQL.
- Prisma config: `prisma.config.ts`.
- Prisma schema: `prisma/schema.prisma`.
- DB client: `src/shared/lib/db`.
- URL подключения берётся из `DATABASE_URL`.
- Prisma Client генерируется в `src/generated/prisma`.
- Сгенерированный client не хранится в git и пересоздаётся командой
  `npm run db:generate`.

Сейчас в схеме есть models для авторизации, задач и привычек:

- `User`;
- `Account`;
- `Session`;
- `VerificationToken`.
- `RegistrationVerification`;
- `Task`.
- `Habit`;
- `HabitCompletion`.

## DB client

Серверный Prisma Client экспортируется из `src/shared/lib/db`:

```ts
import { prisma } from "@/shared/lib/db";
```

Модуль помечен через `import "server-only"`, поэтому его нельзя импортировать в
Client Components.

В development-режиме используется singleton через `globalThis`, чтобы при
пересборках Next.js не создавать лишние подключения к БД.

## Переменные окружения

Локально нужен `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/helper"
```

Пример переменных находится в `.env.example`.

## Команды

Проверить Prisma schema:

```bash
npm run db:validate
```

Сгенерировать Prisma Client:

```bash
npm run db:generate
```

Запустить dev-миграцию:

```bash
npm run db:migrate:dev
```

`prisma migrate dev` использует shadow database. Для этой команды пользователь
PostgreSQL должен иметь право `CREATE DATABASE`, либо нужно настроить отдельный
`SHADOW_DATABASE_URL`.

Для локальной разработки роль из `DATABASE_URL` должна иметь право `CREATEDB`.
Например:

```sql
ALTER ROLE helper_user CREATEDB;
```

Открыть Prisma Studio:

```bash
npm run db:studio
```

## Проверка подключения

Для проверки реального подключения к PostgreSQL можно выполнить:

```bash
npm.cmd exec prisma -- db pull --print
```

Если база пустая, Prisma вернёт `P4001 The introspected database was empty`.
Это означает, что подключение работает, но в базе пока нет таблиц.

Ошибки подключения обычно выглядят иначе:

- `P1000` - неверные credentials;
- `P1001` - сервер БД недоступен;
- `P1003` - база не существует.
- `P3014` - Prisma не смогла создать shadow database для `migrate dev`.

## Миграции

Первая миграция:

- `prisma/migrations/20260525232246_init_user/migration.sql`
- создаёт таблицу `User`;
- создаёт уникальный индекс `User_email_key`.

Вторая миграция:

- `prisma/migrations/20260526173734_add_nextauth_adapter_models/migration.sql`
- создаёт таблицы `Account`, `Session`, `VerificationToken`;
- добавляет связи `Account.userId -> User.id` и `Session.userId -> User.id`;
- добавляет уникальные индексы, которые нужны Prisma Adapter для `next-auth`.

Третья миграция:

- `prisma/migrations/20260526181820_add_task_model/migration.sql`
- создаёт enum `TaskStatus`;
- создаёт таблицу `Task`;
- добавляет связь `Task.userId -> User.id`;
- добавляет индексы `Task_userId_order_idx` и `Task_userId_status_idx`.

Четвёртая миграция:

- `prisma/migrations/20260526192311_add_habit_models/migration.sql`
- создаёт enum `HabitRecurrence`;
- создаёт таблицы `Habit` и `HabitCompletion`;
- добавляет связи `Habit.userId -> User.id`,
  `HabitCompletion.habitId -> Habit.id` и
  `HabitCompletion.userId -> User.id`;
- добавляет уникальность `HabitCompletion_habitId_date_key`;
- добавляет индексы по пользователю и датам привычек/completions.

Пятая миграция:

- `prisma/migrations/20260527182933_add_email_registration/migration.sql`
- добавляет поле `User.passwordHash`;
- создаёт таблицу `RegistrationVerification`;
- добавляет уникальность `RegistrationVerification_email_key`;
- добавляет индекс `RegistrationVerification_expiresAt_idx`.

Статус миграций можно проверить командой:

```bash
npm.cmd exec prisma -- migrate status
```

Новые dev-миграции запускаются командой:

```bash
npm run db:migrate:dev
```

## Правила

- Клиентские компоненты не должны импортировать Prisma Client или DB helpers.
- Доступ к БД должен выполняться только на сервере.
- BFF-слой должен проверять авторизацию перед каждым запросом к данным
  пользователя.
- Все запросы к пользовательским данным должны фильтроваться по `userId`.

## Server repositories

Server-only операции находятся рядом с соответствующими entities:

- задачи: `src/entities/task/server/repository.ts`;
- привычки: `src/entities/habit/server/repository.ts`.

Repository:

- импортирует `prisma` только на сервере;
- не экспортируется из client-facing barrel `src/entities/task/index.ts`;
- принимает `userId` во всех операциях;
- фильтрует все операции по `userId`;
- преобразует `deadline` между строкой `YYYY-MM-DD` в доменном типе и
  PostgreSQL `DATE`;
- преобразует `startDate` и `completion.date` привычек между строкой
  `YYYY-MM-DD` в доменном типе и PostgreSQL `DATE`;
- содержит серверную логику выборки привычек, видимых на выбранную дату.

## BFF endpoints

Route handlers находятся в `src/app/api/tasks` и `src/app/api/habits`.

Доступные endpoints:

- `GET /api/tasks` - список задач текущего пользователя.
- `POST /api/tasks` - создать задачу.
- `PATCH /api/tasks/{id}` - обновить задачу.
- `DELETE /api/tasks/{id}` - удалить задачу.
- `POST /api/tasks/{id}/toggle` - переключить задачу между `done` и `todo`.
- `PATCH /api/tasks/{id}/move` - изменить статус и порядок задачи.
- `GET /api/habits?date=YYYY-MM-DD` - список привычек, видимых привычек и
  отметок выполнения на дату.
- `POST /api/habits` - создать привычку.
- `PATCH /api/habits/{id}` - обновить привычку.
- `DELETE /api/habits/{id}` - удалить привычку.
- `POST /api/habits/{id}/completion` - переключить отметку выполнения
  привычки на дату.

Каждый endpoint:

- получает пользователя через `requireCurrentUser()`;
- возвращает `401`, если пользователь не авторизован;
- валидирует входной JSON;
- работает только с данными текущего `userId`.

## Client data

Клиентские hooks `src/entities/task/model/useTasks.ts` и
`src/entities/habit/model/useHabits.ts` больше не используют `localStorage`.

Для задач используется React Query:

- `GET /api/tasks` загружает список;
- mutations вызывают BFF endpoints;
- после mutations query инвалидируется;
- для перемещения задач используется optimistic update, чтобы drag/drop не
  ощущался медленным.

Для привычек используется React Query:

- `GET /api/habits?date=YYYY-MM-DD` загружает список привычек, видимые на дату
  привычки и completions;
- mutations вызывают BFF endpoints;
- после mutations query инвалидируется;
- completion текущей даты обновляется в query cache сразу после успешного
  ответа API.
