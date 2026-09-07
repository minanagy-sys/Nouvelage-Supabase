FROM node:22-alpine

WORKDIR /app

# Install production deps first so code changes don't bust the layer cache.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund 2>/dev/null || npm install --omit=dev --no-audit --no-fund

COPY src ./src
COPY db ./db
COPY scripts ./scripts

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/server.js"]
