FROM node:21-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY . .
RUN npx prisma db push
RUN npm run build

FROM node:21-alpine as production
COPY get_binary.sh /tmp/get_binary.sh
RUN chmod +x /tmp/get_binary.sh
RUN /tmp/get_binary.sh

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --force
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY --from=build /app/build/ ./build
COPY --from=build /app/data ./data
EXPOSE 3000
CMD ["node", "./build/index.js"]
