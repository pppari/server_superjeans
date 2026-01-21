document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('items-list');
    const loadItemsButton = document.getElementById('load-items');
    
    // Function to fetch items from the API
    const fetchItems = async () => {
        try {
            const response = await fetch('/api/items');
            const items = await response.json();
            
            // Clear the list
            itemsList.innerHTML = '';
            
            // Add each item to the list
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} (ID: ${item.id})`;
                itemsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching items:', error);
            itemsList.innerHTML = '<li class="error">Failed to load items. Please try again.</li>';
        }
    };
    
    // Add event listener to the button
    loadItemsButton.addEventListener('click', fetchItems);
});
