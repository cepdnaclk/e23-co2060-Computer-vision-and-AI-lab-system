// Dropdown toggle (click) + close on outside click + ESC
const dropdownButtons = document.querySelectorAll("[data-dropdown]");
const dropdownMenus = document.querySelectorAll(".dropdown-menu");

function closeAllDropdowns() {
  dropdownMenus.forEach(m => (m.style.display = "none"));
}

dropdownButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = btn.getAttribute("data-dropdown");
    const menu = document.getElementById(id);

    const isOpen = menu.style.display === "block";
    closeAllDropdowns();
    menu.style.display = isOpen ? "none" : "block";
  });
});

document.addEventListener("click", () => closeAllDropdowns());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

// Search open/close
const searchRow = document.getElementById("searchRow");
const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

function setSearch(open) {
  searchRow.style.display = open ? "block" : "none";
  searchRow.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) setTimeout(() => searchInput.focus(), 50);
}
openSearch.addEventListener("click", (e) => {
  e.stopPropagation();
  setSearch(searchRow.style.display !== "block");
});
closeSearch.addEventListener("click", () => setSearch(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setSearch(false);
});

// Mobile nav toggle
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});