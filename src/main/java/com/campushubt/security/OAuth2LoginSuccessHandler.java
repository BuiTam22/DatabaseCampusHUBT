package com.campushubt.security;

import com.campushubt.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenProvider tokenProvider;
    
    @Value("${app.oauth2.redirectUri}")
    private String clientUrl;

    @Autowired
    public OAuth2LoginSuccessHandler(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      Authentication authentication) throws IOException {
        User user = (User) authentication.getPrincipal();
        String token = tokenProvider.generateToken(UserDetailsImpl.build(user));
        
        String targetUrl = UriComponentsBuilder.fromUriString(clientUrl)
                .queryParam("token", token)
                .build().toUriString();
                
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}