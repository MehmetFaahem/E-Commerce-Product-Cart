const COLORS = [
  { id: "violet", bgClass: "bg-violet-500", borderColor: "#8b5cf6" },
  { id: "teal", bgClass: "bg-teal-400", borderColor: "#2dd4bf" },
  { id: "blue", bgClass: "bg-blue-500", borderColor: "#3b82f6" },
  { id: "black", bgClass: "bg-zinc-700", borderColor: "#3f3f46" },
];

const SIZES = [
  { id: "S", price: 69 },
  { id: "M", price: 79 },
  { id: "L", price: 89 },
  { id: "XL", price: 99 },
];

const COLOR_MAP = {
  violet: "./assets/1.png",
  teal: "./assets/2.png",
  blue: "./assets/3.png",
  black: "./assets/4.png",
};

let state = {
  selectedColor: "violet",
  selectedSize: "S",
  quantity: 1,
  cartItems: [],
};

const productImage = document.getElementById("productImage");
const colorSelector = document.getElementById("colorSelector");
const sizeSelector = document.getElementById("sizeSelector");
const quantityInput = document.getElementById("quantity");
const addToCartForm = document.getElementById("addToCartForm");
const checkoutButton = document.getElementById("checkoutButton");
const cartModal = document.getElementById("cartModal");
const cartCount = document.getElementById("cartCount");

function init() {
  renderStars();
  renderColorSelector();
  renderSizeSelector();
  updateProductImage();
  setupEventListeners();
}

function renderStars() {
  const starsContainer = document.getElementById("starsContainer");
  const starTemplate = document.getElementById("starTemplate");
  for (let i = 0; i < 5; i++) {
    starsContainer.appendChild(starTemplate.content.cloneNode(true));
  }
}

function renderColorSelector() {
  colorSelector.innerHTML = COLORS.map(
    (color) => `
        <div class="flex flex-col self-stretch my-auto w-6">
            <input type="radio" id="${
              color.id
            }" name="bandColor" class="sr-only" 
                   ${state.selectedColor === color.id ? "checked" : ""}>
            <label for="${color.id}" 
                   class="flex flex-col justify-center px-0.5 py-0.5 rounded-full cursor-pointer 
                   ${
                     state.selectedColor === color.id
                       ? `border-2 border-solid border-[${color.borderColor}]`
                       : ""
                   }">
                <div class="flex shrink-0 w-4 h-4 ${
                  color.bgClass
                } rounded-full"></div>
            </label>
        </div>
    `
  ).join("");
}

function renderSizeSelector() {
  sizeSelector.innerHTML = SIZES.map(
    (size) => `
        <div>
            <input type="radio" id="size-${size.id.toLowerCase()}" name="wristSize" class="sr-only"
                   ${state.selectedSize === size.id ? "checked" : ""}>
            <label for="size-${size.id.toLowerCase()}"
                   class="overflow-hidden gap-2.5 self-stretch px-5 py-2 my-auto rounded border border-solid cursor-pointer
                   ${
                     state.selectedSize === size.id
                       ? "border-indigo-500"
                       : "border-zinc-200 text-slate-400"
                   }">
                <span class="text-sm font-medium ${
                  state.selectedSize === size.id
                    ? "text-indigo-500"
                    : "text-black"
                }">
                    ${size.id}
                </span>
                <span class="text-xs text-slate-400">$${size.price}</span>
            </label>
        </div>
    `
  ).join("");
}

function updateProductImage() {
  productImage.src = COLOR_MAP[state.selectedColor];
}

function setupEventListeners() {
  colorSelector.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      state.selectedColor = e.target.id;
      updateProductImage();
      renderColorSelector();
    }
  });

  sizeSelector.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      state.selectedSize = e.target.id.split("-")[1].toUpperCase();
      renderSizeSelector();
    }
  });

  document.getElementById("decreaseQuantity").addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    quantityInput.value = state.quantity;
  });

  document.getElementById("increaseQuantity").addEventListener("click", () => {
    state.quantity++;
    quantityInput.value = state.quantity;
  });

  quantityInput.addEventListener("change", (e) => {
    state.quantity = Math.max(1, parseInt(e.target.value));
    quantityInput.value = state.quantity;
  });

  addToCartForm.addEventListener("submit", handleAddToCart);

  checkoutButton.addEventListener("click", () => {
    renderCartModal();
    openCartModal();
  });

  document
    .getElementById("continueShopping")
    .addEventListener("click", closeCartModal);

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      closeCartModal();
    }
  });

  cartModal
    .querySelector("div[role='region']")
    .addEventListener("click", (e) => {
      e.stopPropagation();
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !cartModal.classList.contains("hidden")) {
      closeCartModal();
    }
  });

  document
    .getElementById("modalCheckoutButton")
    .addEventListener("click", () => {
      alert("Proceeding to checkout");
      closeCartModal();
    });
}

function handleAddToCart(e) {
  e.preventDefault();
  const price =
    SIZES.find((s) => s.id === state.selectedSize).price * state.quantity;
  const newItem = {
    color: state.selectedColor,
    size: state.selectedSize,
    quantity: state.quantity,
    price,
    image: COLOR_MAP[state.selectedColor],
  };

  state.cartItems.push(newItem);
  state.quantity = 1;
  quantityInput.value = 1;
  updateCartUI();
}

function updateCartUI() {
  const totalItems = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  cartCount.textContent = totalItems;
  checkoutButton.classList.toggle("hidden", state.cartItems.length === 0);
}

function renderCartModal() {
  const container = document.getElementById("cartItemsContainer");
  const totalQuantityEl = document.getElementById("totalQuantity");
  const totalPriceEl = document.getElementById("totalPrice");
  const modalCheckoutButton = document.getElementById("modalCheckoutButton");

  if (state.cartItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500">
        Your cart is empty
      </div>
    `;
    totalQuantityEl.textContent = "0";
    totalPriceEl.textContent = "$0.00";
    modalCheckoutButton.disabled = true;
    modalCheckoutButton.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    container.innerHTML = state.cartItems
      .map(
        (item, index) => `
      <div
        class="flex flex-wrap items-center py-4 w-full text-sm border-b border-zinc-200"
        role="row"
      >
        <div class="flex items-center gap-4 grow shrink w-[266px] max-sm:w-full max-sm:mb-2">
          <img
            src="${item.image}"
            alt="${item.color} watch"
            class="w-16 h-16 object-cover rounded"
          />
          <span class="text-sm font-normal text-gray-900">
            Classy Modern Smart watch
          </span>
        </div>
        <div class="grow shrink text-center font-normal w-[50px] max-sm:w-1/4">
          ${item.color}
        </div>
        <div class="grow shrink text-center w-[57px] max-sm:w-1/4">
          ${item.size}
        </div>
        <div class="grow shrink text-center w-[47px] max-sm:w-1/4">
          ${item.quantity}
        </div>
        <div class="grow shrink text-right w-[79px] max-sm:w-1/4">
          $${item.price.toFixed(2)}
        </div>
      </div>
    `
      )
      .join("");

    const totalQuantity = state.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = state.cartItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    totalQuantityEl.textContent = totalQuantity;
    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;

    modalCheckoutButton.disabled = false;
    modalCheckoutButton.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function openCartModal() {
  cartModal.classList.remove("hidden");
  cartModal.querySelector("#continueShopping").focus();
}

function closeCartModal() {
  cartModal.classList.add("hidden");
}

init();
