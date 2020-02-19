ARG PLATFORM
FROM --platform=${PLATFORM} vibioh/viws:light

ARG VERSION
COPY dist/ /www/
