#!/bin/sh
cd /usr/share/nginx/html
ALL_PUBLIC_VARS=$(printf '${%s} ' $(env | cut -d'=' -f1 | grep -E '^PUBLIC_'))
grep --line-buffered -Rl . -e '$PUBLIC_' | while read line; do
  envsubst "$ALL_PUBLIC_VARS" < $line > $line.tmp
  mv $line.tmp $line
  brotli -f $line
  gzip -fk $line
done
exit 0
