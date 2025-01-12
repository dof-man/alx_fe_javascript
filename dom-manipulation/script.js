// Initial array of quotes
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspirational" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Life" },
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Function to clear the quote display
function clearQuoteDisplay() {
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    clearQuoteDisplay();
    const noQuoteMessage = document.createElement("p");
    noQuoteMessage.textContent = "No quotes available!";
    quoteDisplay.appendChild(noQuoteMessage);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];

  clearQuoteDisplay();
  const quoteTextElement = document.createElement("p");
  quoteTextElement.textContent = `"${text}"`;

  const quoteCategoryElement = document.createElement("p");
  quoteCategoryElement.style.fontStyle = "italic";
  quoteCategoryElement.textContent = `— ${category}`;

  quoteDisplay.appendChild(quoteTextElement);
  quoteDisplay.appendChild(quoteCategoryElement);
}

// Function to add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  // Clear input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("New quote added successfully!");
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
