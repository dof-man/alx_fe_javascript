// Quotes array to hold quote objects, initially loaded from localStorage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Motivation" }
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Get the quoteDisplay element and clear its content
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Clear previous content
  quoteDisplay.textContent = '';

  // Create elements to display the quote
  const categoryElement = document.createElement('p');
  const quoteTextElement = document.createElement('p');

  categoryElement.textContent = `Category: ${randomQuote.category}`;
  quoteTextElement.textContent = randomQuote.text;

  // Append elements to quoteDisplay
  quoteDisplay.appendChild(categoryElement);
  quoteDisplay.appendChild(quoteTextElement);

  // Save the last viewed quote in sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Add event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to dynamically add new quotes
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    // Create a new quote object and push it to the quotes array
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Save updated quotes to localStorage
    saveQuotes();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Show the latest quote after adding
    showRandomQuote();
  } else {
    alert("Please fill in both fields.");
  }
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  
  const quoteTextInput = document.createElement('input');
  quoteTextInput.id = 'newQuoteText';
  quoteTextInput.type = 'text';
  quoteTextInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append the form to the body or a specific container
  document.body.appendChild(formContainer);
}

// Call the createAddQuoteForm function to display the form on page load
createAddQuoteForm();

// Function to export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Add event listener to the "Export Quotes" button
document.getElementById('exportQuotes').addEventListener('click', exportToJson);

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format. Please upload a valid quotes JSON file.');
      }
    } catch (e) {
      alert('Error reading the file: ' + e.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listener to the "Import Quotes" file input
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// On page load, show the last viewed quote from sessionStorage
const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastViewedQuote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = `Last Viewed Quote - Category: ${lastViewedQuote.category}, Quote: ${lastViewedQuote.text}`;
}
let quotes = []; // Your quotes array
let categories = []; // Array to hold unique categories

// Load quotes and categories from localStorage (if available)
window.onload = function() {
  loadQuotes();
  loadCategories();
  populateCategories();
  applyLastFilter();
};

// Function to load quotes from localStorage (or use default)
function loadQuotes() {
  const savedQuotes = JSON.parse(localStorage.getItem('quotes'));
  if (savedQuotes) {
    quotes = savedQuotes;
  }
}

// Function to load categories from localStorage (or extract from quotes)
function loadCategories() {
  const savedCategories = JSON.parse(localStorage.getItem('categories'));
  if (savedCategories) {
    categories = savedCategories;
  } else {
    categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  }
}

// Populate categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add categories dynamically
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = quotes;
  
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  displayQuotes(filteredQuotes);
  
  // Save the selected filter in localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Display filtered quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p><strong>${quote.text}</strong> - ${quote.category}</p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Apply the last selected filter from localStorage
function applyLastFilter() {
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  
  if (lastSelectedCategory) {
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes();
  } else {
    filterQuotes();
  }
}

// Add a new quote (also updates categories and localStorage)
function addQuote(quoteText, quoteCategory) {
  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  
  // Update categories if a new category is added
  if (!categories.includes(quoteCategory)) {
    categories.push(quoteCategory);
  }

  saveQuotes();
  populateCategories();
  filterQuotes(); // Reapply filter after adding new quote
}

// Save quotes and categories to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Export Quotes as JSON
document.getElementById('exportQuotes').addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Simulated mock API for data sync

// Add a new quote to localStorage and the displayed quotes
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory, id: Date.now() };

    // Get existing quotes from localStorage
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Add the new quote
    localQuotes.push(newQuote);

    // Save the updated quotes to localStorage
    localStorage.setItem("quotes", JSON.stringify(localQuotes));

    // Update the displayed quotes
    displayQuotes(localQuotes);

    // Sync data with the server
    syncDataWithServer();
  }
}

// Sync local data with the server periodically
async function syncDataWithServer() {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  try {
    // Simulate fetching data from the server
    const serverQuotes = await fetchQuotesFromServer();

    // Resolve any conflicts between local and server data
    const updatedQuotes = resolveConflicts(serverQuotes, localQuotes);

    // Save the updated quotes to localStorage
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));

    // Update the displayed quotes
    displayQuotes(updatedQuotes);

    // Send updated data to the server (simulate POST request)
    await postQuotesToServer(updatedQuotes);
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

// Fetch quotes from the server (simulated) using async/await
async function fetchQuotesFromServer() {
  const response = await fetch(serverUrl);
  const data = await response.json();

  // For this simulation, return a slice of the response as "quotes"
  return data.slice(0, 5); // Simulate returning some server data
}

// Post quotes to the server (simulate POST request)
async function postQuotesToServer(quotes) {
  try {
    const response = await fetch(serverUrl, {
      method: 'POST', // Sending data to the server
      headers: {
        'Content-Type': 'application/json', // Specifying the content type as JSON
      },
      body: JSON.stringify(quotes), // Sending the quotes as the request body
    });

    if (!response.ok) {
      throw new Error('Failed to post data to server');
    }

    console.log('Data posted to server successfully');
  } catch (error) {
    console.error('Error posting data to server:', error);
  }
}

// Resolve conflicts: Server data takes precedence
function resolveConflicts(serverQuotes, localQuotes) {
  let mergedQuotes = [...localQuotes];

  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotes.find(q => q.id === serverQuote.id);
    if (localQuote && localQuote.text !== serverQuote.text) {
      mergedQuotes = mergedQuotes.map(q =>
        q.id === serverQuote.id ? serverQuote : q
      );
    }
  });

  return mergedQuotes;
}

// Display quotes on the page
function displayQuotes(quotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear previous quotes

  quotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<h3>${quote.text}</h3><p>Category: ${quote.category}</p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Implement category filtering
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Populate category dropdown dynamically
function populateCategories() {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const categories = [...new Set(quotes.map(quote => quote.category))];

  const categoryFilter = document.getElementById('categoryFilter');
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Export quotes to JSON file
function exportQuotes() {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const jsonBlob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(jsonBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    localStorage.setItem("quotes", JSON.stringify(importedQuotes));
    displayQuotes(importedQuotes);
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate periodic syncing with the server every 30 seconds
setInterval(() => {
  syncDataWithServer();
}, 30000);

// Initialize on page load: Populate categories and display existing quotes
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  syncDataWithServer(); // Initial sync when page loads
});


 

  

 



  
