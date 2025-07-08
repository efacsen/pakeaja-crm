# psql Connection Information

## Why I Cannot Run psql Directly

I cannot execute psql commands to your Supabase database because:

1. **Security**: Your database password is private and should never be shared
2. **No Direct Access**: I don't have network access to external databases
3. **Authentication Required**: Supabase requires authentication that I cannot provide

## How to Get Your Connection String

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings (gear icon)
4. Click "Database" in the sidebar
5. Find "Connection string" section
6. Copy the URI (it includes your password)

## Connection String Format

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Where:
- `[YOUR-PASSWORD]` = Your database password
- `[PROJECT-REF]` = Your unique project reference (like "xyzabc123")

## Running the Migration

### Option 1: Use the Provided Script
```bash
cd "RBAC Migration"
./run-migration-complete.sh
# Enter your connection string when prompted
```

### Option 2: Manual psql
```bash
# Connect
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migration
\i ../supabase/migrations/20250108_master_rbac_migration.sql

# Exit
\q
```

### Option 3: Supabase Dashboard (No psql needed)
See `SUPABASE_DASHBOARD_GUIDE.md` for visual instructions

## Security Tips

1. **Never commit** your connection string to git
2. **Use environment variables** for production
3. **Rotate passwords** regularly
4. **Use SSL connections** (Supabase enforces this)

## Troubleshooting psql Installation

### macOS
```bash
brew install postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

### Windows
Download from [PostgreSQL official site](https://www.postgresql.org/download/windows/)

### Verify Installation
```bash
psql --version
```

## Alternative: No psql Required

If you don't want to install psql, use the Supabase Dashboard SQL Editor - it's just as effective and doesn't require any local tools.