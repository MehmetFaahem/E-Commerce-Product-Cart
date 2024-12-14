const bandColorInputs = document.querySelectorAll('input[name="bandColor"]');
const colorLabels = document.querySelectorAll(
  'input[name="bandColor"] + label'
);
const wristSizeInputs = document.querySelectorAll('input[name="wristSize"]');
const wristSizeLabels = document.querySelectorAll(
  'input[name="wristSize"] + label'
);
const mainImage = document.querySelector(".product-main-image");
const addToCartForm = document.querySelector("form");
const quantityInput = document.querySelector('input[type="number"]');
const decreaseBtn = document.querySelector(
  'button[aria-label="Decrease quantity"]'
);
const increaseBtn = document.querySelector(
  'button[aria-label="Increase quantity"]'
);
const checkoutFloatingBtn = document.querySelector(".floating-checkout");
const modal = document.getElementById("modal");
const modalCloseBtn = document.querySelector(
  'button[aria-label="Continue Shopping"]'
);
const modalCheckoutBtn = document.querySelector(
  'button[aria-label="Proceed to Checkout"]'
);

const colorImageMap = {
  violet: "./assets/1.png",
  teal: "./assets/2.png",
  blue: "./assets/3.png",
  black: "./assets/4.png",
};

let cartItems = [];
let cartCount = 0;

function initializePage() {
  checkoutFloatingBtn.style.display = "none";
  modal.style.display = "none";
  mainImage.src = colorImageMap.violet;
  updateColorSelection(
    document.querySelector('input[name="bandColor"]:checked')
  );
  updateSizeSelection(
    document.querySelector('input[name="wristSize"]:checked')
  );
}

bandColorInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const color = e.target.id;
    mainImage.src = colorImageMap[color];
    updateColorSelection(e.target);
  });
});

function updateColorSelection(selectedInput) {
  colorLabels.forEach((label) => {
    label.className = "cursor-pointer";
    const colorDiv = label.querySelector("div");
    colorDiv.className = `flex shrink-0 w-4 h-4   rounded-full ${getBackgroundColorClass(
      label.getAttribute("for")
    )}`;
  });

  const selectedLabel = selectedInput.nextElementSibling;
  selectedLabel.className =
    "flex flex-col justify-center items-center w-5 h-5 rounded-full border-2 border-solid cursor-pointer";
  selectedLabel.style.borderColor = getBorderColor(selectedInput.id);
}

function getBackgroundColorClass(color) {
  const colorMap = {
    violet: "bg-violet-500",
    teal: "bg-teal-400",
    blue: "bg-blue-500",
    black: "bg-zinc-700",
  };
  return colorMap[color];
}

function getBorderColor(color) {
  const colorMap = {
    violet: "#8b5cf6",
    teal: "#2dd4bf",
    blue: "#3b82f6",
    black: "#3f3f46",
  };
  return colorMap[color];
}

wristSizeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    updateSizeSelection(e.target);
    updatePriceDisplay(e.target.id.split("-")[1].toUpperCase());
  });
});

function updateSizeSelection(selectedInput) {
  wristSizeLabels.forEach((label) => {
    label.classList.remove("border-indigo-500", "text-indigo-500");
    label.classList.add("border-zinc-200", "text-slate-400");
  });
  const selectedLabel = selectedInput.nextElementSibling;
  selectedLabel.classList.remove("border-zinc-200", "text-slate-400");
  selectedLabel.classList.add("border-indigo-500", "text-indigo-500");
}

function updatePriceDisplay(size) {
  const price = getPriceBySize(size);
  const priceSpan = document.querySelector(
    `label[for="size-${size.toLowerCase()}"] .text-xs`
  );
  if (priceSpan) {
    priceSpan.textContent = `$${price}`;
  }
}

decreaseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
});

increaseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const currentValue = parseInt(quantityInput.value);
  quantityInput.value = currentValue + 1;
});

addToCartForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedColor = document.querySelector(
    'input[name="bandColor"]:checked'
  ).id;
  const selectedSize = document
    .querySelector('input[name="wristSize"]:checked')
    .id.split("-")[1]
    .toUpperCase();
  const quantity = parseInt(quantityInput.value);
  const price = getPriceBySize(selectedSize) * quantity;

  const item = {
    color: selectedColor,
    size: selectedSize,
    quantity,
    price,
    image: colorImageMap[selectedColor],
  };

  cartItems.push(item);
  cartCount += quantity;

  quantityInput.value = "1";

  updateFloatingCheckoutButton();
  showFloatingCheckoutButton();
});

function getPriceBySize(size) {
  const prices = {
    S: 69,
    M: 79,
    L: 89,
    XL: 99,
  };
  return prices[size];
}

function updateFloatingCheckoutButton() {
  const countSpan = checkoutFloatingBtn.querySelector("span:last-child");
  countSpan.textContent = cartCount;
}

function showFloatingCheckoutButton() {
  const container = checkoutFloatingBtn.parentElement;
  container.style.display = "flex";
  checkoutFloatingBtn.style.display = "flex";
}

checkoutFloatingBtn.addEventListener("click", () => {
  updateCartModal();
  modal.style.display = "flex";
  modal.style.zIndex = "50";
});

modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modal.style.zIndex = "0";
});

modalCheckoutBtn.addEventListener("click", () => {
  console.log("Proceeding to checkout with items:", cartItems);
  modal.style.display = "none";
  modal.style.zIndex = "0";
});

function updateCartModal() {
  const cartContainer = modal.querySelector(".cart-items-container");
  cartContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const rowHTML = createCartItemRow(item);
    cartContainer.insertAdjacentHTML("beforeend", rowHTML);
  });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const totalRow = modal.querySelector('[aria-label="Cart Total"]');
  totalRow.querySelector(".total-quantity").textContent = totalQuantity;
  totalRow.querySelector(".total-price").textContent = `$${totalPrice.toFixed(
    2
  )}`;
}

function createCartItemRow(item) {
  return `
    <div class="flex flex-wrap items-center pr-1 pb-4 mt-4 w-full text-sm border-b border-zinc-200 text-slate-700 max-md:max-w-full" role="row">
      <div class="flex grow shrink gap-2 justify-center items-center self-stretch my-auto min-w-[240px] w-[266px]" role="cell">
        <img loading="lazy" src="${item.image}" alt="${
    item.color
  } Classy Modern Smart watch" class="object-contain shrink-0 self-stretch font-normal my-auto w-9 rounded aspect-square" />
        <div class="flex-1 shrink self-stretch my-auto basis-0 font-normal">Classy Modern Smart watch</div>
      </div>
      <div class="grow shrink self-stretch my-auto text-center text-slate-700 w-[50px] font-normal" role="cell">${
        item.color
      }</div>
      <div class="grow shrink self-stretch my-auto text-center w-[57px]" role="cell">${
        item.size
      }</div>
      <div class="grow shrink self-stretch my-auto text-center w-[47px]" role="cell">${
        item.quantity
      }</div>
      <div class="grow shrink self-stretch my-auto text-right w-[79px]" role="cell">$${item.price.toFixed(
        2
      )}</div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initializePage);
