package com.campushubt.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Primary;
import java.sql.Driver;
import java.sql.DriverManager;
import java.util.Enumeration;

@Configuration
public class DatabaseConfig {
    
    @Primary
    @Bean(destroyMethod = "close")
    public DataSource dataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = (HikariDataSource) properties
            .initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();
        
        // Configure the pool
        dataSource.setPoolName("CampusHubTHikariPool");
        dataSource.setMaximumPoolSize(10);
        dataSource.setMinimumIdle(5);
        dataSource.setIdleTimeout(300000);
        dataSource.setConnectionTimeout(20000);
        dataSource.setMaxLifetime(1200000);
        dataSource.setLeakDetectionThreshold(30000);
        
        // Register shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                dataSource.close();
                // Deregister JDBC drivers
                Enumeration<Driver> drivers = DriverManager.getDrivers();
                while (drivers.hasMoreElements()) {
                    Driver driver = drivers.nextElement();
                    try {
                        DriverManager.deregisterDriver(driver);
                    } catch (Exception e) {
                        // Log but continue
                    }
                }
            } catch (Exception e) {
                // Log but continue
            }
        }));
        
        return dataSource;
    }
}