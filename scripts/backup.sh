current_time=$(date "+%Y.%m.%d-%H.%M.%S")
/Applications/AMPPS/mongodb/bin/mongodump -hlocalhost:3001 -d meteor -o ../dbbackups
cp /usr/local/lib/node_modules/jsbin/jsbin.sqlite ../dbbackups/jsbin.sqlite