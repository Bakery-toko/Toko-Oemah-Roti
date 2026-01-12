// Data Produk Roti
const products = [
  {
    id: 1,
    name: "Roti Sobek Coklat",
    price: 15000,
    category: "manis",
    image: "img/coklat.jpg",
    description: "Roti sobek lembut dengan isian coklat melimpah",
  },
  {
    id: 2,
    name: "Roti Keju",
    price: 18000,
    category: "gurih",
    image: "img/kue keju.jpeg",

    description: "Roti dengan taburan keju mozarella yang melimpah",
  },
  {
    id: 3,
    name: "Roti Pandan",
    price: 15000,
    category: "manis",
    image: "img/pandan.jpeg",
    description: "Roti dengan aroma pandan alami yang menyegarkan",
  },
  {
    id: 4,
    name: "Roti Sosis",
    price: 20000,
    category: "gurih",
    image: "img/roti sosis.avif",
    description: "Roti berisi sosis premium dengan saus spesial",
  },
  {
    id: 5,
    name: "Roti Bolen ",
    price: 15000,
    category: "manis",
    image: "img/bolen.jpg",
    description: "Roti dengan isian coklat dan pisang di dalamnya",
  },
  {
    id: 6,
    name: "Roti Bawang",
    price: 13000,
    category: "gurih",
    image: "img/roti bawang.png",

    description: "Roti renyah dengan taburan bawang gurih",
  },
  {
    id: 7,
    name: "Roti Pisang",
    price: 17000,
    category: "manis",
    image: "img/pisang.jpeg",
    description: "Kue dengan Aroma pisang yang Autentik",
  },
  {
    id: 8,
    name: "Roti Brownis",
    price: 20000,
    category: "manis",
    image: "img/brownis.jpeg",
    description: "Brownis dengan coklat Premium ",
  },
  {
    id: 9,
    name: "Kue Nastar",
    price: 50000,
    category: "manis",
    image: "img/nastar.jpeg",
    description: "Kue dengan selai nanas di dalamnya ",
  },
  {
    id: 10,
    name: "Kue Ulang Tahun",
    price: 150000,
    category: "manis",
    image: "img/kue ultah.jpeg",
    description:
      "Kue ulang tahun dengan hiasan cantik untuk moment sepesial anda  ",
  },
  {
    id: 11,
    name: " Pie Buah",
    price: 3000,
    category: "manis",
    image: "img/kue salad.jpeg",
    description:
      "Pie Buah mini dengan kulit renyah isian krim lembut dan toping buah segar ",
  },
  {
    id: 12,
    name: " Donat",
    price: 18000,
    category: "manis",
    image: "img/donat.jpeg",
    description: "Donat lembut dengan berbagai toping lezat",
  },
];

