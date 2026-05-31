/* ===== BLOG FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards  = document.querySelectorAll('.blog-list-card');
const featured   = document.querySelector('.blog-featured');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // featured post
    if (featured) {
      const fc = featured.dataset.category;
      featured.style.display = (filter === 'all' || fc === filter) ? '' : 'none';
    }

    blogCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
