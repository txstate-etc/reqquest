FROM node:24-alpine AS build
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
RUN npm run build

FROM node:24-alpine
WORKDIR /usr/app/api
COPY --from=build /usr/app/api/node_modules /usr/app/api/dist /usr/app/api/package.json ./
WORKDIR /usr/app/demos
COPY demos/package.json demos/package-lock.json ./
RUN npm ci --omit=dev --omit=optional
COPY --from=build /usr/app/demos/dist dist
COPY --from=build /usr/app/api /usr/app/api

CMD [ "npm", "start" ]
