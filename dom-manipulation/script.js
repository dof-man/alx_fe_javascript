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

