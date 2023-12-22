# syntax=docker/dockerfile:1.3

# ---------------------------------------------------------------------------
# Frontend Dependencies
# ---------------------------------------------------------------------------

FROM node:20-slim as frontend-deps

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

# ---------------------------------------------------------------------------
# Frontend Build
# ---------------------------------------------------------------------------

FROM frontend-deps AS frontend-build

COPY frontend/. .

RUN npm run build


# ---------------------------------------------------------------------------
# Backend Base
# ---------------------------------------------------------------------------

FROM python:3.10-slim AS backend-base

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1

RUN apt-get update && apt-get install -y curl
RUN apt-get clean autoclean && \
    apt-get autoremove --yes && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/


# ---------------------------------------------------------------------------
# Backend Dependencies
# ---------------------------------------------------------------------------

FROM backend-base AS backend-deps

RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

COPY backend/Pipfile .
COPY backend/Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy


# ---------------------------------------------------------------------------
# Backend Runtime
# ---------------------------------------------------------------------------

FROM backend-base AS backend-runtime

ARG version_file=utils/docker/empty-file-dont-remove

ENV REEV_SERVE_FRONTEND=/home/reev/ui

COPY --from=backend-deps /.venv /.venv
COPY utils/docker/entrypoint-backend.sh \
    utils/docker/entrypoint-celery.sh \
    utils/docker/entrypoint-celerybeat.sh \
    /
RUN chmod +x /entrypoint-backend.sh /entrypoint-celery.sh /entrypoint-celerybeat.sh

ENV PATH="/.venv/bin:$PATH"

RUN useradd --create-home reev
WORKDIR /home/reev
USER reev

COPY ${version_file} /VERSION
COPY backend/. .
COPY --from=frontend-build /dist /home/reev/ui

CMD ["/entrypoint-backend.sh"]
EXPOSE 8080
