C5_HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
source $C5_HOME_DIR/scripts/env_config.sh
sudo nginx -c $C5_HOME_DIR/server_configs/nginx/nginx.conf
echo PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
echo JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
cd ../web_proxy
node web_proxy.server.js &
cd ../jsbin_proxy
node jsbin_proxy.server.js &
cd ../giphy_proxy
node giphy_proxy.server.js &
cd ../meteor/C4
meteor
