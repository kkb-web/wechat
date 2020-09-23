# alpine-node:10
FROM 192.168.100.36:1179/xiaoke/node10-nginx_alpine:1.0

# install dependence
RUN apk add --no-cache make gcc g++ python sysstat

# Install cnpm
RUN npm config set unsafe-perm true && npm install -g cnpm@6.0.0 --registry=https://registry.npm.taobao.org

# Define default command.
CMD nginx -g "daemon off;"

