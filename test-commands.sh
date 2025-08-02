#!/bin/bash

# WeFuel Platform - Quick Test Commands
# Run these commands to quickly test your platform

echo "🧪 WeFuel Platform - Quick Test Commands"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to test service
test_service() {
    local name=$1
    local url=$2
    local description=$3
    
    echo -n "Testing $description... "
    if curl -s "$url" > /dev/null 2>&1; then
        print_success "OK"
    else
        print_error "FAILED"
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    if curl -s "http://localhost:4000$endpoint" > /dev/null 2>&1; then
        print_success "OK"
    else
        print_error "FAILED"
    fi
}

# Check if we're in the right directory
if [ ! -d "wefuel-platform" ] || [ ! -d "wefuel-backend" ]; then
    print_error "Please run this script from the wefuel-test directory"
    print_info "Expected structure: ~/wefuel-test/"
    exit 1
fi

echo ""
print_info "Starting comprehensive platform tests..."
echo ""

# 1. Check PM2 Status
echo "📊 PM2 Process Status:"
pm2 status
echo ""

# 2. Test Basic Connectivity
echo "🌐 Basic Connectivity Tests:"
test_service "Frontend" "http://localhost:3000" "Frontend (Port 3000)"
test_service "Backend" "http://localhost:4000" "Backend (Port 4000)"
echo ""

# 3. Test API Endpoints
echo "🔧 API Endpoint Tests:"
test_api "/api/health" "Health Check"
test_api "/api/users" "Users API"
echo ""

# 4. Test Database Connection
echo "🗄️ Database Tests:"
echo -n "Testing MongoDB connection... "
if mongosh wefuel-test --eval "db.stats()" > /dev/null 2>&1; then
    print_success "OK"
else
    print_error "FAILED"
fi

echo -n "Testing users collection... "
if mongosh wefuel-test --eval "db.users.countDocuments()" > /dev/null 2>&1; then
    print_success "OK"
else
    print_error "FAILED"
fi
echo ""

# 5. Test Frontend Pages
echo "📱 Frontend Page Tests:"
test_service "Demo Page" "http://localhost:3000" "Demo Page"
test_service "Login Page" "http://localhost:3000/login" "Login Page"
test_service "Fuel Order" "http://localhost:3000/order" "Fuel Order Page"
test_service "Wallet" "http://localhost:3000/wallet" "Wallet Page"
test_service "Track Order" "http://localhost:3000/track" "Track Order Page"
echo ""

# 6. Test Driver Pages
echo "🚚 Driver Page Tests:"
test_service "Driver Training" "http://localhost:3000/driver/training" "Driver Training"
test_service "Driver Deliveries" "http://localhost:3000/driver/deliveries" "Driver Deliveries"
test_service "Driver Earnings" "http://localhost:3000/driver/earnings" "Driver Earnings"
test_service "Driver Referrals" "http://localhost:3000/driver/referrals" "Driver Referrals"
echo ""

# 7. Test Station Pages
echo "🏪 Station Page Tests:"
test_service "Station Dashboard" "http://localhost:3000/station/dashboard" "Station Dashboard"
test_service "Station Inventory" "http://localhost:3000/station/inventory" "Station Inventory"
test_service "Station Orders" "http://localhost:3000/station/orders" "Station Orders"
test_service "Station Reports" "http://localhost:3000/station/reports" "Station Reports"
echo ""

# 8. Test Admin Pages
echo "👨‍💼 Admin Page Tests:"
test_service "Admin Dashboard" "http://localhost:3000/admin/dashboard" "Admin Dashboard"
test_service "Admin Users" "http://localhost:3000/admin/users" "Admin Users"
test_service "Admin Settings" "http://localhost:3000/admin/settings" "Admin Settings"
echo ""

# 9. Performance Tests
echo "⚡ Performance Tests:"
echo -n "Testing frontend load time... "
FRONTEND_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3000)
if (( $(echo "$FRONTEND_TIME < 2.0" | bc -l) )); then
    print_success "OK (${FRONTEND_TIME}s)"
else
    print_warning "SLOW (${FRONTEND_TIME}s)"
fi

echo -n "Testing API response time... "
API_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:4000/api/health)
if (( $(echo "$API_TIME < 1.0" | bc -l) )); then
    print_success "OK (${API_TIME}s)"
else
    print_warning "SLOW (${API_TIME}s)"
fi
echo ""

# 10. System Resource Check
echo "💻 System Resources:"
echo -n "Memory usage... "
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
if (( $(echo "$MEMORY_USAGE < 80" | bc -l) )); then
    print_success "OK (${MEMORY_USAGE}%)"
else
    print_warning "HIGH (${MEMORY_USAGE}%)"
fi

echo -n "Disk usage... "
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    print_success "OK (${DISK_USAGE}%)"
else
    print_warning "HIGH (${DISK_USAGE}%)"
fi
echo ""

# 11. Test Data Verification
echo "📊 Test Data Verification:"
echo -n "Checking test users... "
USER_COUNT=$(mongosh wefuel-test --quiet --eval "db.users.countDocuments()")
if [ "$USER_COUNT" -gt 0 ]; then
    print_success "OK ($USER_COUNT users)"
else
    print_error "NO USERS FOUND"
fi

echo -n "Checking test orders... "
ORDER_COUNT=$(mongosh wefuel-test --quiet --eval "db.orders.countDocuments()")
if [ "$ORDER_COUNT" -gt 0 ]; then
    print_success "OK ($ORDER_COUNT orders)"
else
    print_warning "NO ORDERS FOUND"
fi
echo ""

# Summary
echo "🎯 Test Summary:"
echo "================"
print_info "Frontend URL: http://localhost:3000"
print_info "Backend URL: http://localhost:4000"
print_info "Test Database: wefuel-test"
echo ""
print_info "Test Accounts:"
echo "  Customer: test@wefuel.com / test123"
echo "  Driver: driver@wefuel.com / driver123"
echo "  Station: station@wefuel.com / station123"
echo ""
print_info "Management Commands:"
echo "  View logs: pm2 logs"
echo "  Restart all: pm2 restart all"
echo "  Stop all: pm2 stop all"
echo "  Status: pm2 status"
echo ""

print_success "🎉 Platform testing completed!"
print_info "Open http://localhost:3000 to start exploring the platform" 