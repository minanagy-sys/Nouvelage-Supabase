-- ============================================================================
-- NOUVELAGE — admin tables (replaces Supabase GoTrue auth.users)
-- Applied by setup-db.js after schema.sql.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Admin accounts. Passwords are bcrypt hashes (cost 12), created only via
-- backend/scripts/create-admin.js which reads ADMIN_PASSWORD from the
-- environment — never from argv.
CREATE TABLE IF NOT EXISTS admin_users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(200) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  name          VARCHAR(200) NOT NULL,
  role          VARCHAR(30)  NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at TIMESTAMP    NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Append-only trail of admin actions (logins, CRUD writes, status changes).
CREATE TABLE IF NOT EXISTS activity_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id CHAR(36)        NULL,
  action        VARCHAR(50)     NOT NULL,
  resource      VARCHAR(50)     NOT NULL,
  resource_id   VARCHAR(100)    NULL,
  details       JSON            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_activity_user    (admin_user_id, created_at),
  KEY ix_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
