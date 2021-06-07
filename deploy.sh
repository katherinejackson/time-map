#!/bin/sh

# install dependencies
sudo npm i

# create new build folder
npm run build

# stop nginx  server
sudo systemctl stop nginx

# clear old assets
rm -rf /var/www/timemap/

# copy new assets
cp -a build/. /var/www/timemap/

# restart nginx server
sudo systemctl start nginx

echo "Deploy complete successfully"
