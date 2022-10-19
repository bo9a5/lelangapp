const config = {
  env: 'production',
  // env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: "mongodb+srv://lelangapp:teslelang1@clusterlelang.egs1xc2.mongodb.net/?retryWrites=true&w=majority"
  // mongoUri: process.env.MONGODB_URI ||
  //   process.env.MONGO_HOST ||
  //   'mongodb://' + (process.env.IP || 'localhost') + ':' +
  //   (process.env.MONGO_PORT || '27017') +
  //   '/lelangapp'
}

export default config
