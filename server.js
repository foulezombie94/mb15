import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BRIX_API_KEY = process.env.BRIX_API_KEY || 'brix_fB03a4Lt76Z9yEpvbWVnbyUwGmjXqad2FrWztKg7vg4VlhzK';
const BRIX_BASE_URL = 'https://brixhub.net/api/v1';

if (!BRIX_API_KEY) {
  console.warn('WARNING: BRIX_API_KEY is not defined in the environment variables. Please add it to your environment.');
}

// Middleware to check if BRIX_API_KEY is configured
const checkBrixApiKey = (req, res, next) => {
  if (!BRIX_API_KEY) {
    return res.status(500).json({
      status: 500,
      message: "Clé API manquante. Veuillez définir BRIX_API_KEY dans le code ou dans les variables d'environnement."
    });
  }
  next();
};

// Helper to filter out blocked names (Bouzoumita, Marzoug)
const filterBlockedNames = (results) => {
  if (!Array.isArray(results)) return results;
  return results.filter(profile => {
    const fieldsToInspect = [
      profile.nom_famille,
      profile.prenom,
      profile.nom_naissance,
      profile.nom_affichage,
      profile.nom_utilisateur
    ];
    
    for (const field of fieldsToInspect) {
      if (typeof field === 'string') {
        const lower = field.toLowerCase();
        if (lower.includes('bouzoumita') || lower.includes('marzoug')) {
          return false;
        }
      }
    }
    return true;
  });
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper to construct headers for BrixHub API
const getBrixHeaders = () => {
  return {
    'X-API-Key': BRIX_API_KEY,
    'Content-Type': 'application/json',
    'User-Agent': 'MonApp/1.0'
  };
};

// Helper to copy Rate-Limit headers from BrixHub API response to Express response
const forwardRateLimitHeaders = (brixRes, expressRes) => {
  const rateLimitHeaders = [
    'x-ratelimit-limit-day',
    'x-ratelimit-remaining-day',
    'x-ratelimit-limit-min'
  ];

  rateLimitHeaders.forEach(header => {
    const val = brixRes.headers.get(header);
    if (val !== null) {
      expressRes.setHeader(header, val);
    }
  });
};

// Route: API Health
app.get('/api/health', async (req, res) => {
  try {
    const response = await fetch(`${BRIX_BASE_URL}/health`, {
      method: 'GET',
      headers: getBrixHeaders() // Now using headers here too
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response in health check:', text.substring(0, 500));
      return res.status(502).json({
        status: 502,
        message: 'Invalid response from upstream API (Possible Cloudflare Block)',
        error: text.substring(0, 100)
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to connect to MB15 health service',
      error: error.message
    });
  }
});

// Route: Get Key Details & Consumption Stats (me)
app.get('/api/me', checkBrixApiKey, async (req, res) => {
  try {
    const response = await fetch(`${BRIX_BASE_URL}/me`, {
      method: 'GET',
      headers: getBrixHeaders()
    });

    forwardRateLimitHeaders(response, res);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response in /api/me:', text.substring(0, 500));
      return res.status(502).json({
        status: 502,
        message: 'Invalid response from upstream API (Possible Cloudflare Block)',
        error: text.substring(0, 100)
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching API key details:', error);
    res.status(500).json({
      status: 500,
      message: 'Server error while fetching API key info',
      error: error.message
    });
  }
});

// Route: Search Profiles
app.post('/api/search', checkBrixApiKey, async (req, res) => {
  console.log('--- SEARCH REQUEST RECEIVED ---');
  console.log('Payload:', JSON.stringify(req.body, null, 2));
  try {
    const response = await fetch(`${BRIX_BASE_URL}/search`, {
      method: 'POST',
      headers: getBrixHeaders(),
      body: JSON.stringify(req.body)
    });

    forwardRateLimitHeaders(response, res);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response in /api/search:', text.substring(0, 500));
      return res.status(502).json({
        status: 502,
        message: 'Invalid response from upstream API (Possible Cloudflare Block)',
        error: text.substring(0, 100)
      });
    }

    const data = await response.json();
    console.log('BrixHub Response Status:', response.status);
    console.log('BrixHub Response Meta:', JSON.stringify(data.meta || {}, null, 2));
    console.log('BrixHub Results Count:', data.data?.results?.length || 0);

    // Filter out blocked names
    if (data && data.data && Array.isArray(data.data.results)) {
      const originalLength = data.data.results.length;
      data.data.results = filterBlockedNames(data.data.results);
      const filteredCount = originalLength - data.data.results.length;
      if (filteredCount > 0) {
        console.log(`Filtered out ${filteredCount} results containing blocked names.`);
        if (data.meta && typeof data.meta.total === 'number') {
          data.meta.total = Math.max(0, data.meta.total - filteredCount);
        }
      }
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Search query error:', error);
    res.status(500).json({
      status: 500,
      message: 'Server error during search query execution',
      error: error.message
    });
  }
});

// Route: Reverse Lookups (email, phone, iban)
app.get('/api/lookup/:type/:value', checkBrixApiKey, async (req, res) => {
  const { type, value } = req.params;
  
  if (!['email', 'phone', 'iban'].includes(type)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid lookup type. Must be 'email', 'phone', or 'iban'."
    });
  }

  try {
    // URL encode the value to handle emails and complex IBANs properly
    const encodedValue = encodeURIComponent(value);
    const response = await fetch(`${BRIX_BASE_URL}/lookup/${type}/${encodedValue}`, {
      method: 'GET',
      headers: getBrixHeaders()
    });

    forwardRateLimitHeaders(response, res);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response in lookup:', text.substring(0, 500));
      return res.status(502).json({
        status: 502,
        message: 'Invalid response from upstream API (Possible Cloudflare Block)',
        error: text.substring(0, 100)
      });
    }

    const data = await response.json();

    // Filter lookup profile
    if (data && data.data) {
      let isBlocked = false;
      if (data.data.results && Array.isArray(data.data.results)) {
        const originalLength = data.data.results.length;
        data.data.results = filterBlockedNames(data.data.results);
        if (data.data.results.length === 0 && originalLength > 0) {
          isBlocked = true;
        }
      } else {
        const filtered = filterBlockedNames([data.data]);
        if (filtered.length === 0) {
          isBlocked = true;
        }
      }
      
      if (isBlocked) {
        console.log(`Filtered out lookup result containing blocked name.`);
        return res.status(404).json({
          status: 404,
          message: "Aucun profil lié trouvé pour cet identifiant (nom exclu)."
        });
      }
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Lookup error for ${type}:`, error);
    res.status(500).json({
      status: 500,
      message: `Server error during ${type} lookup`,
      error: error.message
    });
  }
});

// Route: Usage Logs (Pro+ Feature)
app.get('/api/usage', checkBrixApiKey, async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;

    const response = await fetch(`${BRIX_BASE_URL}/usage?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: getBrixHeaders()
    });

    forwardRateLimitHeaders(response, res);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching usage history:', error);
    res.status(500).json({
      status: 500,
      message: 'Server error while fetching usage logs',
      error: error.message
    });
  }
});

// Fallback to serving the frontend app for SPA routing (if any)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening only when not on Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  MB15 Dashboard backend running locally!`);
    console.log(`  Access the app at: http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
}

// Export the app instance for Vercel
export default app;
