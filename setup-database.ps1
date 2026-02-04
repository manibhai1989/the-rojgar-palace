# PostgreSQL Database Setup Script
# Run this AFTER installing PostgreSQL and creating the database

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Database Setup for Sarkari Result Hub" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if PostgreSQL is running
Write-Host "[1/5] Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL service not found or not running" -ForegroundColor Red
    Write-Host "Please install PostgreSQL first!" -ForegroundColor Red
    exit 1
}

# Step 2: Check if .env file exists
Write-Host ""
Write-Host "[2/5] Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Make sure you've updated DATABASE_URL in .env" -ForegroundColor Yellow
    Write-Host "   Example: DATABASE_URL='postgresql://postgres:YOUR_PASSWORD@localhost:5432/sarkari_hub?schema=public'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Have you updated the .env file with your PostgreSQL password? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please update .env file first, then run this script again." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    exit 1
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "[3/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 4: Generate Prisma Client
Write-Host ""
Write-Host "[4/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Prisma generate failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client generated" -ForegroundColor Green

# Step 5: Run migrations
Write-Host ""
Write-Host "[5/5] Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Wrong password in .env file" -ForegroundColor Gray
    Write-Host "  - Database 'sarkari_hub' not created" -ForegroundColor Gray
    Write-Host "  - PostgreSQL not running" -ForegroundColor Gray
    exit 1
}
Write-Host "✓ Migrations completed successfully" -ForegroundColor Green

# Success!
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ✓ Database setup complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Run 'npm run dev' to start your application" -ForegroundColor Yellow
Write-Host ""
