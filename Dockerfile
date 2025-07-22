# BUILD STAGE
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force

# PRODUCTION STAGE
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]