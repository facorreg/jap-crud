import dotenv from 'dotenv';

const envpath = process.env.NODE_ENV;
dotenv.config(envpath ? { path: `./.env.${envpath}` } : {});

const getEnv = (envName, defaultValue) => process.env[envName] || defaultValue;

export default getEnv;
