export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwSqIjKfTHeN-NPORLCxl2cdhdA7Z6aM7coNxQUBVjIfURJPbQ-x8NAyf2eIaq0WLXzoA/exec';

  try {
    let response;
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query).toString();
      response = await fetch(`${GAS_URL}?${params}`);
    } else {
      response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
    }
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
  } catch {
    return res.status(200).json({ 
      ok: true,
      raw: text
    });
  }

