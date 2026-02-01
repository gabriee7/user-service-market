import schemas from './components/schemas.js';
import { userPaths } from './views/paths.js';

const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'User Microservice Market API',
    version: '1.0.0',
    description: 'API Microservices para gestão de usuários no Market'
  },
  components: { schemas },
  paths: userPaths
};

export default openapi;