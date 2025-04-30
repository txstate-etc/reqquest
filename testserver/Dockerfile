FROM node:22-alpine AS build
WORKDIR /usr/app/api
COPY api/package.json api/package-lock.json ./
RUN npm ci
COPY api/tsconfig.json ./
COPY api/src src
RUN npm run build
WORKDIR /usr/app/testserver
COPY testserver/package.json testserver/package-lock.json ./
RUN npm ci
COPY testserver/tsconfig.json ./
COPY testserver/src src
RUN npm run build

FROM node:22-alpine
WORKDIR /usr/app/api
COPY --from=build /usr/app/api/node_modules /usr/app/api/dist /usr/app/api/package.json ./
WORKDIR /usr/app/testserver
COPY testserver/package.json testserver/package-lock.json ./
RUN npm ci --omit=dev --omit=optional
COPY --from=build /usr/app/testserver/dist dist

CMD [ "npm", "start" ]
