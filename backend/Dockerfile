################################################################################
# cross build stage
FROM ubuntu:22.04 as build-stage

ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
set -e
apt update
apt upgrade -y
apt install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    g++-riscv64-linux-gnu \
    wget
EOF

ARG GOVERSION=1.22.1

WORKDIR /src

RUN wget https://go.dev/dl/go${GOVERSION}.linux-$(dpkg --print-architecture).tar.gz && \
    tar -C /usr/local -xzf go${GOVERSION}.linux-$(dpkg --print-architecture).tar.gz

ENV PATH=/usr/local/go/bin:${PATH}

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage bind mounts to go.sum and go.mod to avoid having to copy them into
# the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=./go.sum,target=./go.sum \
    --mount=type=bind,source=./go.mod,target=./go.mod \
    go mod download -x

# Build the application.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage a bind mount to the current directory to avoid having to copy the
# source code into the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,target=. \
    CGO_ENABLED=1 GOARCH=riscv64 GOOS=linux CC=riscv64-linux-gnu-gcc go build -o /bin/app ./cmd/rollup/

# runtime stage: produces final image that will be executed
FROM --platform=linux/riscv64 riscv64/ubuntu:22.04 as runtime

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.14.1
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -i /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
  && rm /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

LABEL io.cartesi.rollups.sdk_version=0.6.0
LABEL io.cartesi.rollups.ram_size=128Mi

ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
set -e
apt-get update
apt-get install -y --no-install-recommends \
  busybox-static=1:1.30.1-7ubuntu3
rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/*
useradd --create-home --user-group dapp
EOF

WORKDIR /var/opt/cartesi-app

ENV PATH="/opt/cartesi/bin:${PATH}"

## TODO: Is there a way to not copy the public key?

COPY --from=build-stage /bin/app app

ENTRYPOINT ["rollup-init"]

CMD ["/var/opt/cartesi-app/app"]
