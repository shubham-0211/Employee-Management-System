FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=Shubham@123
ENV MYSQL_DATABASE=attendance
ENV MYSQL_ROOT_HOST=%

# Ensure MySQL uses native authentication
RUN echo "[mysqld]\ndefault-authentication-plugin=mysql_native_password" > /etc/mysql/conf.d/my.cnf

# Expose the default MySQL port
EXPOSE 3306

# Ensure MySQL starts automatically
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["mysqld"]

