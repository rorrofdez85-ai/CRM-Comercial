const GAS_URL = "https://script.google.com/macros/s/AKfycbwSqIjKfTHeN-NPORLCxl2cdhdA7Z6aM7coNxQUBVjIfURJPbQ-x8NAyf2eIaq0WLXzoA/exec";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwSqIjKfTHeN-NPORLCxl2cdhdA7Z6aM7coNxQUBVjIfURJPbQ-x8NAyf2eIaq0WLXzoA/exec';
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({
      ok: false,
      error: `Metodo no permitido: ${req.method}`,
    });
  }

  try {
    let response;
    if (req.method === 'GET') {
    let upstreamResponse;

    if (req.method === "GET") {
      const params = new URLSearchParams(req.query).toString();
      response = await fetch(`${GAS_URL}?${params}`);
      const targetUrl = params ? `${GAS_URL}?${params}` : GAS_URL;

      console.log("[api/sheets] GET", targetUrl);

      upstreamResponse = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
      });
    } else {
      response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      console.log("[api/sheets] POST", {
        accion: req.body?.accion || null,
        hoja: req.body?.hoja || null,
        id: req.body?.id || null,
      });

      upstreamResponse = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body || {}),
        redirect: "follow",
      });
    }
    const data = await response.json();

    const rawText = await upstreamResponse.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.error("[api/sheets] Respuesta no JSON", {
        status: upstreamResponse.status,
        preview: rawText.slice(0, 300),
      });

      return res.status(502).json({
        ok: false,
        error: "Google Apps Script no devolvio JSON valido",
        status: upstreamResponse.status,
        preview: rawText.slice(0, 300),
      });
    }

    if (!upstreamResponse.ok) {
      console.error("[api/sheets] Error upstream", {
        status: upstreamResponse.status,
        data,
      });

      return res.status(upstreamResponse.status).json({
        ok: false,
        error: data?.error || "Error al consultar Google Apps Script",
        details: data,
      });
    }

    console.log("[api/sheets] OK", {
      method: req.method,
      accion: req.method === "GET" ? req.query?.accion : req.body?.accion,
      hoja: req.method === "GET" ? req.query?.hoja : req.body?.hoja,
      filas: Array.isArray(data?.filas) ? data.filas.length : undefined,
    });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  } catch (error) {
    console.error("[api/sheets] Error interno", error);

    return res.status(500).json({
      ok: false,
      error: "Error interno en /api/sheets",
      details: error.message,
    });
  }
}
