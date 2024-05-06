FROM redis:latest

# Copy custom entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]