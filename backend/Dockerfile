# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Banco de dados
ENV DB_HOST=ep-raspy-waterfall-acio1ghy-pooler.sa-east-1.aws.neon.tech
ENV DB_PORT=5432
ENV DB_USERNAME=neondb_owner
ENV DB_PASSWORD=npg_frOa6PM2gZUI
ENV DB_DATABASE=neondb

# Autentificação
ENV JWT_SECRET=7b253dc9affca552ffad80803e8a3dbaa0cf09693c80fec20dfea1f23a531dd4f0b925f66aa653643fc90c2a8979c586405662c32806846d41e18fc6ab8c5e0e

# Mailer
ENV MAIL_HOST=smtp.gmail.com
ENV MAIL_PORT=587
ENV MAIL_USER=luancgoes100@gmail.com
ENV MAIL_PASSWORD="heez gcel ydjv bxoa"
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
