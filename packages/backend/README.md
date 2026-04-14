# `@samchon/shopping-backend`
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/shopping/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@samchon/shopping-api.svg)](https://www.npmjs.com/package/@samchon/shopping-api)
[![Guide Documents](https://img.shields.io/badge/guide-documents-forestgreen)](https://nestia.io/docs/)

Backend package of the [`@samchon/shopping`](https://github.com/samchon/shopping) monorepo.

`@samchon/shopping-backend` is an example project of [NestJS](https://nestjs.com) and [Prisma](https://prisma.io) stack, developed to educate how to adapt **functional programming** in NestJS development. It is not an actual e-commerce service — implementation of most functions is different from a real shopping mall.

Also, this project guides how to utilize below libraries in production, and demonstrates how they boost productivity. Especially, it ideally implements **TDD (Test Driven Development)** through them.

- [typia](https://github.com/samchon/typia): Superfast runtime validator
- [nestia](https://github.com/samchon/nestia): NestJS helper libraries like SDK generation
- [prisma-markdown](https://github.com/samchon/prisma-markdown): Markdown generator of Prisma, including ERD and descriptions

For the quickest start with Docker Compose, see the [root README](../../README.md).

## 1. Manual Setup
### 1.1. NodeJS
This backend server runs on NodeJS with TypeScript.

- https://nodejs.org/en/

### 1.2. PostgreSQL
> ```bash
> docker pull postgis/postgis:16-3.4
> docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=root -d postgis/postgis:16-3.4
> ```
>
> If you have Docker, run the commands above.

Otherwise, install PostgreSQL manually from the official site:

- https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

After PostgreSQL is running, create the database schema and seed data with `pnpm schema`. Default root credentials are `postgres` / `root`.

```bash
# from the monorepo root
pnpm install

cd packages/backend
pnpm schema
```

### 1.3. Start
```bash
pnpm start:ts
```

The server listens on `http://127.0.0.1:37001` by default. All configuration lives in `.env.local` and is copied to `.env` automatically on first run.

## 2. Development
> - A. Definition only
>   - Design prisma schema file
>   - Build and share ERD document with your companions
>   - Write DTO structures
>   - Declare controller method only
> - B. Software Development Kit
>   - Build SDK from the declaration-only controller files
>   - SDK supports mockup simulator, boosting up frontend development
> - C. Test Automation Program
>   - Build test program earlier than main program development
>   - Utilize SDK library in the test program development
>   - This is the TDD (Test Driven Development)
> - D. Main Program Development

### 2.1. Definition
Before developing the main program, define it first.

Design the DB architecture on the Prisma Schema files ([prisma/schema](prisma/schema)). Don't forget to write detailed descriptions on each table and property. After that, build the ERD document through `pnpm build:prisma`. The ERD document will be generated at [docs/ERD.md](docs/ERD.md).

Then write DTO structures under [src/api/structures](src/api/structures) and declare API endpoint specs under [src/controllers](src/controllers). Note that, do not implement the function body of the controller — just write declaration only:

```typescript
@Controller("bbs/articles")
export class BbsArticleController {
  @TypedRoute.Patch()
  public async index(
    @TypedBody() input: IBbsArticle.IRequest
  ): Promise<IPage<IBbsArticle.ISummary>> {
    return null!;
  }
}
```

### 2.2. Software Development Kit
This project generates an SDK (`@samchon/shopping-api`) into [`packages/api`](../api) via [nestia](https://github.com/samchon/nestia). The SDK provides typed `fetch` functions with auto-completion and type hints, boosting client development.

Furthermore, the SDK supports [Mockup Simulator](https://nestia.io/docs/sdk/simulator/). If `simulate` option is `true`, the SDK will not send HTTP requests but simulate API endpoints locally — so frontend developers can start immediately, even before the main program is ready.

```bash
pnpm build:sdk    # regenerate SDK into packages/api/src
```

### 2.3. Test Automation Program
> TDD (Test Driven Development)

After definition and SDK generation, design use-case scenarios and implement test automation under [test/features](test/features).

Note that, the test program resets the local DB schema whenever being run. To avoid resetting, use the `reset` option.

```bash
# test without db reset
pnpm test -- --reset false

# include or exclude some features
pnpm test -- --include cart order issue
pnpm test -- --include cart order issue --exclude index deposit

# run performance benchmark program
pnpm run benchmark:performance
```

### 2.4. Main Program
After all preparations, implement the main program. Do not write source code only in controller classes — controllers must only intermediate. Write main logic separately: DB I/O goes into [src/providers](src/providers).

## 3. Entity Relationship Diagram
![ERD](https://github-production-user-asset-6210df.s3.amazonaws.com/13158709/268175441-80ca9c8e-4c96-4deb-a8cb-674e9845ebf6.png)

[`docs/ERD.md`](docs/ERD.md) — generated by [prisma-markdown](https://github.com/samchon/prisma-markdown)

## 4. Commands
```bash
pnpm build            # prisma generate + SDK codegen + tsc
pnpm start            # start compiled server (lib/)
pnpm start:ts         # start via ts-node (src/)
pnpm schema           # create DB schema and seed data
pnpm test             # run E2E tests (requires PostgreSQL)
pnpm build:swagger    # regenerate swagger.json
```

## 5. Directories
- [**prisma/schema**](prisma/schema): Prisma Schema files
- [**docs/**](docs/): Documents like ERD
- [src/controllers/](src/controllers/): Controller classes
- [src/providers/](src/providers/): Service providers (bridge between DB and controllers)
- [src/executable/](src/executable/): Executable programs (`server.ts`, `schema.ts`)
- [**test/**](test/): Test Automation Program
