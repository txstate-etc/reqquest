# The demo key declarations are generated from the definitions (see demos/src/keys.generated.d.ts).
# A stale file offers keys that no longer exist, so fail here rather than after minutes of container
# boot. Needs api built: api/dist is bind-mounted and refreshed by the dev stack, but a fresh clone
# will not have it yet.
if [ ! -f api/dist/analysis/cli.js ]; then
  echo "api is not built - run 'npm run build' in api/ (or bring the dev stack up) before ./test.sh" >&2
  exit 1
fi
if ! (cd demos && npm run --silent keys:check); then
  echo "Regenerate with 'npm run keys:generate' in demos/, then re-run ./test.sh" >&2
  exit 1
fi

override=''
if [ -e docker-compose.test.override.yml ]; then
  override='-f docker-compose.test.override.yml'
fi

DEMO_INSTANCE="default" TEST_TAGS="@all|@default" docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override up --build --exit-code-from testing-container
DEFAULT_EXITCODE=$?
docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override down -v

if [ "$DEFAULT_EXITCODE" -eq 1 ]; then
  exit $DEFAULT_EXITCODE
fi

DEMO_INSTANCE="multi" TEST_TAGS="@all|@multi" docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override up --build --exit-code-from testing-container
MULTI_EXITCODE=$?
docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override down -v

if [ "$MULTI_EXITCODE" -eq 1 ]; then
  exit $MULTI_EXITCODE
fi

DEMO_INSTANCE="complex" TEST_TAGS="@all|@complex" docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override up --build --exit-code-from testing-container
COMPLEX_EXITCODE=$?
docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override down -v

exit $COMPLEX_EXITCODE

# RC TODO
#if [ "$COMPLEX_EXITCODE" -eq 1 ]; then
#  exit $COMPLEX_EXITCODE
#fi

#DEMO_INSTANCE="rc" TEST_TAGS="@all|@rc" docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override up --build --exit-code-from testing-container
#RC_EXITCODE=$?
#docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override down -v

#exit $RC_EXITCODE