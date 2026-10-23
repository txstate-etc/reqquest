#!/bin/sh
# Packs @reqquest/ui and builds test-fixture/ against the tarball exactly as a downstream project
# would: @reqquest/ui is its only dependency, there is no svelte/vite config, and the routes come from
# the package's app shell plus the fixture's overlay. Run from ui/ with node 22+.
#
# Asserts: file override, folder replace, added route, disabled route, the drift lock in --strict
# mode, and that a conflicting svelte cannot reach a build.
set -eu

UI=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

fail () { echo "FAIL: $*" >&2; exit 1; }

npm pack --pack-destination "$WORK" --silent >/dev/null
TARBALL=$(ls "$WORK"/reqquest-ui-*.tgz)
cp -R "$UI/test-fixture" "$WORK/app"
cd "$WORK/app"
npm install --no-audit --no-fund --silent "$TARBALL"

BASE=node_modules/@reqquest/ui/app/src/routes
[ -d "$BASE/roles/users" ] || fail "fixture expects a base route roles/users to disable"

# a faithful override: the base page plus a marker, generated so it never goes stale against the base
mkdir -p src/routes/requests
sed 's#</script>#</script>\n<p>FIXTURE-OVERRIDE</p>#' "$BASE/requests/+page.svelte" > src/routes/requests/+page.svelte
npx reqquest-ui sync
[ -f reqquest-overrides.lock.json ] || fail "sync did not write the overrides lockfile"

npx reqquest-ui build
grep -rqF FIXTURE-OVERRIDE build/_app || fail "override of requests/+page.svelte not in the build"
grep -rqF FIXTURE-ADDED-ROUTE build/_app || fail "added route reports/ not in the build"
grep -rqF FIXTURE-REPLACED-FOLDER build/_app || fail "replaced announcement/ page not in the build"
[ ! -e .reqquest/src/routes/announcement/+page.ts ] || fail "folder replace kept the base +page.ts"
[ ! -e .reqquest/src/routes/roles/users ] || fail "disabled route roles/users still present"
[ -f build-runtime/nginx.conf ] && [ -f build-runtime/apply-env.sh ] || fail "runtime files missing from build-runtime/"

chmod u+w "$BASE/requests/+page.svelte"
echo '<!-- simulated upstream change -->' >> "$BASE/requests/+page.svelte"
if npx reqquest-ui sync --strict 2>/dev/null; then fail "sync --strict accepted a drifted override"; fi
npx reqquest-ui sync --accept >/dev/null
npx reqquest-ui sync --strict >/dev/null || fail "sync --strict still failing after --accept"

# npm only WARNS when the project itself declares a svelte that conflicts with the exact peer pin, and
# installs it anyway - so the version guard in sync is what actually stops the drift
npm install --no-audit --no-fund --silent svelte@5.0.0 2>/dev/null
if npx reqquest-ui sync 2>/dev/null; then fail "sync accepted svelte 5.0.0 over @reqquest/ui's pinned version"; fi

echo "overlay fixture: all assertions passed"
