FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install react-router-dom axios framer-motion
RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss init -p

COPY . .

RUN npm run build

FROM alpine:3.18
WORKDIR /build

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "cp -r /build/dist/* /frontend_build"]