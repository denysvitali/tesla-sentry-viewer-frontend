FROM node:lts AS builder
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn run vite build

FROM nginx:stable-alpine
ARG PONGO2_RUNNER_VERSION=0.0.7
ENV TESLA_SENTRY_VIEWER_BACKEND_ENDPOINT=http://backend:8150
RUN apk add --no-cache bash
RUN wget \
    https://github.com/swisscom/pongo2-runner/releases/download/v${PONGO2_RUNNER_VERSION}/pongo2-runner-linux-x86_64 \
    -O /usr/bin/pongo2-runner && \
    chmod a+x /usr/bin/pongo2-runner
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
