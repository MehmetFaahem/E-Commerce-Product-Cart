import { product } from "./product.js";

// State management
const store = {
  state: {
    selectedColor: product.variants.colors[0].id,
    selectedSize: product.variants.sizes[0].id,
    selectedRating: product.rating.score,
    quantity: 1,
    cartItems: [],
  },
  listeners: new Set(),

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  },

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  },
};

// Components
const ProductImage = {
  render: (state) => {
    const color = product.variants.colors.find(
      (c) => c.id === state.selectedColor
    );
    document.getElementById("productImage").src = color.image;
  },
};

const ProductRating = {
  starSvg: {
    filled: `<svg class="w-4 h-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
    </svg>`,
    empty: `<svg class="w-4 h-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
    </svg>`,
  },

  render: (state) => {
    const container = document.getElementById("starsContainer");
    const maxStars = 5;
    const score = product.rating.score;
    const count = product.rating.count;

    let starsHtml = "";

    // Generate filled and empty stars based on score
    for (let i = 1; i <= maxStars; i++) {
      if (i <= score) {
        starsHtml += ProductRating.starSvg.filled;
      } else {
        starsHtml += ProductRating.starSvg.empty;
      }
    }

    container.innerHTML = `
      <div class="flex gap-1">
        ${starsHtml}
      </div>
    `;
  },
};

const ColorSelector = {
  render: (state) => {
    const container = document.getElementById("colorSelector");
    container.innerHTML = product.variants.colors
      .map(
        (color) => `
      <label class="relative cursor-pointer">
        <input
          type="radio"
          name="color"
          value="${color.id}"
          class="sr-only peer"
          ${state.selectedColor === color.id ? "checked" : ""}
        />
        <div class="w-4 h-4 rounded-full ${
          color.bgClass
        } peer-checked:ring-2 ring-offset-2 ring-indigo-600"></div>
      </label>
    `
      )
      .join("");

    // Add event listeners
    container.querySelectorAll('input[name="color"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        store.setState({ selectedColor: e.target.value });
      });
    });
  },
};

const SizeSelector = {
  render: (state) => {
    const container = document.getElementById("sizeSelector");
    container.innerHTML = product.variants.sizes
      .map(
        (size) => `
      <label class="relative cursor-pointer">
        <input
          type="radio"
          name="size"
          value="${size.id}"
          class="sr-only peer"
          ${state.selectedSize === size.id ? "checked" : ""}
        />
        <div class="px-3 py-2 border rounded peer-checked:border-indigo-600 peer-checked:text-indigo-600">
          ${size.name}
        </div>
      </label>
    `
      )
      .join("");

    // Add event listeners
    container.querySelectorAll('input[name="size"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        store.setState({ selectedSize: e.target.value });
      });
    });
  },
};

const QuantityControl = {
  render: (state) => {
    const quantityInput = document.getElementById("quantity");
    quantityInput.value = state.quantity;
  },

  setupListeners: () => {
    const decreaseBtn = document.getElementById("decreaseQuantity");
    const increaseBtn = document.getElementById("increaseQuantity");
    const quantityInput = document.getElementById("quantity");

    decreaseBtn.addEventListener("click", () => {
      const newQuantity = Math.max(1, store.state.quantity - 1);
      store.setState({ quantity: newQuantity });
    });

    increaseBtn.addEventListener("click", () => {
      store.setState({ quantity: store.state.quantity + 1 });
    });

    quantityInput.addEventListener("change", (e) => {
      const value = parseInt(e.target.value) || 1;
      const newQuantity = Math.max(1, value);
      store.setState({ quantity: newQuantity });
    });
  },
};

const Cart = {
  render: (state) => {
    const cartCount = document.getElementById("cartCount");
    const checkoutButton = document.getElementById("checkoutButton");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const totalQuantity = document.getElementById("totalQuantity");
    const totalPrice = document.getElementById("totalPrice");

    // Update cart count and visibility
    const totalItems = state.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cartCount.textContent = totalItems;
    checkoutButton.style.display = totalItems > 0 ? "flex" : "none";

    // Update cart items
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = state.cartItems
        .map(
          (item) => `
        <div class="flex flex-wrap items-center py-4 border-b border-zinc-200" role="row">
          <div class="grow shrink self-stretch my-auto w-[266px] max-sm:hidden">
            ${item.name}
          </div>
          <div class="grow shrink self-stretch my-auto text-center w-[50px]">
            ${item.color}
          </div>
          <div class="grow shrink self-stretch my-auto text-center w-[57px]">
            ${item.size}
          </div>
          <div class="grow shrink self-stretch my-auto text-center w-[47px]">
            ${item.quantity}
          </div>
          <div class="grow shrink self-stretch my-auto text-right w-[79px]">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `
        )
        .join("");

      // Update totals
      const total = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      totalQuantity.textContent = `${totalItems} items`;
      totalPrice.textContent = `$${total.toFixed(2)}`;
    }
  },
};

// Setup form submission
function setupFormListener() {
  const form = document.getElementById("addToCartForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedColor = product.variants.colors.find(
      (c) => c.id === store.state.selectedColor
    );
    const selectedSize = product.variants.sizes.find(
      (s) => s.id === store.state.selectedSize
    );

    const newItem = {
      id: `${product.id}-${selectedColor.id}-${selectedSize.id}`,
      name: product.name,
      color: selectedColor.name,
      size: selectedSize.name,
      quantity: store.state.quantity,
      price: selectedSize.price,
    };

    const updatedCart = [...store.state.cartItems];
    const existingItemIndex = updatedCart.findIndex(
      (item) => item.id === newItem.id
    );

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += newItem.quantity;
    } else {
      updatedCart.push(newItem);
    }

    store.setState({ cartItems: updatedCart });
  });
}

// Modal controls
function setupModalControls() {
  const cartModal = document.getElementById("cartModal");
  const checkoutButton = document.getElementById("checkoutButton");
  const continueShopping = document.getElementById("continueShopping");
  const modalCheckoutButton = document.getElementById("modalCheckoutButton");

  checkoutButton.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
  });

  continueShopping.addEventListener("click", () => {
    cartModal.classList.add("hidden");
  });

  modalCheckoutButton.addEventListener("click", () => {
    cartModal.classList.add("hidden");
  });

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.add("hidden");
    }
  });
}

// Initialize the application
function init() {
  // Initial render
  ProductImage.render(store.state);
  ColorSelector.render(store.state);
  SizeSelector.render(store.state);
  QuantityControl.render(store.state);
  ProductRating.render(store.state);
  Cart.render(store.state);

  // Setup listeners
  QuantityControl.setupListeners();
  setupFormListener();
  setupModalControls();

  // Subscribe to state changes
  store.listeners.add((state) => {
    ProductImage.render(state);
    ColorSelector.render(state);
    SizeSelector.render(state);
    QuantityControl.render(state);
    Cart.render(state);
    ProductRating.render(state);
  });
}

// Start the application
init();
