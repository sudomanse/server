# node version
FROM node:10.16.3

# create a new user
RUN useradd -ms /bin/bash sudomansevensxyz

# change working dir to app dir
RUN mkdir -p /home/sudomansevensxyz/app/node_modules
RUN mkdir -p /home/sudomansevensxyz/app/keys
RUN chown -R sudomansevensxyz:sudomansevensxyz /home/sudomansevensxyz/app

# user navigate to directory
USER sudomansevensxyz
WORKDIR /home/sudomansevensxyz/app

# copy required files to start deploying
COPY --chown=sudomansevensxyz:sudomansevensxyz ./src /home/sudomansevensxyz/app/src
COPY --chown=sudomansevensxyz:sudomansevensxyz ./.env /home/sudomansevensxyz/app/.env
COPY --chown=sudomansevensxyz:sudomansevensxyz ./ormconfig.json /home/sudomansevensxyz/app/ormconfig.json
COPY --chown=sudomansevensxyz:sudomansevensxyz ./tsconfig.json /home/sudomansevensxyz/app/tsconfig.json
COPY --chown=sudomansevensxyz:sudomansevensxyz package*.json ./
COPY --chown=sudomansevensxyz:sudomansevensxyz ./keys/public.key /home/sudomansevensxyz/app/keys/public.key
COPY --chown=sudomansevensxyz:sudomansevensxyz ./keys/private.key /home/sudomansevensxyz/app/keys/private.key
# install all reaquired packages
RUN npm install

# get build args
ARG server_debug
ARG server_port

ARG bodyparser_json_limit

ARG bcrypt_salt_rounds

ARG jwt_private_key_location
ARG jwt_public_key_location

ARG mqtt_connection_string
ARG mqtt_topic_input
ARG mqtt_topic_output

# envirnment variables
ENV SERVER_DEBUG=$server_debug
ENV SERVER_PORT=$server_port

ENV BODYPARSER_JSON_LIMIT=$bodyparser_json_limit

ENV JWT_PRIVATE_KEY_LOCATION=$jwt_private_key_location
ENV JWT_PUBLIC_KEY_LOCATION=$jwt_public_key_location

ENV MQTT_CONNECT_STRING=$mqtt_connection_string
ENV MQTT_TOPIC_INPUT=$mqtt_topic_input
ENV MQTT_TOPIC_OUTPUT=$mqtt_topic_output

# build project
RUN npm run build

# expose port
EXPOSE $server_port

# launch
CMD ["node", "/home/sudomansevensxyz/app/dist/server.js"]