// State aplikasi
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const productsContainer = document.getElementById("products-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCount = document.getElementById("cart-count");
const cartTotalItems = document.getElementById("cart-total-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const clearCartBtn = document.getElementById("clear-cart");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const qrisModal = document.getElementById("qris-modal");
const successModal = document.getElementById("success-modal");
const closeModalButtons = document.querySelectorAll(
  ".close-modal, #close-success"
);
const confirmPaymentBtn = document.getElementById("confirm-payment");
const successMessage = document.getElementById("success-message");

// Format mata uang Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Render produk
function renderProducts(filter = "all") {
  productsContainer.innerHTML = "";

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((product) => product.category === filter);

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.category = product.category;

    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${formatRupiah(product.price)}</p>
                <span class="product-category">${
                  product.category === "manis" ? "Roti Manis" : "Roti Gurih"
                }</span>
                <p>${product.description}</p>
                <div class="product-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-id="${
                          product.id
                        }">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn increase" data-id="${
                          product.id
                        }">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        ${
                          quantity > 0
                            ? "Update Keranjang"
                            : "Tambah ke Keranjang"
                        }
                    </button>
                </div>
            </div>
        `;

    productsContainer.appendChild(productCard);
  });

  // Tambahkan event listener untuk tombol kuantitas
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", handleQuantityChange);
  });

  // Tambahkan event listener untuk tombol tambah ke keranjang
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

// Handle perubahan kuantitas
function handleQuantityChange(e) {
  const button = e.currentTarget;
  const productId = parseInt(button.dataset.id);
  const isIncrease = button.classList.contains("increase");

  updateCartQuantity(productId, isIncrease);
}

// Update kuantitas produk di keranjang
function updateCartQuantity(productId, isIncrease) {
  const product = products.find((p) => p.id === productId);
  const cartItemIndex = cart.findIndex((item) => item.id === productId);

  if (cartItemIndex > -1) {
    if (isIncrease) {
      cart[cartItemIndex].quantity += 1;
    } else {
      if (cart[cartItemIndex].quantity > 1) {
        cart[cartItemIndex].quantity -= 1;
      } else {
        cart.splice(cartItemIndex, 1);
      }
    }
  } else if (isIncrease) {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  updateCartUI();
  renderProducts(getActiveFilter());
}

// Tambah ke keranjang
function addToCart(e) {
  const button = e.currentTarget;
  const productId = parseInt(button.dataset.id);

  const cartItemIndex = cart.findIndex((item) => item.id === productId);

  if (cartItemIndex > -1) {
    // Jika produk sudah ada, tingkatkan kuantitas
    cart[cartItemIndex].quantity += 1;
  } else {
    // Jika produk belum ada, tambahkan baru
    const product = products.find((p) => p.id === productId);
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  updateCartUI();
  renderProducts(getActiveFilter());

  // Tampilkan feedback
  const product = products.find((p) => p.id === productId);
  showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Hapus item dari keranjang
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
  renderProducts(getActiveFilter());

  showNotification("Produk dihapus dari keranjang");
}

// Kosongkan keranjang
function clearCart() {
  if (cart.length === 0) {
    showNotification("Keranjang sudah kosong");
    return;
  }

  if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
    cart = [];
    saveCart();
    updateCartUI();
    renderProducts(getActiveFilter());

    showNotification("Keranjang berhasil dikosongkan");
  }
}

// Update UI keranjang
function updateCartUI() {
  // Update jumlah item di ikon keranjang
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update tampilan keranjang
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Keranjang belanja Anda masih kosong</p>';
    cartTotalItems.textContent = "0 item";
    cartSubtotal.textContent = formatRupiah(0);
    cartTotal.textContent = formatRupiah(5000);
  } else {
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${formatRupiah(item.price)} x ${
        item.quantity
      }</p>
                </div>
                <div class="cart-item-actions">
                    <span>${formatRupiah(itemTotal)}</span>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalItems.textContent = `${totalItems} item`;
    cartSubtotal.textContent = formatRupiah(subtotal);
    cartTotal.textContent = formatRupiah(subtotal + 5000);

    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.currentTarget.dataset.id);
        removeFromCart(productId);
      });
    });
  }
}

// Proses checkout
function processCheckout(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert(
      "Keranjang belanja Anda masih kosong. Silakan tambahkan produk terlebih dahulu."
    );
    return;
  }

  const customerName = document.getElementById("customer-name").value;
  const customerPhone = document.getElementById("customer-phone").value;
  const customerAddress = document.getElementById("customer-address").value;
  const deliveryTime = document.getElementById("delivery-time").value;
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  if (!customerName || !customerPhone || !customerAddress) {
    alert("Harap lengkapi semua informasi pengiriman.");
    return;
  }

  // Simpan data pembelian
  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("id-ID"),
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    },
    deliveryTime: deliveryTime,
    paymentMethod: paymentMethod,
    items: [...cart],
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    shipping: 5000,
    total:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5000,
  };

  // Tampilkan modal pembayaran jika metode pembayaran QRIS
  if (paymentMethod === "qris") {
    showQRISModal(order);
  } else if (paymentMethod === "cod") {
    completePurchase(order);
  } else if (paymentMethod === "transfer") {
    showTransferInstructions(order);
  }
}

// Tampilkan modal QRIS
function showQRISModal(order) {
  qrisModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Simpan order di atribut tombol konfirmasi
  confirmPaymentBtn.dataset.order = JSON.stringify(order);
}

// Tampilkan instruksi transfer
function showTransferInstructions(order) {
  const bankInstructions = `
        Silakan transfer ke rekening berikut:
        
        Bank: BCA
        No. Rekening: 1234567890
        Atas Nama: Oemah Roti
        
        Jumlah: ${formatRupiah(order.total)}
        
        Setelah transfer, harap konfirmasi dengan mengirim bukti transfer ke WhatsApp 0812-3456-7890
    `;

  if (confirm(bankInstructions + "\n\nApakah Anda sudah melakukan transfer?")) {
    completePurchase(order);
  }
}

// Selesaikan pembelian
function completePurchase(order) {
  // Tambahkan ke riwayat pembelian
  purchaseHistory.unshift(order);
  localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

  // Kosongkan keranjang
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts(getActiveFilter());

  // Reset form
  checkoutForm.reset();

  // Tutup modal QRIS jika terbuka
  qrisModal.style.display = "none";
  document.body.style.overflow = "auto";

  // Tampilkan modal sukses
  const deliveryTimeText =
    order.deliveryTime === "segera"
      ? "1-2 jam"
      : order.deliveryTime === "besok"
      ? "besok pagi (07.00-10.00)"
      : "besok sore (15.00-18.00)";

  successMessage.innerHTML = `
        Terima kasih <strong>${
          order.customer.name
        }</strong> telah berbelanja di Oemah Roti.<br><br>
        Pesanan Anda (#${
          order.id
        }) sedang diproses dan akan dikirim dalam waktu ${deliveryTimeText}.<br><br>
        Total pembayaran: <strong>${formatRupiah(order.total)}</strong><br>
        Metode pembayaran: ${
          order.paymentMethod === "cod"
            ? "COD"
            : order.paymentMethod === "qris"
            ? "QRIS"
            : "Transfer Bank"
        }
    `;

  successModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Update riwayat pembelian
  renderPurchaseHistory();
}

// Render riwayat pembelian
function renderPurchaseHistory() {
  historyList.innerHTML = "";

  if (purchaseHistory.length === 0) {
    historyList.innerHTML =
      '<p class="empty-history">Belum ada riwayat pembelian. Silakan melakukan checkout terlebih dahulu.</p>';
  } else {
    purchaseHistory.forEach((order) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-order-id">Pesanan #${order.id}</span>
                    <span class="history-order-date">${order.date}</span>
                </div>
                <div class="history-customer">
                    <p><strong>${order.customer.name}</strong> (${
        order.customer.phone
      })</p>
                    <p>${order.customer.address}</p>
                    <p>Waktu pengiriman: ${
                      order.deliveryTime === "segera"
                        ? "Segera"
                        : order.deliveryTime === "besok"
                        ? "Besok Pagi"
                        : "Besok Sore"
                    }</p>
                    <p>Metode pembayaran: ${
                      order.paymentMethod === "cod"
                        ? "COD"
                        : order.paymentMethod === "qris"
                        ? "QRIS"
                        : "Transfer Bank"
                    }</p>
                </div>
                <div class="history-products">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="history-product-item">
                            <span>${item.name} (${item.quantity}x)</span>
                            <span>${formatRupiah(
                              item.price * item.quantity
                            )}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="history-total">
                    <span>Total Pembayaran</span>
                    <span>${formatRupiah(order.total)}</span>
                </div>
            `;

      historyList.appendChild(historyItem);
    });
  }
}

