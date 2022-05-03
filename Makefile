IMAGE_DEV=dvitali/tesla-sentry-viewer-frontend-dev

docker-run:
	docker run \
		-it \
		--name=tesla-sentry-viewer-dev \
		--rm \
		-u 1000 \
		-p 3000:3000 \
		--entrypoint=bash \
		-w /app \
		-v "$$PWD:/app" \
		node:lts 
