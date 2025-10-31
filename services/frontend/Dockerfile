# Use the official Nginx image from Docker Hub
FROM nginx:1.23-alpine

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config file to the correct location
COPY nginx.conf /etc/nginx/conf.d/

# Explicitly copy our application files to the web root
COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
COPY app.js /usr/share/nginx/html