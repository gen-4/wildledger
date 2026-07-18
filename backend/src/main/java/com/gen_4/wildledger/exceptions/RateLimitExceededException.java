package com.gen_4.wildledger.exceptions;

public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException(String message) {
        super(message);
    }
    
}
