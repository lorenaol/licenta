package com.internship.epayment.config;

import com.internship.epayment.enums.AuthorityEnum;
import com.internship.epayment.security.CustomAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    CustomAuthenticationProvider authenticationProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider);

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
                .httpBasic()
            .and()
                .cors()
            .and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/**").permitAll()
//                .antMatchers("/api/reviews/**").permitAll()
//                .antMatchers(HttpMethod.POST,"/api/users/**").permitAll()
//                .antMatchers(HttpMethod.GET, "/api/users/findByEmail/**").permitAll()
//                .antMatchers(HttpMethod.POST, "/api/tests/**").hasAuthority(AuthorityEnum.TUTOR.getCode())
//                .antMatchers("/api/users/forgot-password/**").permitAll()
//                .antMatchers("/api/users/reset-password/**").permitAll()
//                .antMatchers("/api/**").hasAuthority(AuthorityEnum.EPAY_ADMIN.getCode())
                .anyRequest().permitAll();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
