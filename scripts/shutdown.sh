sudo nginx -s stop
kill -9 $(ps aux | grep 'node /usr/local/bin/jsbin' | awk '{print $2}')