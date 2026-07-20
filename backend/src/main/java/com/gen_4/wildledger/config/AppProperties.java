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

    private S3 s3 = new S3();

    @Data
    public static class RateLimit {
        private int maxRequestsPerMinute = 10;
        private long windowMs = 60_000;
    }

    @Data
    public static class Storage{
        private int maxFileSize = 10_000;
    }

    @Data
    public static class S3{
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String region;
    }
    
}
