import express from 'express';
import { imageRoutes } from './routes/imageRoutes';

const app = express();
const cors = require('cors');
const port = process.env.PORT || 3006;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use('/uploads', express.static('uploads'));
app.use('/api/images', imageRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
