#!/usr/bin/env sh

cd /srv/src/kpi

rm -rf node_modules/ && npm install -g check-dependencies && npm install --quiet && npm cache clean --force

rm -rf jsapp/fonts/ && rm -rf jsapp/compiled/ && npm run copy-fonts && npm run build

python manage.py collectstatic --noinput

source /etc/profile

rsync -aq --delete --chown=www-data "${KPI_SRC_DIR}/staticfiles/" "${NGINX_STATIC_DIR}/"

