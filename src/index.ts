import express from 'express';
import http from 'http';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
export const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(express.json());

app.use('/api', userRoutes);

interface User {
  id: number;
  username: string;
  gender: string;
  country: string;
}

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Catch 404 errors for routes not found
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Catch 500 errors globally
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  },
);
