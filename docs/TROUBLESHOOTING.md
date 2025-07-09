# Troubleshooting Guide

## CSS/Styling Issues

### Problem: Dashboard shows white/blank screen with CSP violations

**Symptoms:**
- Console shows CSP violations blocking Tailwind CDN
- Dashboard appears blank or with minimal styling
- Error: "Refused to load the stylesheet 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css'"

**Solutions:**

1. **Quick Fix - Use Clean Dev Script:**
   ```bash
   npm run dev:clean
   ```

2. **Manual Fix:**
   ```bash
   # Kill existing processes
   pkill -f "next dev"
   
   # Clear cache
   rm -rf .next
   
   # Start fresh
   npm run dev
   ```

3. **Check for Browser Extensions:**
   - Some browser extensions inject CDN stylesheets
   - Try in incognito mode or disable extensions

4. **Force Rebuild:**
   ```bash
   npm run build:no-check
   npm start
   ```

### Problem: Hot reload not working

**Solution:**
```bash
# Use the development environment file
cp .env.development .env.local

# Restart dev server
npm run dev:clean
```

## Build Issues

### Problem: Build fails with environment variable errors

**Solution:**
```bash
# Use the no-check build command
npm run build:no-check
```

### Problem: TypeScript errors during build

**Solution:**
- TypeScript errors are ignored in production builds
- To check types manually: `npm run type-check`

## Development Workflow

### Recommended Development Flow:

1. **Start Development:**
   ```bash
   npm run dev:clean
   ```

2. **Before Committing:**
   ```bash
   npm run lint:fix
   npm run type-check
   npm run build:no-check
   ```

3. **Testing Changes:**
   ```bash
   npm run build:no-check
   npm start
   # Visit http://localhost:3000
   ```

### Quick Commands Reference:

- `npm run dev` - Normal dev server
- `npm run dev:clean` - Clean start (recommended)
- `npm run build:no-check` - Build without env checks
- `npm run lint:fix` - Auto-fix linting issues
- `npm run type-check` - Check TypeScript types

## Common Issues

### CSS Not Loading Properly
1. Clear browser cache
2. Clear Next.js cache: `rm -rf .next`
3. Check console for blocked resources
4. Use `npm run dev:clean`

### Performance Issues
1. Disable source maps in development
2. Use production build for testing: `npm run build && npm start`
3. Check for memory leaks in browser DevTools

### Authentication Issues
1. Check Supabase connection
2. Verify environment variables
3. Clear cookies and local storage
4. Check middleware logs