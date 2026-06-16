import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdminClient = supabaseUrl && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

async function startServer() {
  const app = express();
  
  app.use(express.json());
  
  // Render dynamically registers a PORT at runtime.
  // We use process.env.PORT or default to 3000 for AI Studio compatibility.
  const PORT = process.env.PORT || 3000;

  // Expose a basic health-check endpoint for Render's liveness/readiness probes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Tijeras Locas' });
  });

  // Secure endpoint to list users (strictly admin authorized)
  app.get('/api/admin/users', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Falta token de autorización' });
        return;
      }
      const token = authHeader.split(' ')[1];

      if (!supabaseAdminClient) {
        res.status(500).json({ error: 'El Service Role Key de Supabase no está configurado en el servidor.' });
        return;
      }

      const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);
      if (authError || !user) {
        res.status(401).json({ error: 'Acceso no autorizado: Token inválido' });
        return;
      }

      const role = user.user_metadata?.role;
      if (role !== 'admin') {
        res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
        return;
      }

      const { data: { users }, error: listError } = await supabaseAdminClient.auth.admin.listUsers();
      if (listError) {
        res.status(400).json({ error: listError.message });
        return;
      }

      // Map users into standard types for display
      const mappedUsers = users.map((u: any) => ({
        id: u.id,
        name: u.user_metadata?.name || u.email?.split('@')[0] || 'Sin Nombre',
        phone: u.user_metadata?.phone || 'Sin Teléfono',
        email: u.email || '',
        role: u.user_metadata?.role || 'cliente',
        created_at: u.created_at
      }));

      res.json({ users: mappedUsers });
    } catch (err: any) {
      console.error('Error fetching admin users:', err);
      res.status(500).json({ error: err.message || err });
    }
  });

  // Secure endpoint to create staff or admin users (strictly admin authorized)
  app.post('/api/admin/create-user', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Falta token de autorización' });
        return;
      }
      const token = authHeader.split(' ')[1];

      if (!supabaseAdminClient) {
        res.status(500).json({ error: 'El Service Role Key de Supabase no está configurado.' });
        return;
      }

      const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);
      if (authError || !user) {
        res.status(401).json({ error: 'Acceso denegado: Token inválido' });
        return;
      }

      const role = user.user_metadata?.role;
      if (role !== 'admin') {
        res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
        return;
      }

      const { email, password, name, phone, role: newRole } = req.body;
      if (!email || !password || !name || !phone || !newRole) {
        res.status(400).json({ error: 'Campos requeridos faltantes: email, password, name, phone, role' });
        return;
      }

      const { data: created, error: createError } = await supabaseAdminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          phone,
          role: newRole
        }
      });

      if (createError) {
        res.status(400).json({ error: createError.message });
        return;
      }

      res.json({ success: true, user: created.user });
    } catch (err: any) {
      console.error('Error creating user via admin API:', err);
      res.status(500).json({ error: err.message || err });
    }
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
