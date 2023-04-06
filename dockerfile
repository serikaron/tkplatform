FROM node:alpine as tk-node

ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev

FROM tk-node as node-service

ARG name

COPY common /app/common
COPY ${name} /app/${name}

FROM golang:1.18-alpine as tk-go

# 设置必要的环境变量
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOPROXY=https://goproxy.cn,direct

RUN set -ex \
    && sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && apk --no-cache add ca-certificates

FROM tk-go as tk-go-build

# 移动到工作目录：/build
WORKDIR /data

# 将代码复制到容器中
COPY service .

RUN go mod download && go mod tidy -v && go build -o apid apid.go

# 运行阶段指定scratch作为基础镜像
FROM alpine as go-service

WORKDIR /app

# 拷贝二进制可执行文件
COPY --from=tk-go-build /data/apid /app/apid

# 下载时区包
COPY --from=tk-go-build /usr/share/zoneinfo /usr/share/zoneinfo

# 设置当前时区
COPY --from=tk-go-build /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# https ssl证书
COPY --from=tk-go-build /data/config/config.json /app/config/config.json

# 需要运行的命令
ENTRYPOINT ["./apid"]