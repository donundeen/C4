mongorestore -hlocalhost:3001 -d meteor  ../dbbackups/meteor
cp /usr/local/lib/node_modules/jsbin/jsbin.sqlite ../dbbackups/jsbin.sqlite.orig
sudo cp ../dbbackups/jsbin.sqlite  /usr/local/lib/node_modules/jsbin/jsbin.sqlite
