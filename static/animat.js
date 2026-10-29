
  (() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // 1. Появление секций при прокрутке
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const elements = document.querySelectorAll(
        [
          '.section-heading',
          '.tariff-grid .tariff',
          '.tariff-note',
          '.steps .step',
          '.visit__panel',
          '.faq__grid > div',
        ].join(', ')
      );

      elements.forEach(element => {
        element.classList.add('reveal');
      });

      document.querySelectorAll('.tariff-grid .tariff')
        .forEach((card, index) => {
          card.style.setProperty(
            '--delay',
            `${index * 95}ms`
          );
        });

      document.querySelectorAll('.steps .step')
        .forEach((card, index) => {
          card.style.setProperty(
            '--delay',
            `${index * 130}ms`
          );
        });

      document.documentElement.classList.add('motion-ready');

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
      });

      elements.forEach(element => observer.observe(element));
    }

    // 2. Свет следует за курсором на тарифах
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.tariff').forEach(card => {
        card.addEventListener('pointermove', event => {
          const rect = card.getBoundingClientRect();

          const x = (event.clientX - rect.left) / rect.width * 100;
          const y = (event.clientY - rect.top) / rect.height * 100;

          card.style.setProperty('--spot-x', `${x}%`);
          card.style.setProperty('--spot-y', `${y}%`);
        });

        card.addEventListener('pointerleave', () => {
          card.style.removeProperty('--spot-x');
          card.style.removeProperty('--spot-y');
        });
      });
    }

    // 3. Тень у шапки при прокрутке
    const header = document.querySelector('.header');

    if (header) {
      const updateHeader = () => {
        header.classList.toggle(
          'header--scrolled',
          window.scrollY > 25
        );
      };

      window.addEventListener('scroll', updateHeader, {
        passive: true
      });

      updateHeader();
    }
  })();

