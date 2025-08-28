import { ConnectOptions } from 'mongoose';

const config = {
    db: {
        host: process.env.MONGODB_HOST || '127.0.0.1',
        port: parseInt(process.env.MONGODB_PORT || '27017'),
        name: process.env.MONGODB_NAME || 'users_dev',
    },
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 50,
    } as ConnectOptions,
};

export default config; 