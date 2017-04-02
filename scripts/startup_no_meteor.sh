C5_HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
source $C5_HOME_DIR/scripts/env_config.sh
echo sudo nginx -c $C5_NGINX_CONFIG 
sudo nginx -c $C5_NGINX_CONFIG
echo PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
echo PORT=3002 JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
PORT=3002 JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
cd ../web_proxy
forever start web_proxy.server.js &
cd ../jsbin_proxy
forever start jsbin_proxy.server.js &
cd ../giphy_proxy
forever start giphy_proxy.server.js &

