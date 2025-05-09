# 第一阶段: 构建Go后端
FROM golang:1.24.1 as backend-builder
WORKDIR /root
ADD . /root

RUN mkdir -p bin/ && GOPROXY="https://goproxy.cn,direct"  go build -ldflags '-w -s -extldflags "-static" -X main.Version=$(VERSION)' -tags "with_extend,with_ai,with_ci,with_iot,with_etl,musl" -o ./bin/ ./...

# RUN go mod download

# 第三阶段: 最终镜像
FROM alpine:3.21.3
WORKDIR /app

RUN mkdir -p /app/logs
# 从后端构建阶段复制二进制文件
COPY --from=backend-builder /root/bin /app
COPY --from=backend-builder /root/config.conf /app/config.conf
# 暴露服务端口
EXPOSE 9091

# 启动服务
CMD ["./server"]