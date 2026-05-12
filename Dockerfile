# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy manifests first for layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (--no-frozen-lockfile allows lockfile drift)
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the source
COPY . .

# Build the Vite app
RUN pnpm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config so React Router works with client-side routing
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
