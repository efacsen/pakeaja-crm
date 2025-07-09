#!/bin/bash
# Local Testing Script for PakeAja CRM

echo "🧪 PakeAja CRM - Local Testing Script"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL - Check if running on different port
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null ; then
    BASE_URL="http://localhost:3002"
elif lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    BASE_URL="http://localhost:3000"
else
    BASE_URL="http://localhost:3000"  # Default
fi

# Function to check if server is running
check_server() {
    echo "🔍 Checking if development server is running..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/test-supabase")
    if [ "$response" = "200" ] || [ "$response" = "302" ]; then
        echo -e "${GREEN}✅ Server is running on $BASE_URL${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not responding properly. Response code: $response${NC}"
        echo "Please ensure 'npm run dev' is running."
        return 1
    fi
}

# Function to test page accessibility
test_page() {
    local path=$1
    local name=$2
    local expected_code=${3:-200}
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✅ $name - Status: $response${NC}"
    else
        echo -e "${RED}❌ $name - Status: $response (expected: $expected_code)${NC}"
    fi
}

# Function to show test URLs
show_test_urls() {
    echo ""
    echo "📋 Test URLs for Manual Testing:"
    echo "================================"
    echo ""
    echo "1. System Health Check:"
    echo "   $BASE_URL/test-supabase"
    echo ""
    echo "2. Authentication:"
    echo "   $BASE_URL/login"
    echo "   $BASE_URL/register"
    echo ""
    echo "3. Main Features:"
    echo "   $BASE_URL/dashboard"
    echo "   $BASE_URL/dashboard/daily-report"
    echo "   $BASE_URL/dashboard/leads"
    echo "   $BASE_URL/dashboard/users"
    echo "   $BASE_URL/dashboard/materials"
    echo "   $BASE_URL/dashboard/calculator"
    echo ""
    echo "4. Admin Features:"
    echo "   $BASE_URL/dashboard/settings"
    echo "   $BASE_URL/dashboard/organization"
    echo ""
}

# Main testing flow
main() {
    echo "Starting tests..."
    echo ""
    
    # Check if server is running
    if ! check_server; then
        exit 1
    fi
    
    echo ""
    echo "🧪 Testing Page Accessibility:"
    echo "=============================="
    
    # Test public pages
    test_page "/" "Homepage" "302"  # Redirects to login
    test_page "/login" "Login Page"
    test_page "/register" "Register Page"
    test_page "/test-supabase" "Supabase Test Page"
    
    # Test authenticated pages (will redirect to login)
    test_page "/dashboard" "Dashboard" "302"
    test_page "/dashboard/leads" "Sales Pipeline" "302"
    test_page "/dashboard/daily-report" "Daily Report" "302"
    test_page "/dashboard/users" "User Management" "302"
    
    # Show manual test URLs
    show_test_urls
    
    echo ""
    echo "📊 Testing Summary:"
    echo "=================="
    echo ""
    echo "Automated tests check basic connectivity."
    echo "Please perform manual testing using the URLs above."
    echo ""
    echo "Key Testing Areas:"
    echo "1. ✅ Run all tests at $BASE_URL/test-supabase"
    echo "2. 🔐 Test login with different user roles"
    echo "3. 📊 Verify dashboard data loads correctly"
    echo "4. 📝 Test daily report submission workflow"
    echo "5. 🎯 Test sales pipeline drag-and-drop"
    echo "6. 👥 Test user management (admin only)"
    echo "7. 📱 Test mobile responsiveness"
    echo ""
    echo "Happy testing! 🚀"
}

# Run main function
main