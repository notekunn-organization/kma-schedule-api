FROM node:lts

WORKDIR /app
COPY . .
RUN npm install
RUN chown -R node:node /app
USER node
RUN npm run build

EXPOSE 3000
CMD npm start