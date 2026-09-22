package com.voguesocial.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vogueSocialOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("VogueSocial Platform and Engine API")
                        .description("Interactive REST API documentation for VogueSocial Virtual Try-On, Personal Wardrobe, Merchant Storefronts, and Products.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("VogueSocial Support")
                                .email("support@voguesocial.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("http://localhost:8085").description("Active Local Backend (Port 8085)")
                ));
    }
}
