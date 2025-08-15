#!/bin/bash

# GCP Firewall Rule Setup for Lovely Shinookubo
# This script creates a firewall rule to allow access to port 7077

echo "🔥 Setting up GCP Firewall Rule for Port 7077"
echo "============================================="

# Check if gcloud is available
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found"
    echo "   Please install Google Cloud CLI or run this command manually in GCP Console:"
    echo ""
    echo "   gcloud compute firewall-rules create lovely-shinookubo-7077 \\"
    echo "     --allow tcp:7077 \\"
    echo "     --source-ranges 0.0.0.0/0 \\"
    echo "     --description 'Allow access to Lovely Shinookubo proxy server on port 7077'"
    echo ""
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &>/dev/null; then
    echo "❌ Please authenticate with gcloud first:"
    echo "   gcloud auth login"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Please set a project:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "✅ Project: $PROJECT_ID"

# Check if firewall rule already exists
if gcloud compute firewall-rules describe lovely-shinookubo-7077 &>/dev/null; then
    echo "⚠️  Firewall rule 'lovely-shinookubo-7077' already exists"
    echo "   Updating the existing rule..."
    
    gcloud compute firewall-rules update lovely-shinookubo-7077 \
        --allow tcp:7077 \
        --source-ranges 0.0.0.0/0
else
    echo "🔥 Creating new firewall rule..."
    
    gcloud compute firewall-rules create lovely-shinookubo-7077 \
        --allow tcp:7077 \
        --source-ranges 0.0.0.0/0 \
        --description "Allow access to Lovely Shinookubo proxy server on port 7077" \
        --direction INGRESS
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firewall rule created successfully!"
    echo ""
    echo "🌐 You can now access the service at:"
    echo "   http://34.58.110.50:7077/health"
    echo "   http://34.58.110.50:7077/api/status"
    echo ""
    echo "🧪 Test with curl:"
    echo "   curl http://34.58.110.50:7077/health"
    echo ""
else
    echo "❌ Failed to create firewall rule"
    echo "   Please create it manually in GCP Console:"
    echo "   VPC network > Firewall > Create Firewall Rule"
    echo "   - Name: lovely-shinookubo-7077"
    echo "   - Direction: Ingress"
    echo "   - Action: Allow"
    echo "   - Targets: All instances in the network"
    echo "   - Source IP ranges: 0.0.0.0/0"
    echo "   - Protocols and ports: TCP, 7077"
fi