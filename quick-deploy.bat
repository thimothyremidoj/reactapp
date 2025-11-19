@echo off
echo ========================================
echo  Quick Deployment Setup
echo ========================================
echo.

echo Step 1: Remove college repository connection
git remote remove origin

echo Step 2: Initialize new repository
git init
git add .
git commit -m "Initial commit - Advanced Todo App"
git branch -M main

echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo 1. Create new repository on GitHub
echo 2. Copy the command below and replace YOUR_USERNAME:
echo.
echo git remote add origin https://github.com/YOUR_USERNAME/advanced-todo-app.git
echo git push -u origin main
echo.
echo 3. Deploy frontend to Vercel
echo 4. Deploy backend to Railway
echo.
pause