# Next Level Week 17 - Back-End Application

This repository contains the code for building the back-end of the application developed during the 17th edition of the Next Level Week, held from September 9 to 11, 2024. In this workshop, we explored various technologies to create the back-end of an application using Node.js and other modern tools.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side execution.
- **Fastify**: A fast and efficient framework for building APIs.
- **Zod**: A schema validation library.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **Drizzle ORM**: ORM for database management.
- **PostgreSQL**: Relational database.

## Project Context

During the workshop, we developed the back-end for an application that allows for goal management. Key features include:

- **Create Goals**: Define goals to be achieved.
- **Pending Goals**: View goals that have not yet been completed.
- **Complete Goals**: Mark goals as completed.

## Setup and Execution Instructions

### Prerequisites

Ensure the following are installed:

- Docker
- Docker Compose
- Node.js (for local development and execution)

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/paullosergio/NLW-InOrbit.git
   cd server
   ```

2. **Create a `.env` File or rename `.env.exemple` to `.env`**

   Create a `.env` file at the root of the project and add the following variables:

   ```env
    DATABASE_URL="postgresql://docker:docker@db:5432/inorbit"
    POSTGRESQL_USERNAME="docker"
    POSTGRESQL_PASSWORD="docker"
    POSTGRESQL_DATABASE="inorbit"
   ```

### Dockerfile

The Dockerfile is used to build the Docker image for the application. It performs the following steps:

1. **Environment Setup**

   ```Dockerfile
    FROM node:20.17-alpine
    WORKDIR /app

    COPY package*.json ./
    COPY scripts/init.sh /app/scripts/init.sh

    RUN npm install

    COPY . .

    EXPOSE 3333
   ```

   - **Base Image**: Uses `node:20.17-alpine` as the base image.
   - **Working Directory**: Sets the working directory to `/app`.
   - **Copy Files**: Copies `package*.json` and the `init.sh` script.
   - **Permissions**: Changes the permissions of the `init.sh` script to be executable.
   - **Install Dependencies**: Runs `npm install` to install dependencies.
   - **Copy Remaining Code**: Copies the rest of the files into the container.
   - **Expose Port**: Exposes port 3333.

### Docker Compose

Docker Compose is used to orchestrate the database and application containers.

1. **`docker-compose.yml` File**

   ```yaml
    name: pocket-js-server

    services:
      db:
        image: bitnami/postgresql:13.16.0
        ports:
          - 5432:5432
        environment:
          - POSTGRESQL_USERNAME=${POSTGRESQL_USERNAME}
          - POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD}
          - POSTGRESQL_DATABASE=${POSTGRESQL_DATABASE}
        volumes:
          - dbdata:/bitnami/postgresql

      app:
        build:
          context: .
        environment:
          - DATABASE_URL=${DATABASE_URL}
        ports:
          - "3333:3333"
        depends_on:
          - db
        volumes:
          - .:/app
        entrypoint: ["sh", "-c", "chmod +x /app/scripts/init.sh && /app/scripts/init.sh"]

    volumes:
      dbdata:
        driver: local

   ```

   - **`db` Service**: Configures the PostgreSQL container.
   - **`app` Service**: Builds and runs the application container, executing the `init.sh` script.

### Execution

1. **Build and Run Containers**

   Use Docker Compose to build and run the containers:

   ```bash
   docker-compose up --build
   ```

   This will start the PostgreSQL database and the Node.js application.

2. **Manual Script Execution**

   If you need to run the script manually, use the following command:

   ```bash
   docker-compose exec app ./scripts/init.sh
   ```

### Scripts

- **`scripts/init.sh`**: Script to apply migrations and start the server. The script waits until the database is available before applying migrations and running seeding.

### Commands

- **`npm run migration`**: Applies database migrations.
- **`npm run seed`**: Populates the database with initial data.
- **`npm run dev`**: Starts the development server.