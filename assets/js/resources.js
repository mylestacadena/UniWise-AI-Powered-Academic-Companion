document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".toggle-btn");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // Tabs switching
  const tabs = document.querySelectorAll("#resourceTabs .nav-link");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // reset all
      tabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.add("d-none"));

      // activate selected
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.remove("d-none");
    });
  });
});
