-- Runs once, on the first start of an empty MySQL volume.
-- Lets the app user create Prisma's temporary "shadow" database during `prisma migrate dev`.
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE ON *.* TO 'petal'@'%';
FLUSH PRIVILEGES;
