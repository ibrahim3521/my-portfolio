import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() });
});

app.get('/api/hello/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
