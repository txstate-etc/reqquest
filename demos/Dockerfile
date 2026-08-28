FROM node:24-alpine AS deps
WORKDIR /usr/app/api
COPY api/package.json api/package-lock.json ./
RUN npm ci
COPY api/tsconfig.json ./
COPY api/src src
RUN npm run build
WORKDIR /usr/app/demos
COPY demos/package.json demos/package-lock.json ./
RUN npm ci
COPY demos/tsconfig.json ./
COPY demos/src src

FROM deps AS keycheck
COPY ui/src/local/keys.generated.d.ts /usr/app/ui/src/local/keys.generated.d.ts
RUN npm run keys:check

FROM keycheck AS build
RUN npm run build

FROM node:24-alpine
WORKDIR /usr/app/api
COPY --from=build /usr/app/api/node_modules /usr/app/api/dist /usr/app/api/package.json ./
WORKDIR /usr/app/demos
COPY demos/package.json demos/package-lock.json ./
RUN npm ci --omit=dev --omit=optional
COPY --from=build /usr/app/demos/dist dist
COPY --from=build /usr/app/api /usr/app/api
RUN mkdir -p /files
RUN mkdir -p /files/tmp
RUN mkdir -p /files/storage

CMD [ "npm", "start" ]
