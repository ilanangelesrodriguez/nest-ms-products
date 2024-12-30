import 'dotenv/config';
import * as joi from 'joi';

interface IEnv {
  PORT: number;
}

const envSchema = joi.object({
  PORT: joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnv = value;

export const envs = {
  PORT: envVars.PORT,
}
