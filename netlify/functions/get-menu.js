export const handler = async (event, context) => {
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

    // Netlify format response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(menuItems)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch menu data" })
    };
  }
};