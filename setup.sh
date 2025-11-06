#!/bin/bash

echo "=========================================="
echo "Setting up your application..."
echo "=========================================="
echo ""

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "Creating uploads directory..."
    mkdir uploads
    echo "✓ uploads directory created"
else
    echo "✓ uploads directory already exists"
fi

# Fix permissions on current directory
echo ""
echo "Fixing permissions..."
chmod -R 755 .
echo "✓ Permissions fixed"

# Remove old database if it exists and has permission issues
if [ -f "placements.db" ]; then
    echo ""
    echo "Removing old database (if any)..."
    rm placements.db
    echo "✓ Old database removed"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "WARNING: node_modules not found!"
    echo "You may need to run: npm install"
fi

echo ""
echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure you have a .env file with:"
echo "   SESSION_SECRET=your_secret_here"
echo "   GEMINI_API_KEY=your_api_key_here"
echo ""
echo "2. Run WITHOUT sudo:"
echo "   node server.js"
echo ""
echo "3. Open browser to: http://localhost:3000"
echo ""
echo "DO NOT USE SUDO to run the server!"
echo "=========================================="