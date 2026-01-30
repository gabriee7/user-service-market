import express from 'express';
import cors from 'cors';

import routes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
