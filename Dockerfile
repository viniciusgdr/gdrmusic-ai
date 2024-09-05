# Node version
FROM node:20.11.1-alpine as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY . /app

# Install all the dependencies
RUN npm install

RUN npx prisma generate

# Build the project
RUN cd gdrmusic-backend && npm install && cd ..

RUN npm run build

# Production image, copy all the files and run next
FROM node:20.11.1-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=build /app/.env ./.env
COPY --from=build /app/variants.ts ./variants.ts 
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src


RUN npm i bcrypt

USER root

EXPOSE 6000

CMD ["npx", "next", "start", "-p", "6000"]