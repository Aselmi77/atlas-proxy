FROM node:24-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY src ./src
COPY public ./public
COPY LICENSE ./LICENSE
USER node
ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/index.js"]
