# base image
FROM cypress/base:20.14.0

# set working directory
WORKDIR /e2e

# Copy our test page and test files
COPY cypress.config.js ./
COPY package.json ./
COPY cypress ./cypress
# Install npm dependencies, can also use "npm ci"
RUN npm install


# confirm the cypress install
RUN ./node_modules/.bin/cypress verify
ENV FOLDER=""
CMD ["sh", "-c", "npx cypress run --record --spec ${FOLDER}]