// Vercel serverless function for login (demo only, not persistent)

let users = [
  { username: 'testuser', password: 'testpass' }, // demo user
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = req.body;
    // Vercel parses JSON automatically if content-type is application/json
    if (!body) {
      // fallback for raw body
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid request' });
      }
    }
    const { username, password } = body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 