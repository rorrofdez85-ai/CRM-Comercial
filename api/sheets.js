const GAS = 'https://script.google.com/macros/s/AKfycbwSqIjKfTHeN-NPORLCxl2cdhdA7Z6aM7coNxQUBVjIfURJPbQ-x8NAyf2eIaq0WLXzoA/exec';

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let gasRes;
    if (req.method === 'GET') {
      const q = new URLSearchParams(req.query).toString();
      gasRes = await fetch(`${GAS}?${q}`, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json, text/plain, */*'
        }
      });
    } else {
      gasRes = await fetch(GAS, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(req.body)
      });
    }

    const text = await gasRes.text();

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch(e) {
      return res.status(200).json({
        error: 'GAS no devolvió JSON',
        status: gasRes.status,
        url: gasRes.url,
        preview: text.substring(0, 300)
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
