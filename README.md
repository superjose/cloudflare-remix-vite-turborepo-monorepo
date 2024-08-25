# Setup a Monorepo using Cloudflare Pages, Remix, Vite and Turborepo (No Build Step)

A Monorepo using Turborepo, Cloudflare Pages/Workers, Remix.run, Vite and pnpm workspaces.

Follow me on X, and LinkedIn:
[(@javiasilis)](https://twitter.com/javiasilis) [(@javiasilis)](https://www.linkedin.com/in/javiasilis)

# Pre-requisites

1. Nodejs
2. [pnpm](https://pnpm.io/installation)

# How to:

This can also apply to existing repositories!

1. Install Turborepo

```sh
pnpm dlx create-turbo@latest
```

2. Create an empty package.json at the root of the project:

```sh
pnpm init
```

```json
{
  "name": "@repo/main",
  "version": "1.0.0",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

3. Create a `pnpm-workspace.yaml` file in the root of your project

```yaml
packages:
  - "apps/*"
  - "libs/*"
```

This indicates that apps and libs will be used as packages.

4. Create the `turbo.json` file in the root of the project:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "preview": {}
  }
}
```

Note that we define 2 commands, which match the ones in the script section of the package.json of each repository.

5. Create an `apps` folder in the root of the project
6. Create a remix app in the `apps` folder (Or move an existing one)

```sh
npx create-remix --template edmundhung/remix-worker-template
```

Don't install any packages just yet.

But rename the `name` of the package.json to `@repo/my-remix-cloudflare-app`

```json
{
-  "name": "my-remix-cloudflare-app",
+  "name": "@repo/my-remix-cloudflare-app",
  "version": "1.0.0",
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

6. At root copy and paste all the dependencies from `apps/<app>/package.json` to the root `package.json`

As of this writing, these are the dependencies:
package.json

```json
{
  "name": "@repo/main",
  "version": "1.0.0",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@markdoc/markdoc": "^0.4.0",
    "@remix-run/cloudflare": "^2.8.1",
    "@remix-run/cloudflare-pages": "^2.8.1",
    "@remix-run/react": "^2.8.1",
    "isbot": "^3.6.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240222.0",
    "@octokit/types": "^12.6.0",
    "@playwright/test": "^1.42.1",
    "@remix-run/dev": "^2.8.1",
    "@remix-run/eslint-config": "^2.8.1",
    "@tailwindcss/typography": "^0.5.10",
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "autoprefixer": "^10.4.18",
    "concurrently": "^8.2.2",
    "cross-env": "^7.0.3",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "msw": "^2.2.3",
    "postcss": "^8.4.35",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.12",
    "rimraf": "^5.0.5",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.5",
    "vite-tsconfig-paths": "^4.3.1",
    "wrangler": "^3.32.0"
  }
}
```

7. Add turbo as a devDependency at the root level (This will install all the remix's packages).

```
pnpm add turbo -D -w
```

The `-w` flag tells pnpm to install it at the workspace root

8. Add the dev command to the root package.json, and the `packageManager` option

```json
{
  "name": "@repo/main",
  "version": "1.0.0",
  "scripts": {
    "dev": "turbo dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@9.1.0",
  "dependencies": {
    // omitted for brevity
  },
  "devDependencies": {
    // omitted for brevity
  }
}
```

9. Add the `packa

10. Run `pnpm dev` to start the development server.

Verify that everything is working.

11. Let's add some libs to the project. Create a libs folder in the root of the project.

12. Add a config, db, and utils directories lib to the libs directory.

```sh
mkdir -p libs/config libs/db libs/utils
```

13. And then add a src directory to each of the directories. Plus an index.ts file that will export all the files from the repository.

```sh
touch libs/config/src/index.ts libs/db/src/index.ts libs/utils/src/index.ts
```

Add an empty `package.json` file to each of the directories.

```sh
touch libs/config/package.json libs/db/package.json libs/utils/package.json
```

14. Add the following to the `libs/config/package.json` file:

```json
{
  "name": "@repo/config",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

15. Add the following to the `libs/db/package.json` file:

```json
{
  "name": "@repo/db",
  "version": "1.0.0",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

16. Add the following to the `libs/utils/package.json` file:

```json
{
  "name": "@repo/utils",
  "version": "1.0.0",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

We need to specify the "exports" field in the package.json file to tell the other repositories where to import the package from.

We also have specified the "name" of the package. This is used to:

1. Import the package in other repositories.
2. Tell pnpm which repository to add.

3. Now let's add a dependency to the db lib. We will use drizzle and postgres. (TBH, I've begun disliking ORMs altogether, but for the sake of this tutorial, we will use it).

```sh
pnpm add drizzle-orm drizle-kit postgres --filter=@repo/db
```

Note:

- The `--filter=@repo/db` flag tells pnpm to add the package to the db repository.

Let's also add the dotenv to all the repositories except the config

```sh
pnpm add dotenv -r --filter=!@repo/config
```

Note:

- The `-r` flag tells pnpm to add the package to all the repositories.
- The `--filter=!` flag tells pnpm to exclude the config repository.
  (Note the `!` before the package name)

Let's add the config project to all the project.

```sh
pnpm add @repo/config -r --filter=!@repo/config
```

4. Now let's add the db connection to the db repository.

```ts
// libs/db/drizzle.config.ts
import "dotenv/config"; // make sure to install dotenv package
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./src/generated",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
```

The schema file:

```ts
// libs/db/src/drizzle/schema.ts
export const User = pgTable("User", {
  userId: char("userId", { length: 26 }).primaryKey().notNull(),
  subId: char("subId", { length: 36 }).notNull(),
  // We are not making this unique to support merging accounts in later
  // iterations
  email: text("email"),
  loginProvider: loginProviderEnum("loginProvider").array().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});
```

The client file:

```ts
// libs/db/src/client.ts
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DrizzleClient = PostgresJsDatabase<typeof schema>;

let drizzleClient: DrizzleClient | undefined;

type GetClientInput = {
  databaseUrl: string;
  env: string;
  mode?: "cloudflare" | "node";
};

declare var window: typeof globalThis;
declare var self: typeof globalThis;

export function getDrizzleClient(input: GetClientInput) {
  const { mode, env } = input;

  if (mode === "cloudflare") {
    return generateClient(input);
  }

  const globalObject =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof global !== "undefined"
        ? global
        : typeof window !== "undefined"
          ? window
          : self;

  if (env === "production") {
    drizzleClient = generateClient(input);
  } else if (globalObject) {
    if (!(globalObject as any).__db__) {
      (globalObject as any).__db__ = generateClient(input);
    }
    drizzleClient = (globalObject as any).__db__;
  } else {
    drizzleClient = generateClient(input);
  }

  return drizzleClient;
}
type GenerateClientInput = {
  databaseUrl: string;
  env: string;
};
function generateClient(input: GenerateClientInput) {
  const { databaseUrl, env } = input;
  const isLoggingEnabled = env === "development";
  // prepare: false for serverless
  try {
    const client = postgres(databaseUrl, { prepare: false });
    const db = drizzle(client, { schema, logger: isLoggingEnabled });
    return db;
  } catch (e) {
    console.log("ERROR", e);
    return undefined!;
  }
}
```

We then add those exports to the src/index.ts file

```ts
// libs/db/src/index.ts
export * from "./client";
export * from "./drizzle.config";
export * from "./schema";
```

We then add the libs/db as dependency to our remix project:

From the root of the project, run:

```sh
pnpm add @repo/db --filter=@repo/my-remix-cloudflare-app
```

If this doesn't work, then go to the `apps/my-remix-cloudflare-app`'s package.json and add the dependency manually.

```json
{
  "name": "@repo/my-remix-cloudflare-app",
  "version": "1.0.0",
  "dependencies": {
    "@repo/db": "workspace:*"
  }
}
```

Note the `workspace:*` in the version field. This tells pnpm to use the package in the workspace.

If you did add this manually, then run `pnpm install` from the root of the project.

And now we're almost ready to consume them in our remix project.

Before that let's add code to our utils.

Add this code to the `libs/utils/src/index.ts` file:

```ts
// libs/utils/src/index.ts
export function hellowWorld() {
  return "Hello World!";
}
```

Do the same and add:

```sh
pnpm add @repo/db --filter=@repo/my-remix-cloudflare-app
```

## Advanced Case - GetLoadContext in Cloudflare Workers.

In my projects, I tend to implement a [CQRS pattern](https://martinfowler.com/bliki/CQRS.html?ref=blog.funda.nl), [2](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs). This is outside of the scope of this tutorial.

Nonetheless, within the load context I tend to inject a mediator that will decouple my entire Remix Application from my business logic. This means that I can strip out Remix or use another consumer without having to alter my code.

There is an additional challenge when you work in a monorepo structure using turborepo.

If you import a TypeScript file from a package, let's say `@repo/db` Vite will return an error that the file with extension `.ts` is unknown, and will not know how to process it.

The trick is to use `tsx` and load it _before_ calling vite, and it will work.

Pre-building the libraries won't work as there are packages such as postgres which have specific imports for Cloudflare. That's why it's better to let Vite handle that process.

Now we need to include tsx as a dependency:

```sh
pnpm add tsx -D --filter=@repo/my-remix-cloudflare-app
```

And then we need to modify our `package.json` and add the tsx process to each one of our remix scripts:

```json
{
  "name": "@repo/my-remix-cloudflare-app",
  "version": "1.0.0",
  "scripts": {
    // Other scripts omitted
    "build": "NODE_OPTIONS=\"--import  tsx/esm\" remix vite:build",
    "dev": "NODE_OPTIONS=\"--import tsx/esm\" remix vite:dev",
    "start": "NODE_OPTIONS=\"--import tsx/esm\" wrangler pages dev ./build/client"
  }
}
```

## (Optional) Docker Compose:

We define a docker-compose so we can launch a postgres image locally

```yaml
# Auto-generated docker-compose.yml file.
# See https://gowebly.org for more information.

version: "3.8"

# Define services.
services:
  # Service for the 'echo' Go backend.
  postgres:
    image: postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "8500:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@a.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

# Executing the project:

Launch the postgres instance

```sh
docker-compose up -d
```

Launch the project

```sh
pnpm turbo dev
```

Remember to rename the `.dev.vars.example` to `.dev.vars` and add the `DATABASE_URL` variable.

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

## Extras

### Creating a `.npmrc` file

In case you're having issues while adding your local packages with the command line, you can create a `.npmrc` file in the root of the project.

.npmrc

```sh
link-workspace-packages= true
prefer-workspace-packages=true
```

This will tell pnpm to use the workspace packages first.

Thanks to [ZoWnx](https://www.reddit.com/r/node/comments/1db000r/comment/lczvggw/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) from Reddit who helped me craft a .nprmc file

## Pitfalls

1. Careful on naming `.client` and `.server` in your files. Even if it's in a separate library. Remix uses these to determine if it's a client or server file.

And as the project isn't compiled per repository, it will throw an import error.
