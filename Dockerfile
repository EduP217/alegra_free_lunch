FROM node:14

WORKDIR /
COPY services/ ./
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
