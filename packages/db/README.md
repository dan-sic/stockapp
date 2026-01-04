# Database Migrations with Drizzle

This project uses Drizzle ORM for database migrations.

## Migration Workflow

### 1. Generate a Migration

After making changes to [schema.ts](schema.ts), generate a migration file:

```bash
npm run db:generate
```

This will:
- Analyze your schema changes
- Create a new SQL migration file in `db/migrations/`
- Drizzle will prompt you to describe the changes

### 2. Run Migrations

Apply pending migrations to your database:

```bash
npm run db:migrate
```

This executes all pending migrations in the `db/migrations/` folder.

### 3. Drizzle Studio (Optional)

Launch the Drizzle Studio GUI to browse and edit your database:

```bash
npm run db:studio
```

## Example Workflow

1. Edit [schema.ts](schema.ts) to add/modify tables or columns
2. Run `npm run db:generate` to create migration files
3. Review the generated SQL in `db/migrations/`
4. Run `npm run db:migrate` to apply changes to your database

## Configuration

The migration setup uses:
- [drizzle.config.ts](drizzle.config.ts) - Drizzle Kit configuration
- [migrate.ts](migrate.ts) - Migration runner script
- `DATABASE_URL` - Environment variable for database connection

## Important Notes

- Always review generated migration files before running them
- Migration files are stored in `db/migrations/` and should be committed to version control
- The migrate script will automatically run all pending migrations in order
