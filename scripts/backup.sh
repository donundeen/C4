current_time=$(date "+%Y.%m.%d-%H.%M.%S")
mongodump -hlocalhost:27017 -d meteor -o ../dbbackups
cp /usr/local/lib/node_modules/jsbin/jsbin.sqlite ../dbbackups/jsbin.sqlite
