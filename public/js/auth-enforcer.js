(async function authEnforcer() {
  async function checkSession() {
    try {
      const res = await fetch('/logged');
      return await res.json();
    } catch (e) {
      console.error('Error checking session:', e);
      return false;
    }
  }

  async function showLoginModal() {
    let modal = document.querySelector('#login-modal');

    if (!modal) {
      const loginRes = await fetch('/login', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const html = await loginRes.text();
      document.body.insertAdjacentHTML('beforeend', html);
      modal = document.querySelector('#login-modal');
      if (window.htmx) htmx.process(modal);
    }

    // Add close listener once
    if (!modal.dataset.listenerAttached) {
      modal.addEventListener('close', async () => {
        const stillLoggedIn = await checkSession();
        if (!stillLoggedIn) {
          await showLoginModal();
        }
      });
      modal.dataset.listenerAttached = 'true'; // mark to avoid duplicate listeners
    }

    if (typeof modal.showModal === 'function' && !modal.open) {
      alert('You must login to access');
      modal.showModal();
    }
  }

  const isLoggedIn = await checkSession();
  if (!isLoggedIn) {
    await showLoginModal();
  }

  // Fallback: observe if modal is removed entirely
  const observer = new MutationObserver(async (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const removedNode of mutation.removedNodes) {
        if (
          removedNode.id === 'login-modal' ||
          (removedNode.querySelector && removedNode.querySelector('#login-modal'))
        ) {
          const stillLoggedIn = await checkSession();
          if (!stillLoggedIn) {
            await showLoginModal();
          } else {
            observer.disconnect();
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true });
})();
