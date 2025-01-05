FROM node:lts AS builder
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn run vite build

FROM nginx:stable-alpine
ENV TESLA_SENTRY_VIEWER_BACKEND_ENDPOINT=http://backend:8150
RUN apk add --no-cache bash envsubst
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
