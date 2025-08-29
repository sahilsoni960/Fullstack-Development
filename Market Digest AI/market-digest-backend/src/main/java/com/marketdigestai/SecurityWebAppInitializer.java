package com.marketdigestai;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

public class SecurityWebAppInitializer extends AbstractSecurityWebApplicationInitializer {
    // This class intentionally left blank.
    // By extending AbstractSecurityWebApplicationInitializer, we are ensuring that the
    // "springSecurityFilterChain" is registered with the servlet container for every URL.
}
