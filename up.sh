DEMO_INSTANCE="default"

while getopts ":dsmc" opt
do
  case "$opt" in
    d) DEMO_INSTANCE="default";;
    s) DEMO_INSTANCE="simple";;
    m) DEMO_INSTANCE="multi";;
    c) DEMO_INSTANCE="complex";;
  esac
done

DEMO_INSTANCE=${DEMO_INSTANCE} docker-compose up --build
