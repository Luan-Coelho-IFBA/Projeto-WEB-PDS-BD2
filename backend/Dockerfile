# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Banco de dados
ENV DB_HOST
ENV DB_PORT
ENV DB_USERNAME
ENV DB_PASSWORD
ENV DB_DATABASE

# Autentificação
ENV JWT_SECRET

# Mailer
ENV MAIL_HOST
ENV MAIL_PORT
ENV MAIL_USER
ENV MAIL_PASSWORD
ENV MAIL_FROM=Comunet

# Usuário ADMIN
ENV ADMIN_NAME="ADMIN"
ENV ADMIN_EMAIL="admin@admin.com"
ENV ADMIN_PASSWORD="123456"

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]
