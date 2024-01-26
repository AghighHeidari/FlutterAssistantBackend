#!/bin/bash
set -xe

psql -d "postgres" -U aghigh -c "DROP DATABASE IF EXISTS \"flutter_assistant_db\" WITH (force);"  ;
psql -d "postgres" -U aghigh -c "CREATE DATABASE \"flutter_assistant_db\" OWNER aghigh ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0;"  ;
psql -d "postgres" -U aghigh -c "CREATE DATABASE aghigh;"  ;

if [[ "$(uname)" == "Darwin" ]]; then
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	[ -f "$DIR"/flutter_assistant_db.sql ] && psql -d "flutter_assistant_db" -U aghigh -f "$DIR"/flutter_assistant_db.sql ;
fi