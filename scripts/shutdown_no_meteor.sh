C5_HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
source $C5_HOME_DIR/scripts/env_config.sh
sudo nginx -s quit
kill -9 $(ps aux | grep 'node /usr/local/bin/jsbin' | awk '{print $2}')
cd ../web_proxy
forever stop web_proxy.server.js &
cd ../jsbin_proxy
forever stop jsbin_proxy.server.js &
cd ../giphy_proxy
forever stop giphy_proxy.server.js &

