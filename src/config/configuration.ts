export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
      host: process.env.POSTGRES_HOST || `postgresql-srv`,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 8080,
      password: process.env.POSTGRES_PASSWORD
    }
  });