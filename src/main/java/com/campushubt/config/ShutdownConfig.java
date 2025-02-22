package com.campushubt.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.sql.DataSource;

@Configuration
public class ShutdownConfig {
    private static final Logger logger = LoggerFactory.getLogger(ShutdownConfig.class);
    
    @Autowired
    private DataSource dataSource;

    @PreDestroy
    public void cleanup() {
        logger.info("Application shutdown - cleaning up resources...");
        if (dataSource instanceof HikariDataSource) {
            try {
                ((HikariDataSource) dataSource).getHikariPoolMXBean().softEvictConnections();
                ((HikariDataSource) dataSource).close();
                logger.info("HikariCP connection pool closed successfully");
            } catch (Exception e) {
                logger.error("Error closing HikariCP connection pool", e);
            }
        }
    }
}
