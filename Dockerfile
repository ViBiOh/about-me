FROM node:10 as builder

ENV APP_NAME ui
ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN npm install \
 && npm run build \
 && mkdir -p /app \
 && cp -r dist/ /app/

FROM vibioh/viws

COPY --from=builder /app/dist/ /www/
