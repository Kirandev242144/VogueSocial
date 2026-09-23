package com.voguesocial.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFixer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFixer.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and upgrading database column types for high-res images and multi-photo metadata...");
        String[] alterStatements = new String[] {
            "ALTER TABLE products MODIFY COLUMN admin_notes LONGTEXT",
            "ALTER TABLE products MODIFY COLUMN image_url LONGTEXT",
            "ALTER TABLE products MODIFY COLUMN back_image_url LONGTEXT",
            "ALTER TABLE products MODIFY COLUMN description LONGTEXT",
            "ALTER TABLE website_settings MODIFY COLUMN description LONGTEXT",
            "ALTER TABLE website_settings MODIFY COLUMN logo_url LONGTEXT",
            "ALTER TABLE website_settings MODIFY COLUMN hero_image LONGTEXT",
            "ALTER TABLE profiles MODIFY COLUMN description LONGTEXT",
            "ALTER TABLE profiles MODIFY COLUMN logo_url LONGTEXT"
        };

        for (String sql : alterStatements) {
            try {
                jdbcTemplate.execute(sql);
                log.info("Successfully executed database schema upgrade: {}", sql);
            } catch (Exception e) {
                log.warn("Database schema upgrade notice for [{}]: {}", sql, e.getMessage());
            }
        }
    }
}
