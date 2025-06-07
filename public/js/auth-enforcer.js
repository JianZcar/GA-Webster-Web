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
    if (typeof modal.showModal === 'function' && !modal.open) {
      modal.showModal();
    }
    alert('You must login to access');
  }

  const observer = new MutationObserver(async (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const removedNode of mutation.removedNodes) {
        if (
          removedNode.id === 'login-modal' ||
          (removedNode.querySelector && removedNode.querySelector('#login-modal'))
        ) {
          const loggedIn = await checkSession();
          if (!loggedIn) {
            await showLoginModal();
          } else {
            observer.disconnect(); // user logged in, stop observing
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true });
})();
