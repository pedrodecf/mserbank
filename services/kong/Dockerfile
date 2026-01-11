FROM kong:3.5
LABEL maintainer="MSERBank Team"

# Copy declarative configuration
COPY kong.yml /kong/declarative/kong.yml

# Set environment for DB-less mode
ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/kong/declarative/kong.yml

# Expose ports
EXPOSE 8000 8443 8001 8444

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD kong health || exit 1

# Run Kong
CMD ["kong", "docker-start"]
