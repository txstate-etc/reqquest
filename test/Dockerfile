FROM mcr.microsoft.com/playwright:v1.53.2

COPY test/package.json test/package-lock.json ./
RUN npm ci --omit=dev
COPY test/tsconfig.json ./
COPY test/playwright.config.ts ./
COPY test/tests tests
CMD ["npm", "run", "playwright:grep"]
