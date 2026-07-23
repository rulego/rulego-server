# Stage 1: Build the Go backend
FROM golang:1.26.5 as backend-builder
WORKDIR /root
ADD . /root

RUN mkdir -p bin/ && GOPROXY="https://goproxy.cn,direct"  go build -ldflags '-w -s -extldflags "-static" -X main.Version=$(VERSION)' -tags "with_extend,with_ai,with_ci,with_iot,with_etl,musl" -o ./bin/ ./...

# RUN go mod download

# Stage 2: Create the final image
FROM alpine:3.21.3
WORKDIR /app

RUN mkdir -p /app/logs
# Copy the binary from the backend build stage
COPY --from=backend-builder /root/bin /app
COPY --from=backend-builder /root/config.conf /app/config.conf
# Expose the service port
EXPOSE 9091

# Start the service
CMD ["./server"]
