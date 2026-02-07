package com.shopping.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.CodeSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.stream.IntStream;

@Aspect
@Component
public class EndpointLoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(EndpointLoggingAspect.class);

    @Before("@annotation(com.shopping.logging.LogEndpointRequest)")
    public void logRequest(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().toShortString();

        Object[] args = joinPoint.getArgs();
        String[] paramNames = ((CodeSignature) joinPoint.getSignature()).getParameterNames();

        StringBuilder sb = new StringBuilder("Called ").append(methodName).append(" with parameters: ");

        IntStream.range(0, args.length)
                .forEach(i -> sb.append(paramNames[i]).append("=").append(args[i]).append("; "));

        logger.info(sb.toString());
    }

    @AfterReturning(pointcut = "@annotation(com.shopping.logging.LogEndpointRequest)", returning = "result")
    public void logResponse(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("Method {} returned: {}", methodName, result);
    }
}
