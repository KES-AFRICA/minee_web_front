FROM node:20.10-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to leverage Docker's layer caching
# This step ensures that dependencies are re-installed only if package.json or yarn.lock changes
COPY package.json yarn.lock ./

# Install project dependencies
# Use --frozen-lockfile to ensure exact dependency versions as per yarn.lock
RUN yarn install --frozen-lockfile

# Expose the port where the React development server will run
# 5173 is common for Vite, 3000 for Create React App. Adjust if your framework uses a different port.
EXPOSE 5173

# Define the command to run when the container starts
# This will start your React development server
CMD ["yarn", "dev"]