########################################################################################################################
#                                                                                                                      #
#                                                                                                                      #
# Mandatory build parameters                                                                                           #
#     API_URL - The absolute URL to the base location of the API                                                    #
#                                                                                                                      #
#                                                                                                                      #
########################################################################################################################

# Build the react app for the production
FROM node:18.19-alpine as build
LABEL org.label-schema.schema-version="1.0.0" \
      org.label-schema.vendor="Croonus" \
      org.label-schema.name="croonus.ecommerce-admin"

# Build parameters
ARG API_URL

# Build the application
WORKDIR /app
COPY . /app
RUN echo && \
    echo "Config:" && \
	echo "    API_URL: ${API_URL:?Please provide API_URL as a build argument}" && \
    \
    # Write to environment file
    echo "REACT_APP_URL=$API_URL" > /app/.env.production && \
    echo "NODE_ENV=production" >> /app/.env.production && \
    \
    echo && \
    echo "Environment:" && cat /app/.env.production && \
    \
	npm ci --only=production && \
	npm run build

# Serve the build folder via nginx
FROM nginx:1.17.8-alpine as nginx
ENV TZ=Europe/Belgrade

# Copy all files
COPY deploy/docker /
COPY --from=build /app/build /var/www

# Run
EXPOSE 80
ENTRYPOINT nginx -g 'daemon off;'
