sudo nginx -s stop
kill -9 $(ps aux | grep 'node /usr/local/bin/jsbin' | awk '{print $2}')
kill -9 $(ps aux | grep 'jsbin_proxy' | awk '{print $2}')
kill -9 $(ps aux | grep 'web_proxy' | awk '{print $2}')