#!/bin/bash
source .config

echo -n '{"data":"' > xml.json
echo -n "$(cat pack.xml)" | sed "s/\"/\\\\\\\"/g" >> xml.json
echo -n '"}' >> xml.json

sed ':a;N;$!ba;s/\n/\\n/g' xml.json > xmlxml.json

curl -X PUT -H "Content-Type: application/json" --header "API-KEY: $API_KEY" -d '@xmlxml.json' https://api.atlauncher.com/v1/admin/pack/$PACK/versions/$VERSION/xml

rm xml.json
rm xmlxml.json

echo

cd configs/
zip -q -r ../configs.zip *
cd ../

echo -n '{"data":"' > configs.json
base64 -n 0 configs.zip >> configs.json
echo -n '"}' >> configs.json

awk '{ printf "%s", $0 }' configs.json > configszip.json

curl -X PUT -H "Content-Type: application/json" --header "API-KEY: $API_KEY" -d '@configszip.json' https://api.atlauncher.com/v1/admin/pack/$PACK/versions/$VERSION/configs

rm configs.zip
rm configs.json
rm configszip.json