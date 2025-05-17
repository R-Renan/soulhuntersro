export const showToast = (message: string, duration = 3000) => {
  const containerId = "toast-container";

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "fixed bottom-5 right-5 space-y-2 z-50";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className =
    "bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in flex items-center gap-2 transition transform opacity-100";
  toast.innerHTML = `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.7 6.3l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 011.4-1.4L9 10.6l3.3-3.3a1 1 0 011.4 1.4z"/>
    </svg>
    ${message}
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, duration);
};
