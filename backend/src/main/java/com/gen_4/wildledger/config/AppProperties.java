package com.gen_4.wildledger.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app")
@Configuration
public class AppProperties {

    private RateLimit rateLimit = new RateLimit();

    private Storage storage = new Storage();

    @Data
    public static class RateLimit {
        private int maxRequestsPerMinute = 10;
        private long windowMs = 60_000;
    }

    @Data
    public static class Storage{
        private String uploadDir = ".";
        private int maxFileSize = 10_000;
    }
    
}
