import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  
  // Render dynamically registers a PORT at runtime.
  // We use process.env.PORT or default to 3000 for AI Studio compatibility.
  const PORT = process.env.PORT || 3000;

  // Expose a basic health-check endpoint for Render's liveness/readiness probes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Tijeras Locas' });
  });

  // Treat as production if NODE_ENV is 'production' OR if running on Render (process.env.RENDER) OR if NODE_ENV is unset (such as production servers)
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER || !process.env.NODE_ENV;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Determine the absolute path to the 'dist' directory.
    // On production (Render), this server runs as a compiled CJS file (`dist/server.cjs`) inside the `dist` folder itself.
    // In local dev, it runs from the root folder.
    let distPath = path.join(process.cwd(), 'dist');
    try {
      if (typeof __dirname !== 'undefined') {
        distPath = __dirname.endsWith('dist') ? __dirname : path.join(__dirname, 'dist');
      }
    } catch {
      // Fallback to process.cwd() if __dirname is not defined
    }

    app.use(express.static(distPath));
    // Serve index.html for all other routes to keep React Router / SPA behaviors intact
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Production server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
