FROM node:21-alpine as build
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY prisma/ ./prisma/
RUN pnpx prisma generate
COPY . .
RUN pnpx prisma db push
RUN pnpm run build

FROM node:21-alpine as production
COPY get_binary.sh /tmp/get_binary.sh
RUN chmod +x /tmp/get_binary.sh
RUN /tmp/get_binary.sh

RUN npm i -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --prod --frozen-lockfile
COPY prisma/ ./prisma/
RUN pnpx prisma generate
COPY --from=build /app/build/ ./build
COPY --from=build /app/data ./data
EXPOSE 3000
CMD ["node", "./build/index.js"]
