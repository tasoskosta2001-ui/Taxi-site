(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  const panels = document.querySelectorAll('#discoveryPanels > section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.01});
  panels.forEach(panel => { panel.classList.add('reveal'); observer.observe(panel); });
  document.documentElement.classList.add('motion-ready');
})();
