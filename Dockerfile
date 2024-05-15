# Use the official latest Node.js image as a base
FROM node:18.16.0-alpine3.17

# Set the working directory inside the container to be /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN if [ "$NODE_ENV" = "development" ];\
        then npm install; \
        else npm install --only=production; \
        fi

# Copy the rest of the application code
COPY . .

# Build TypeScript code with increased memory limit
RUN --max-old-space-size=4096 npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["node", "dist/index.js"]



# # Use the official latest Node.js image as a base
# FROM node:18.16.0-alpine3.17

# # Set the working directory inside the container to be the /aypp
# WORKDIR /app

# # Copy package.json to the working directory
# COPY package.json ./

# # Install dependencies
# RUN if [ "$NODE_ENV" = "development" ];\
#         then npm install; \
#         else npm install --only=production; \
#         fi

# # Copy the rest of the application code
# COPY . ./

# # Build TypeScript code
# RUN --max-old-space-size=4096 npm run build

# # Expose the port your app runs on
# EXPOSE 5000

# # Command to run your app
# CMD ["node","dist/index.js"]

