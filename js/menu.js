async function fetchPizzeriaMenu() {
    try {
      // Hits your clean local serverless function endpoint!
      const response = await fetch('/api/get-menu');
      const menuItems = await response.json();
      
      console.log("Clean API Data:", menuItems);
  
      // 1. Filter out items the client marked as "Hidden"
      const activeItems = menuItems.filter(item => item.status?.toLowerCase() !== 'hidden');
  
      // 2. Group the remaining items by their Category column
      const menuByCategory = activeItems.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {});
      
      // 3. Send grouped data straight to your renderer!
      displayMenu(menuByCategory);
  
    } catch (err) {
      console.error("Error loading menu:", err);
      // Fallback message for the user if the backend micro-api fails
      document.querySelector('main').innerHTML = `<p class="container text-center my-5">Menu temporarily unavailable. Please call us to order!</p>`;
    }
  }
  
  function displayMenu(categories) {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = ''; // Clear out any loading placeholders
  
    for (const [categoryName, items] of Object.entries(categories)) {
      // Generate a clean structure that matches your cartoon/pop aesthetic
      const section = document.createElement('section');
      section.className = 'container my-5';
      
      section.innerHTML = `
        <h2 class="text-capitalize mb-4" style="font-family: 'Oi', sans-serif; color: var(--blood-red);">${categoryName}</h2>
        <div class="row row-cols-1 row-cols-md-2 g-4">
          ${items.map(item => `
            <div class="col">
              <div class="p-3" style="border: 3px solid var(--coffee-bean); background-color: white; border-radius: 15px; box-shadow: 4px 4px 0px var(--coffee-bean);">
                <div class="d-flex justify-content-between align-items-baseline mb-2">
                  <h4 class="mb-0" style="font-weight: 700; color: var(--coffee-bean);">${item.name}</h4>
                  <span class="fs-5" style="font-weight: 700; color: var(--dark-emerald);">$${parseFloat(item.price).toFixed(2)}</span>
                </div>
                <p class="text-muted mb-0" style="font-family: 'Work Sans', sans-serif;">${item.description || ''}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      mainElement.appendChild(section);
    }
  }
  
  // Fixed: Fire the correct function when the menu page loads!
  document.addEventListener('DOMContentLoaded', fetchPizzeriaMenu);