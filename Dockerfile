FROM node:20-alpine

LABEL maintainer="Pennderin"
LABEL description="Media Manager Server — slim manual grab pipeline"

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/

ENV CONFIG_DIR=/config
ENV PORT=9876
ENV LOG_LEVEL=info
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN mkdir -p /config /staging

EXPOSE 9876

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:9876/ping || exit 1

CMD ["node", "server.js"]
