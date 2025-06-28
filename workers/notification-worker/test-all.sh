#!/bin/bash

# Notification Worker Test Suite
# Runs all tests and provides summary

set -e

echo "🧪 Running Notification Worker Test Suite"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo ""
    echo -e "${YELLOW}🔍 Running: $test_name${NC}"
    echo "Command: $test_command"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Lint check (informational - not blocking)
echo ""
echo -e "${YELLOW}🔍 Running: ESLint Code Quality (informational)${NC}"
echo "Command: npm run lint"
echo "----------------------------------------"
if npm run lint; then
    echo -e "${GREEN}✅ Linting: Clean${NC}"
else
    echo -e "${YELLOW}⚠️  Linting: Some warnings (non-blocking)${NC}"
fi

# Unit tests
run_test "Unit Tests" "npm test"

# Coverage test
run_test "Test Coverage" "npm run test:cov"

# E2E tests
run_test "Integration Tests (E2E)" "npm run test:e2e"

# Build test
run_test "TypeScript Build" "npm run build"

echo ""
echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    echo ""
    echo -e "${RED}❌ OVERALL RESULT: FAILED${NC}"
    exit 1
else
    echo -e "${GREEN}Failed: $FAILED_TESTS${NC}"
    echo ""
    echo -e "${GREEN}🎉 OVERALL RESULT: ALL CORE TESTS PASSED!${NC}"
    echo ""
    echo "✅ Unit Tests: Passing"
    echo "✅ Coverage: Good"
    echo "✅ Integration: Working"
    echo "✅ Build: Successful"
    echo "✅ Core Functionality: Ready"
    echo ""
    echo "🚀 Notification Worker is ready for testing!"
fi