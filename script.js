// Initialize cart if it doesn't exist
if (!localStorage.getItem('breakfastCart')) {
    localStorage.setItem('breakfastCart', JSON.stringify([]));
}

// Update cart display when page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);

function selectBreakfast(itemName) {
    let cart = JSON.parse(localStorage.getItem('breakfastCart')) || [];
    cart.push(itemName);
    localStorage.setItem('breakfastCart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('breakfastCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('breakfastCart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cart = JSON.parse(localStorage.getItem('breakfastCart')) || [];
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
    } else {
        cartEmpty.style.display = 'none';
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item}</span>
                <button onclick="removeFromCart(${index})">&times;</button>
            `;
            cartItems.appendChild(itemElement);
        });
    }
}

function showConfirmation(event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
    
    // Get form values
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const kiss = document.getElementById('kiss').checked ? 'Yes' : 'No';
    const emailTo = document.getElementById('emailTo').value;
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('breakfastCart')) || [];
    
    // Create email content
    const subject = "New Breakfast Order";
    const body = `
Selected Items:
${cart.join('\n')}

Time: ${time}
Location: ${location}
Kiss included: ${kiss}`;

    // Create Gmail link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail in a new window and wait for it to close
    const gmailWindow = window.open(gmailLink, '_blank', 'width=600,height=600');
    
    // Check every second if Gmail window is closed
    const timer = setInterval(() => {
        if (gmailWindow.closed) {
            clearInterval(timer);
            
            // Get the form, heading, and confirmation elements
            const form = document.getElementById('orderForm');
            const heading = document.querySelector('.order-window h2');
            const confirmation = document.getElementById('confirmation');
            
            // Hide the form and heading
            form.style.display = 'none';
            heading.style.display = 'none';
            
            // Show the confirmation message
            confirmation.classList.remove('hidden');
            
            // Clear the cart after order is sent
            localStorage.setItem('breakfastCart', JSON.stringify([]));
        }
    }, 1000);
    
    return false;
}

function clearCart() {
    localStorage.setItem('breakfastCart', JSON.stringify([]));
    updateCartDisplay();
} 