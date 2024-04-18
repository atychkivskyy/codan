FROM openresty/openresty:latest

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

ENV NGINX_PORT=80

EXPOSE 80

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
