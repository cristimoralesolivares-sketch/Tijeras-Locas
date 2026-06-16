import express from 'express';
import path from 'path';
import fs from 'fs';
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

  // Treat as production if explicitly on Render, if NODE_ENV is production, or if running the compiled server.
  // This allows the Vite dev server with live-rebuild to handle local development beautifully.
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    !!process.env.RENDER ||
    (typeof __filename !== 'undefined' && __filename.endsWith('server.cjs')) ||
    (typeof __dirname !== 'undefined' && __dirname.includes('dist'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Find the 'dist' directory by checking multiple robust paths.
    // In production (Render), this server runs from a compiled CJS file (`dist/server.cjs`) inside the `dist` folder itself.
    // In local dev, it could run from the root folder.
    const possiblePaths = [
      path.join(process.cwd(), 'dist'),
      path.join(__dirname),
      path.join(__dirname, '..'),
      path.join(__dirname, '../dist'),
      path.join(__dirname, 'dist'),
      process.cwd()
    ];
    
    let distPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(path.join(p, 'index.html')) && fs.existsSync(path.join(p, 'assets'))) {
        distPath = p;
        break;
      }
    }
    
    if (!distPath) {
      // Fallback if index.html can't be found
      distPath = path.join(process.cwd(), 'dist');
    }

    console.log('--- Production Server Environment Diagnostics ---');
    console.log(`process.cwd(): ${process.cwd()}`);
    console.log(`__dirname: ${typeof __dirname !== 'undefined' ? __dirname : 'undefined'}`);
    console.log(`Resolved distPath: ${distPath}`);
    console.log(`dist/index.html exists: ${fs.existsSync(path.join(distPath, 'index.html'))}`);
    try {
      if (fs.existsSync(distPath)) {
        console.log(`Contents of distPath:`, fs.readdirSync(distPath));
      }
    } catch (e) {
      console.error('Error reading distPath contents:', e);
    }
    console.log('-------------------------------------------------');

    app.use(express.static(distPath));
    
    // Serve index.html for all other routes to keep React Router / SPA behaviors intact
    app.get('*', (req, res) => {
      // Avoid sending index.html for missing assets/files with extensions
      // to prevent "Unexpected token '<'" crash on client. Instead, send a proper 404.
      if (req.path.includes('.') || req.path.startsWith('/api/')) {
        res.status(404).send('Not Found');
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Production server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
