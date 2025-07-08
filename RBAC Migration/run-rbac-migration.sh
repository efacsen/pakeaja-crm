#!/bin/bash

# RBAC Migration Script for PakeAja CRM
# This script helps run the RBAC migration on your Supabase database

echo "======================================"
echo "PakeAja CRM - RBAC Migration Script"
echo "======================================"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed."
    echo "Please install PostgreSQL client tools first."
    echo ""
    echo "On macOS: brew install postgresql"
    echo "On Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Get database connection string
echo "Please enter your Supabase database connection string:"
echo "(You can find this in Supabase Dashboard > Settings > Database)"
echo ""
read -p "Connection string: " DB_URL

# Validate connection string
if [[ ! "$DB_URL" =~ ^postgresql:// ]]; then
    echo "❌ Error: Invalid connection string. It should start with 'postgresql://'"
    exit 1
fi

echo ""
echo "🔄 Connecting to database..."

# Test connection
if ! psql "$DB_URL" -c "SELECT 1" &> /dev/null; then
    echo "❌ Error: Could not connect to database. Please check your connection string."
    exit 1
fi

echo "✅ Connected successfully!"
echo ""

# Run migration
echo "🚀 Running RBAC migration..."
echo "This will:"
echo "  - Create RBAC tables and permissions"
echo "  - Convert existing roles to new system"
echo "  - Update akevinzakaria@cepatservicestation.com to admin role"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Run the master migration
    if psql "$DB_URL" < supabase/migrations/20250108_master_rbac_migration.sql; then
        echo ""
        echo "✅ Migration completed successfully!"
        echo ""
        
        # Verify admin role
        echo "🔍 Verifying your admin role..."
        psql "$DB_URL" -c "SELECT email, role, department, position FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';"
        
        echo ""
        echo "🎉 RBAC system is now active!"
        echo ""
        echo "Next steps:"
        echo "1. Log out and log back in to refresh your session"
        echo "2. Visit /dashboard/profile to see your admin role"
        echo "3. Visit /dashboard/users to manage other users"
        echo ""
    else
        echo ""
        echo "❌ Migration failed. Please check the error messages above."
        echo ""
        echo "Common issues:"
        echo "1. Type conflicts - Try running: DROP TYPE IF EXISTS user_role CASCADE;"
        echo "2. Table conflicts - Check if tables already exist"
        echo "3. Permission issues - Ensure you have CREATE privileges"
    fi
else
    echo "Migration cancelled."
fi