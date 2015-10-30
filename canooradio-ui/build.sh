#!/bin/sh
echo "--- Start UI build ---"
cd canooradio-ui

echo "-Npm-"
npm install &&
echo ""

echo "-Browserify-"
browserify js/app.js -o public/dist/app.js &&
echo ""

echo "-Sass-"
node-sass sass/canooradio.scss public/dist/canooradio.css
echo ""

echo "Remove and Copy static Content"
if [ -d "../canooradio-server/src/main/resources/static" ]; then
rm -r ../canooradio-server/src/main/resources/static
fi
cp -r public ../canooradio-server/src/main/resources/static
