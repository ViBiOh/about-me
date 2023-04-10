FROM vibioh/viws

ENV VIWS_CSP "default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net/npm/normalize.css@8.0.0/"
ENV VIWS_HEADERS X-UA-Compatible:ie=edge,content-language:fr

ARG VERSION
ENV VERSION=${VERSION}

COPY dist/ /www/
