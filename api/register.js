// Vercel serverless function for register (demo only, not persistent)

let users = [
  { username: 'testuser', password: 'testpass' }, // demo user
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = req.body;
    if (!body) {
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid request' });
      }
    }
    const { username, password } = body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const exists = users.find(u => u.username === username);
    if (exists) {
      return res.status(409).json({ error: 'User already exists' });
    }
    users.push({ username, password });
    return res.status(201).json({ message: 'Registration successful!' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 