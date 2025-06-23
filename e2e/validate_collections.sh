#!/bin/bash

# Collection Validation Script
# Validates all API collection formats for git-service

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Validating Git Service API Collections${NC}"
echo "========================================"

# Function to validate JSON
validate_json() {
    local file=$1
    local name=$2
    
    echo -n "Validating $name... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ File not found${NC}"
        return 1
    fi
    
    if command -v jq >/dev/null 2>&1; then
        if jq empty "$file" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Valid JSON${NC}"
        else
            echo -e "${RED}❌ Invalid JSON${NC}"
            return 1
        fi
    elif command -v python3 >/dev/null 2>&1; then
        if python3 -m json.tool "$file" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Valid JSON${NC}"
        else
            echo -e "${RED}❌ Invalid JSON${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ No JSON validator found${NC}"
    fi
}

# Function to count endpoints
count_endpoints() {
    local file=$1
    local name=$2
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    if command -v jq >/dev/null 2>&1; then
        local count
        if [[ "$file" == *"postman"* ]]; then
            # Postman format - count items recursively
            count=$(jq '[.. | objects | select(has("request")) | .request] | length' "$file" 2>/dev/null || echo "0")
        elif [[ "$file" == *"core"* ]]; then
            # HTTPie Core format
            count=$(jq '.requests | length' "$file" 2>/dev/null || echo "0")
        else
            # HTTPie Desktop format
            count=$(jq '.requests | length' "$file" 2>/dev/null || echo "0")
        fi
        echo "  📊 $name: $count endpoints"
    fi
}

# Function to check required fields
check_structure() {
    local file=$1
    local name=$2
    
    echo -n "Checking $name structure... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ File not found${NC}"
        return 1
    fi
    
    if command -v jq >/dev/null 2>&1; then
        if [[ "$file" == *"postman"* ]]; then
            # Postman structure
            if jq -e '.info and .item' "$file" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Valid structure${NC}"
            else
                echo -e "${RED}❌ Missing required fields${NC}"
                return 1
            fi
        else
            # HTTPie structure
            if jq -e '.requests' "$file" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Valid structure${NC}"
            else
                echo -e "${RED}❌ Missing required fields${NC}"
                return 1
            fi
        fi
    else
        echo -e "${YELLOW}⚠️ Cannot validate structure${NC}"
    fi
}

# Function to check URLs
check_urls() {
    local file=$1
    local name=$2
    
    echo -n "Checking $name URLs... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ File not found${NC}"
        return 1
    fi
    
    if command -v jq >/dev/null 2>&1; then
        local url_count
        if [[ "$file" == *"postman"* ]]; then
            url_count=$(jq '[.. | objects | select(has("request")) | .request.url] | length' "$file" 2>/dev/null || echo "0")
        elif [[ "$file" == *"core"* ]]; then
            url_count=$(jq '[.requests[] | select(has("url"))] | length' "$file" 2>/dev/null || echo "0")
        else
            url_count=$(jq '[.requests[] | select(has("url"))] | length' "$file" 2>/dev/null || echo "0")
        fi
        
        if [ "$url_count" -gt 0 ]; then
            echo -e "${GREEN}✅ URLs present${NC}"
        else
            echo -e "${RED}❌ No URLs found${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ Cannot validate URLs${NC}"
    fi
}

# Main validation
echo -e "\n${YELLOW}JSON Validation:${NC}"
validate_json "git_service.json" "HTTPie Desktop"
validate_json "git_service_core.json" "HTTPie Core"
validate_json "git_service_postman.json" "Postman"

echo -e "\n${YELLOW}Structure Validation:${NC}"
check_structure "git_service.json" "HTTPie Desktop"
check_structure "git_service_core.json" "HTTPie Core"
check_structure "git_service_postman.json" "Postman"

echo -e "\n${YELLOW}URL Validation:${NC}"
check_urls "git_service.json" "HTTPie Desktop"
check_urls "git_service_core.json" "HTTPie Core"
check_urls "git_service_postman.json" "Postman"

echo -e "\n${YELLOW}Endpoint Count:${NC}"
count_endpoints "git_service.json" "HTTPie Desktop"
count_endpoints "git_service_core.json" "HTTPie Core"
count_endpoints "git_service_postman.json" "Postman"

# Additional checks
echo -e "\n${YELLOW}Additional Checks:${NC}"

# Check file sizes
echo "📏 File Sizes:"
for file in git_service.json git_service_core.json git_service_postman.json; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        echo "  $file: ${size} bytes"
    fi
done

# Check for required endpoints
echo -e "\n🔍 Required Endpoints Check:"
required_endpoints=("health" "repositories" "commits")

for file in git_service.json git_service_core.json git_service_postman.json; do
    if [ -f "$file" ] && command -v jq >/dev/null 2>&1; then
        echo "  Checking $file:"
        for endpoint in "${required_endpoints[@]}"; do
            if jq -r '.. | strings' "$file" 2>/dev/null | grep -q "$endpoint"; then
                echo -e "    ✅ $endpoint endpoint found"
            else
                echo -e "    ❌ $endpoint endpoint missing"
            fi
        done
    fi
done

# Check for environment variables
echo -e "\n🔧 Environment Variables:"
if [ -f "environments.json" ] && command -v jq >/dev/null 2>&1; then
    env_count=$(jq '.environments | length' environments.json 2>/dev/null || echo "0")
    echo "  📊 Environments defined: $env_count"
    jq -r '.environments[].name' environments.json 2>/dev/null | sed 's/^/    - /' || echo "    No environments found"
fi

echo -e "\n${GREEN}🎉 Validation Complete!${NC}"
echo
echo "Usage Instructions:"
echo "==================="
echo "• HTTPie Desktop: Import git_service.json"
echo "• HTTPie Core: Use git_service_core.json"
echo "• Postman/Insomnia: Import git_service_postman.json"
echo "• All tools: Configure base_url to http://localhost:3000"
echo
echo "Quick Test:"
echo "==========="
echo "1. Start git-service: cd ../apps/git-service && make dev"
echo "2. Run tests: ./test_git_service.sh"
echo "3. Import collection in your preferred tool"