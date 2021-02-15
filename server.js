import { getEnv } from '@utils';

import app from './app';
// server.applyMiddleware({ app });
const PORT = getEnv('PORT');

const localUrl = `http://localhost:${PORT}`;

app.listen({ port: PORT }, () => console.info(`🚀 Server ready at ${localUrl}`));
