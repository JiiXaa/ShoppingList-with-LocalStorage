const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// Array to hold our state
let items = [];

function displayItems() {
  const html = items
    .map(
      (item) => `
  <li class="shopping-item">
  <input
  value="${item.id}"
  type="checkbox"
  ${item.complete && 'checked'}
  >
  <span class="itemName">${item.name}</span>
  <button
  aria-label="Remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`
    )
    .join('');
  list.innerHTML = html;
}

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  // if input is empty, then don`t submit it
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };

  // Push items into our items state
  items.push(item);

  // Clear form
  e.currentTarget.reset();

  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteItem(id) {
  // update our items array without this one
  items = items.filter((item) => item.id !== id);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function setLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function getLocalStorage() {
  // Pull items from localStorage
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length > 0 && !lsItems === null) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

// Event Listeners
shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', setLocalStorage);
// Event Delegation - We listen for the click on the list <ul> but then delegate the click over to the button if that is what was clicked
list.addEventListener('click', function (e) {
  const id = parseInt(e.target.value);

  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});

// Check for any data being stored in localStorage
getLocalStorage();
