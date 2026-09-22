const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/recipe/dish_1', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (data.includes('This page couldn\'t load') || data.includes('Error')) {
        console.log("Found error in HTML!");
        // extract the error message from the next.js error boundary if present
        const match = data.match(/"message":"([^"]+)"/);
        if (match) console.log("Error message:", match[1]);
        else console.log("No specific message found. Data snippet:", data.substring(0, 500));
      } else {
        console.log("Page loaded fine. Title:", data.match(/<title>(.*?)<\/title>/)?.[1]);
      }
    });
  }).on('error', (e) => console.error(e));
}, 10000); // Wait 10s for server to start
