export default () => ({
  isDev: process.env.NODE_ENV === 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.POSTGRES_HOST || `postgres-srv`,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'test',
    username: process.env.POSTGRES_USER || 'root'
  },
  cryptoApi: {
    lastPrice: 'https://cex.io/api/last_price',
    chart: 'https://cex.io/api/price_stats'
  }
});
