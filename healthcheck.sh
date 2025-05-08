export MYSQL_PWD="${MYSQL_PASSWORD:-$MYSQL_ROOT_PASSWORD}"

args=(
	# force mysql to not use the local "mysqld.sock" (test "external" connectibility)
	-h"127.0.0.1"
	-u"${MYSQL_USER:-root}"
	--silent
)

if select="$(echo "USE ${MYSQL_DATABASE}; SELECT 1" | mysql "${args[@]}")" && [ "$select" = '1' ]; then
	exit 0
fi

exit 1
