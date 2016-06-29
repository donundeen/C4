C5_HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
source $C5_HOME_DIR/scripts/env_config.sh
echo sudo nginx -c $C5_NGINX_CONFIG 
sudo nginx -c $C5_NGINX_CONFIG
echo PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
PORT=3003 JSBIN_CONFIG=$C5_JSBIN_EMBED_CONFIG JSBIN_PROXY=on jsbin &
echo JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
JSBIN_CONFIG=$C5_JSBIN_API_CONFIG jsbin &
cd ../web_proxy
MONGOPORT=3001 forever start --minUptime=1 web_proxy.server.js &
cd ../jsbin_proxy
MONGOPORT=3001 forever start --minUptime=1 -c /Users/donundeen/.nvm/versions/node/v5.7.1/bin/node jsbin_proxy.server.js &
cd ../giphy_proxy
forever start giphy_proxy.server.js &
cd ../elasticsearch_proxy
forever start elasticsearch_proxy.server.js &
/usr/local/bin/elasticsearch -Des.path.conf=/Users/donundeen/htdocs/C5/server_configs/elasticsearch &
cd ../meteor/C5
export METEOR_OFFLINE_CATALOG=1
METEOR_OFFLINE_CATALOG=1 meteor
