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

exit $MULTI_EXITCODE ###TODO:  Remove post complex implementation

####TODO - After complex demo instance up
#DEMO_INSTANCE="complex" TEST_TAGS="@all|@complex" docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override up --build --exit-code-from testing-container
#COMPLEX_EXITCODE=$?
#docker-compose -p "$(basename $PWD)-test" -f docker-compose.test.yml $override down -v

#exit $COMPLEX_EXITCODE