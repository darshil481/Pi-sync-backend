import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port({ default: 3000 }),            
    DATABASE_URL: str(),                    
  });
};

export default validateEnv;
