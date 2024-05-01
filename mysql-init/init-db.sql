USE app_users;

CREATE TABLE users (
    id          INT         AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(18) NOT NULL    UNIQUE,
    password    VARCHAR(20) NOT NULL,
    is_enabled  BOOLEAN     NOT NULL,
    is_admin    BOOLEAN     NOT NULL
)