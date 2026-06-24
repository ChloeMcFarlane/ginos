export default async function handler(request, response) {
    // 1. Fetch your target data from an external source (e.g., Airtable or Google)
    // By doing this on the backend, you can securely use private tokens if needed!
    const targetUrl = `https://docs.google.com/spreadsheets/d/166XtSMebhq4G5EVnlFOA9MVjt_nthjqEkRtBl52PVDg/gviz/tq?tqx=out:json`;
  
    try {
      const rawRes = await fetch(targetUrl);
      const text = await rawRes.text();
      
      // Clean up Google's JSONP security wrapper safely on the server side
      const jsonString = text.match(/\{.*\}/s)[0];
      const rawData = JSON.parse(jsonString);
  
      // Map into your precise key-value architecture
      const menuItems = rawData.table.rows.map(row => ({
        name: row.c[0] ? row.c[0].v : '',
        category: row.c[1] ? row.c[1].v : '',
        price: row.c[2] ? row.c[2].v : 0,
        description: row.c[3] ? row.c[3].v : '',
        status: row.c[4] ? row.c[4].v : ''
      }));
  
      // 2. Set CORS & Content headers so your frontend can consume it safely
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*'); // Allows your front-end to hit it
  
      // 3. Send a clean 200 OK status with the pure JSON data array
      return response.status(200).json(menuItems);
  
    } catch (error) {
      return response.status(500).json({ error: "Failed to fetch menu data" });
    }
  }