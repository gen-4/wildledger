package com.gen_4.wildledger.exceptions;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class ExceptionLoggingAspect {
    @Around("@annotation(org.springframework.web.bind.annotation.ExceptionHandler)")
    public Object logException(ProceedingJoinPoint joinPoint) throws Throwable {
        Exception ex = (Exception) joinPoint.getArgs()[0];
        log.error("Exception handled: {}", ex.getMessage(), ex);
        return joinPoint.proceed();
    }
}
