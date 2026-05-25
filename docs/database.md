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

Сейчас схема ещё не содержит models. Таблицы пользователей, задач и привычек
будут добавляться отдельными этапами.

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

## Правила

- Клиентские компоненты не должны импортировать Prisma Client или DB helpers.
- Доступ к БД должен выполняться только на сервере.
- BFF-слой должен проверять авторизацию перед каждым запросом к данным
  пользователя.
- Все запросы к пользовательским данным должны фильтроваться по `userId`.
