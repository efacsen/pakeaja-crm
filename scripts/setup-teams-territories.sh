#!/bin/bash

# Script to set up team and territory tables in Supabase

echo "🚀 Setting up Team and Territory Tables"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo "Please ensure you have a .env.local file with your Supabase credentials."
    exit 1
fi

# Load environment variables
source .env.local

# Extract project ID from Supabase URL
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Could not extract project ID from NEXT_PUBLIC_SUPABASE_URL${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found Supabase project: ${PROJECT_ID}${NC}"
echo ""

# Instructions for running migration
echo -e "${YELLOW}📋 Instructions to create team and territory tables:${NC}"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/${PROJECT_ID}/sql"
echo ""
echo "2. Copy the contents of this file:"
echo "   supabase/migrations/20250109_create_team_territory_tables.sql"
echo ""
echo "3. Paste and run it in the SQL Editor"
echo ""
echo "4. You should see success messages and table creation confirmations"
echo ""

# Ask if user has run the migration
read -p "Have you run the migration in Supabase? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please run the migration first, then run this script again.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}✓ Great! Now let's regenerate the TypeScript types...${NC}"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Installing Supabase CLI...${NC}"
    npm install -g supabase
fi

# Generate types
echo "Generating TypeScript types..."
npx supabase gen types typescript --project-id $PROJECT_ID > src/types/database.types.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript types generated successfully!${NC}"
    echo ""
    
    # Check if the new tables are in the types
    if grep -q "teams:" src/types/database.types.ts && \
       grep -q "territories:" src/types/database.types.ts && \
       grep -q "team_members:" src/types/database.types.ts && \
       grep -q "user_territories:" src/types/database.types.ts; then
        echo -e "${GREEN}✓ All team and territory tables found in types!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Setup complete! You can now build the team hierarchy UI.${NC}"
    else
        echo -e "${RED}❌ Some tables are missing from the generated types.${NC}"
        echo "Please ensure the migration ran successfully in Supabase."
    fi
else
    echo -e "${RED}❌ Failed to generate TypeScript types${NC}"
    echo "Please check your Supabase credentials and try again."
fi

echo ""
echo "Next steps:"
echo "1. Check src/types/database.types.ts to see the new table types"
echo "2. Build the team management UI at /dashboard/teams"
echo "3. Build the territory management UI at /dashboard/territories"