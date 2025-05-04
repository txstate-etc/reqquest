npx @genql/cli \
  --endpoint http://localhost:81/graphql \
  --output ./ui/src/lib/typed-client \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InJlcXF1ZXN0In0.RospyAXNt1NZeTrFPe_na3qgCiJhZEsV-akNg1EQHko" \
  -S DateTime:string \
  -S UrlSafeString:string \
  -S JsonData:"Record<string, any>"
