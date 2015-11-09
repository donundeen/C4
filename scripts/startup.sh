sudo nginx -c /Users/donundeen/htdocs/C4/server_configs/nginx/nginx.conf
PORT=3003 JSBIN_CONFIG=/Users/donundeen/htdocs/C4/server_configs/jsbin/config.local.json JSBIN_PROXY=on jsbin &
JSBIN_CONFIG=/Users/donundeen/htdocs/C4/server_configs/jsbin/config.api.json  jsbin &