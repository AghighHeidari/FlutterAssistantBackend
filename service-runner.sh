#!/bin/sh


args=""

file=$1 # crawling-services/crawling-service.js
method=$2

shift 2

for arg in "$@"; do
    args="$args\"$arg\","
done

TS_FILE="temp.ts"
touch "$TS_FILE"

cat <<EOF > "$TS_FILE"
import * as file from './service/$file';
file.default.getInstance().$method($args).then((r: any) => process.exit(0)).catch((e: any) => {console.error(e);process.exit(1);});
EOF


node --loader ts-node/esm temp.ts

rm "$TS_FILE"