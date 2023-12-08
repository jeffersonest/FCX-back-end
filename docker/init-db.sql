CREATE TABLE IF NOT EXISTS public."user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    login VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    cpf VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(255) UNIQUE,
    birth TIMESTAMP NOT NULL,
    "motherName" VARCHAR(255),
    status  VARCHAR NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO public."user" (
    name, login, email, cpf, password, phone, birth, "motherName", status, "createdAt", "updatedAt"
) VALUES (
    'admin', 'admin', 'admin@gmail.com', '0000000000',
    'hashed_password', '00000000000', '2000-03-21 21:00:00', 'admin', TRUE,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
