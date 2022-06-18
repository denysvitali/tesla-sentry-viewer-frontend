IMAGE_DEV=dvitali/tesla-sentry-viewer-frontend-dev
REGISTRY=
IMAGE=dvitali/tesla-sentry-viewer-frontend
VERSION=$(shell ./get-version.sh)
TAG=$(VERSION)

config:
	pongo2-runner

docker-build:
	docker build \
		-t "$(IMAGE):$(VERSION)" \
		.

docker-tag-latest:
	docker tag "$(IMAGE):$(TAG)" "$(IMAGE):latest"

docker-push:
	docker push "$(IMAGE):$(TAG)"

docker-push-latest:
	docker push "$(IMAGE):latest"

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

docker-run-dev:
	docker run \
		-it \
		--name=tesla-sentry-viewer-dev \
		--rm \
		-u 1000 \
		-p 3000:3000 \
		--entrypoint=yarn \
		-w /app \
		-v "$$PWD:/app" \
		node:lts \
		run dev-docker
