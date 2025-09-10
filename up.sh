API_INSTANCE="testserver"
UI_INSTANCE="ui"
while getopts ":smc" opt
do
  case "$opt" in
    s) API_INSTANCE="demos/simple/api"; UI_INSTANCE="demos/simple/ui";;
    m) API_INSTANCE="demos/multi/api"; UI_INSTANCE="demos/multi/ui";;
    c) API_INSTANCE="demos/complex/api"; UI_INSTANCE="demos/complex/ui";;
  esac
done

API_INSTANCE=${API_INSTANCE} UI_INSTANCE=${UI_INSTANCE} docker-compose up --build