// Hapus riwayat pembelian
function clearPurchaseHistory() {
  if (purchaseHistory.length === 0) {
    showNotification("Riwayat pembelian sudah kosong");
    return;
  }

  if (
    confirm(
      "Apakah Anda yakin ingin menghapus semua riwayat pembelian? Tindakan ini tidak dapat dibatalkan."
    )
  ) {
    purchaseHistory = [];
    localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));
    renderPurchaseHistory();

    showNotification("Riwayat pembelian berhasil dihapus");
  }
}

// Tampilkan notifikasi
function showNotification(message) {
  // Cek apakah sudah ada notifikasi
  let notification = document.querySelector(".notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.display = "block";

  // Animasi muncul
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Sembunyikan setelah 3 detik
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";

    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, 3000);
}

// Simpan keranjang ke localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Dapatkan filter aktif
function getActiveFilter() {
  const activeFilter = document.querySelector(".filter-btn.active");
  return activeFilter ? activeFilter.dataset.filter : "all";
}

// Navigasi antar section
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").substring(1);

    // Update active nav link
    navLinks.forEach((navLink) => navLink.classList.remove("active"));
    link.classList.add("active");

    // Tampilkan section yang sesuai
    sections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === targetId) {
        section.classList.add("active");
      }
    });

    // Tutup menu mobile jika terbuka
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    }

    // Scroll ke atas
    window.scrollTo(0, 0);
  });
});

// Filter produk
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update active filter button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Render produk dengan filter
    renderProducts(button.dataset.filter);
  });
});

// Toggle menu mobile
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Tutup modal
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    qrisModal.style.display = "none";
    successModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
});

// Konfirmasi pembayaran QRIS
confirmPaymentBtn.addEventListener("click", () => {
  const orderData = confirmPaymentBtn.dataset.order;
  if (orderData) {
    const order = JSON.parse(orderData);
    completePurchase(order);
  }
});

// Event listener untuk clear cart
clearCartBtn.addEventListener("click", clearCart);

// Event listener untuk clear history
clearHistoryBtn.addEventListener("click", clearPurchaseHistory);

// Event listener untuk form checkout
checkoutForm.addEventListener("submit", processCheckout);

// Inisialisasi aplikasi
function init() {
  // Render produk pertama kali
  renderProducts();

  // Update UI keranjang
  updateCartUI();

  // Render riwayat pembelian
  renderPurchaseHistory();

  // Tambahkan style untuk notifikasi
  const style = document.createElement("style");
  style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--dark-brown);
            color: var(--primary-yellow);
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 3000;
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        }
    `;
  document.head.appendChild(style);
}

// Jalankan inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", init);
