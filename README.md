paths and ports and things

Mongo runs on Port 3001

Meteor
port: 3000

nginx
port 80
{PATH_TO}/C4/server_configs/nginx/nginx.conf
- start with sudo nginx -c {PATH_TO}/C4/server_configs/nginx/nginx.conf




jsbin
{PATH_TO}/server_configs/jsbin/config.local.json 
PORT=3003 JSBIN_CONFIG={PATH_TO}/server_configs/jsbin/config.local.json JSBIN_PROXY=on jsbin &

jsbin API
(port 3002)
{PATH_TO}/server_configs/jsbin/config.api.json 
JSBIN_CONFIG={PATH_TO}/server_configs/jsbin/config.api.json jsbin &
