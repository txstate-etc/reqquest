FROM node:22-alpine AS build
RUN apk update && apk upgrade

WORKDIR /usr/app
COPY ui/package.json ./
COPY ui/package-lock.json ./
COPY ui/svelte.config.js ./
COPY ui/tailwind.config.js ./
COPY ui/postcss.config.js ./
COPY ui/tsconfig.json ./
COPY ui/vite.config.ts ./
RUN npm ci
COPY ui/src src
COPY ui/static static
COPY ui/.env ./
RUN npm run build

FROM nginx:mainline-alpine
RUN apk update && apk upgrade && apk add grep brotli
COPY --from=build /usr/app/build /usr/share/nginx/html
COPY ui/static/* /usr/share/nginx/html/
COPY ui/nginx.conf /etc/nginx/nginx.conf
COPY ui/apply-env.sh /docker-entrypoint.d/40-apply-env.sh
