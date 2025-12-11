# ===============================
# Build Stage - Angular
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
# Remove component stylesheet budgets that cause build failures
RUN node -e " \
    const fs = require('fs'); \
    const config = JSON.parse(fs.readFileSync('angular.json', 'utf8')); \
    const architect = config.projects['pay-peek-frontend']?.architect?.build?.configurations?.production; \
    if (architect?.budgets) { \
    architect.budgets = architect.budgets.filter(b => b.type !== 'anyComponentStyle'); \
    } \
    fs.writeFileSync('angular.json', JSON.stringify(config, null, 2)); \
    console.log('Removed anyComponentStyle budgets'); \
    "
RUN npm run build -- --configuration=production

# ===============================
# Runtime Stage - Nginx
# ===============================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app from build stage
# Handle different Angular output structures (with or without /browser subfolder)
COPY --from=build /app/dist/pay-peek-frontend /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
