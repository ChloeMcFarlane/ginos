/* ─────────────────────────────────────────────
   MENU PAGE LOGIC
   - Pulls items from the Netlify function (which reads your Google Sheet)
   - Builds the filter row automatically from whatever is in the
     "category" column, so adding a new category in the sheet is
     all you need to do — no HTML/JS edits required.
   - Clicking a filter shows that category's items and strikes
     through the active filter so the user knows where they are.
───────────────────────────────────────────── */

let allItems = [];
let activeCategory = null;

async function fetchPizzeriaMenu() {
  try {
    const response = await fetch('/.netlify/functions/get-menu');
    const menuItems = await response.json();

    // Filter out anything marked "Hidden" in the sheet
    allItems = menuItems.filter(item => item.status?.toLowerCase() !== 'hidden');

    if (allItems.length === 0) {
      document.querySelector('main').innerHTML =
        `<p class="container text-center my-5">Menu temporarily unavailable. Please call us to order!</p>`;
      return;
    }

    buildFilters(allItems);

  } catch (err) {
    console.error("Error loading menu:", err);
    document.querySelector('main').innerHTML =
      `<p class="container text-center my-5">Menu temporarily unavailable. Please call us to order!</p>`;
  }
}

function buildFilters(items) {
  const wrapper = document.getElementById('filter-wrapper');

  // Preserve first-seen order from the sheet rather than sorting alphabetically
  const categories = [...new Set(items.map(item => item.category || 'Other'))];

  wrapper.innerHTML = categories
    .map(cat => `<button type="button" class="filter-btn" data-category="${cat}">${cat}</button>`)
    .join('');

  wrapper.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => selectCategory(btn.dataset.category));
  });

  // Show the first category by default
  selectCategory(categories[0]);
}

function selectCategory(category) {
  activeCategory = category;

  // Strike through the active filter, clear the others
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  renderItems(category);
}

function renderItems(category) {
  const titleEl = document.getElementById('menu-category-title');
  const itemsEl = document.getElementById('menu-items');

  titleEl.textContent = category;

  const items = allItems.filter(item => (item.category || 'Other') === category);

  itemsEl.innerHTML = `
    <div class="menu-items-list">
      ${items.map(item => `
        <div class="menu-item">
          <div class="menu-item-row">
            <span class="menu-item-name">${item.name}</span>
            <span class="menu-item-dots" aria-hidden="true"></span>
            <span class="menu-item-price">$${parseFloat(item.price).toFixed(2)}</span>
          </div>
          ${item.description ? `<p class="menu-item-description">${item.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', fetchPizzeriaMenu);