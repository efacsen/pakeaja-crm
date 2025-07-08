#!/bin/bash

# Complete RBAC Migration Script for PakeAja CRM
# This script runs all necessary migrations in the correct order

set -e  # Exit on error

echo "================================================"
echo "PakeAja CRM - Complete RBAC Migration Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Error: psql is not installed.${NC}"
    echo "Please install PostgreSQL client tools first."
    echo ""
    echo "On macOS: brew install postgresql"
    echo "On Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Function to run SQL and check result
run_sql() {
    local sql_file=$1
    local description=$2
    
    echo -e "${YELLOW}🔄 ${description}...${NC}"
    
    if psql "$DB_URL" < "$sql_file" > /tmp/migration_output.log 2>&1; then
        echo -e "${GREEN}✅ ${description} completed successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ ${description} failed!${NC}"
        echo "Error details:"
        cat /tmp/migration_output.log
        return 1
    fi
}

# Get database connection string
echo "Please enter your Supabase database connection string:"
echo "(You can find this in Supabase Dashboard > Settings > Database)"
echo ""
echo "It should look like:"
echo "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
echo ""
read -s -p "Connection string: " DB_URL
echo ""
echo ""

# Validate connection string
if [[ ! "$DB_URL" =~ ^postgresql:// ]]; then
    echo -e "${RED}❌ Error: Invalid connection string.${NC}"
    exit 1
fi

echo "🔄 Testing database connection..."

# Test connection
if psql "$DB_URL" -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ Connected successfully!${NC}"
else
    echo -e "${RED}❌ Error: Could not connect to database.${NC}"
    echo "Please check your connection string and try again."
    exit 1
fi

echo ""
echo "This migration will:"
echo "  1. Create RBAC tables and permissions"
echo "  2. Convert existing roles to new system"
echo "  3. Update akevinzakaria@cepatservicestation.com to admin role"
echo "  4. Set up all permission structures"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

# Check current state
echo -e "${YELLOW}🔍 Checking current database state...${NC}"
psql "$DB_URL" -c "SELECT COUNT(*) as user_count FROM profiles;" 2>/dev/null || true
echo ""

# Run master migration
MIGRATION_FILE="../supabase/migrations/20250108_master_rbac_migration.sql"

if [ -f "$MIGRATION_FILE" ]; then
    if run_sql "$MIGRATION_FILE" "Running master RBAC migration"; then
        echo ""
        echo -e "${GREEN}🎉 RBAC migration completed successfully!${NC}"
        echo ""
        
        # Verify admin role
        echo -e "${YELLOW}🔍 Verifying your admin role...${NC}"
        echo ""
        
        psql "$DB_URL" << EOF
-- Check user role
SELECT 
    email, 
    role::text as role, 
    department, 
    position,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin access granted!'
        ELSE '❌ Admin access NOT granted - please check'
    END as status
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Count permissions
SELECT 
    'Total admin permissions: ' || COUNT(*) as permission_summary
FROM permissions 
WHERE role = 'admin';
EOF
        
        echo ""
        echo -e "${GREEN}✅ Migration complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Log out and log back in to refresh your session"
        echo "2. Visit /dashboard/profile to see your admin role"
        echo "3. Visit /dashboard/users to manage other users"
        echo ""
        
        # Save migration log
        echo "Migration completed at $(date)" > migration_success.log
        
    else
        echo ""
        echo -e "${RED}❌ Migration failed!${NC}"
        echo ""
        echo "Common issues and solutions:"
        echo ""
        echo "1. Type already exists error:"
        echo "   Run: psql \"$DB_URL\" -c \"DROP TYPE IF EXISTS user_role CASCADE;\""
        echo ""
        echo "2. Permission denied:"
        echo "   Ensure your database user has CREATE privileges"
        echo ""
        echo "3. Table already exists:"
        echo "   The migration may have partially completed. Check your database."
        echo ""
        
        # Option to drop and retry
        read -p "Would you like to drop existing types and retry? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}🔄 Dropping existing types...${NC}"
            psql "$DB_URL" -c "DROP TYPE IF EXISTS user_role CASCADE;" 2>/dev/null || true
            psql "$DB_URL" -c "DROP TYPE IF EXISTS permission_action CASCADE;" 2>/dev/null || true
            psql "$DB_URL" -c "DROP TYPE IF EXISTS resource_type CASCADE;" 2>/dev/null || true
            
            echo -e "${YELLOW}🔄 Retrying migration...${NC}"
            if run_sql "$MIGRATION_FILE" "Running master RBAC migration (retry)"; then
                echo -e "${GREEN}✅ Migration successful on retry!${NC}"
            else
                echo -e "${RED}❌ Migration failed again. Please check the errors above.${NC}"
            fi
        fi
    fi
else
    echo -e "${RED}❌ Error: Migration file not found at $MIGRATION_FILE${NC}"
    echo "Please ensure you're running this script from the 'RBAC Migration' folder"
    exit 1
fi

# Cleanup
rm -f /tmp/migration_output.log