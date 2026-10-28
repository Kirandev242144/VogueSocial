// VogueSocial Documentation Portal - Client App
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.doc-section');
  const menuItems = document.querySelectorAll('.doc-menu-item');
  const tocLinks = document.querySelectorAll('.doc-toc-link');
  const searchInput = document.getElementById('doc-search-input');
  const awbInput = document.getElementById('test-awb-input');
  const carrierBadge = document.getElementById('carrier-result-text');

  // 1. SECTION SWITCHER
  window.switchSection = function(sectionId) {
    if (!sectionId) sectionId = 'overview';
    const targetArticle = document.getElementById('sec-' + sectionId);
    if (!targetArticle) return;

    sections.forEach(sec => sec.classList.remove('active'));
    targetArticle.classList.add('active');

    menuItems.forEach(item => {
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });

    tocLinks.forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Click handlers on sidebar items
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const secId = item.getAttribute('data-section');
      switchSection(secId);
    });
  });

  // Click handlers on TOC links
  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      const secId = link.getAttribute('data-section');
      switchSection(secId);
    });
  });

  // Initialize from hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById('sec-' + initialHash)) {
    switchSection(initialHash);
  } else {
    switchSection('overview');
  }

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById('sec-' + currentHash)) {
      switchSection(currentHash);
    }
  });

  // 2. LIVE AWB CARRIER AUTO-DETECTOR
  if (awbInput && carrierBadge) {
    function detectCarrier(num) {
      num = (num || '').trim().replace(/[\s-]+/g, '').toUpperCase();
      if (!num) return 'Unknown Carrier (Self-Fulfill)';
      if (/^1Z[A-Z0-9]{16}$/i.test(num) || /^1Z/i.test(num)) return 'UPS';
      if (/^(94|92|93|95)\d{18,20}$/.test(num) || /^[A-Z]{2}\d{9}US$/.test(num)) return 'USPS Priority Mail';
      if (/^[A-Z]{2}\d{9}GB$/.test(num)) return 'Royal Mail';
      if (/^BD\d+/.test(num)) return 'Blue Dart';
      if (/^FX/.test(num) || /^\d{12}$/.test(num) || /^\d{15}$/.test(num)) return 'FedEx';
      if (/^\d{10}$/.test(num) || /^J(J)?D/.test(num)) return 'DHL Express';
      return 'Unknown Carrier (Self-Fulfill)';
    }

    awbInput.addEventListener('input', (e) => {
      carrierBadge.textContent = detectCarrier(e.target.value);
    });
  }

  // 3. COPY CODE SNIPPET
  window.copyCodeBlock = function(btn) {
    const codeBlock = btn.closest('.doc-code-block');
    if (!codeBlock) return;
    const pre = codeBlock.querySelector('pre');
    if (!pre) return;

    navigator.clipboard.writeText(pre.innerText).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span style="color:#16a34a;font-weight:700;">Copied!</span>';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    });
  };

  // 4. SEARCH FILTER
  if (searchInput) {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        menuItems.forEach(item => item.style.display = 'flex');
        return;
      }

      menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. GLOSSARY CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.doc-glossary-filter-btn');
  const glossaryCards = document.querySelectorAll('.doc-glossary-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');

      glossaryCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
