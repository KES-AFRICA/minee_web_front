FROM node:20.10-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to leverage Docker's layer caching
# This step ensures that dependencies are re-installed only if package.json changes
COPY package.json ./

# Install project dependencies
RUN yarn

# Expose the port where the React development server will run
# 5173 is common for Vite, 3000 for Create React App. Adjust if your framework uses a different port.
EXPOSE 5173

# Define the command to run when the container starts
# This will start your React development server
CMD ["yarn", "dev"]