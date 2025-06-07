(function authEnforcer() {
  const checkSession = async () => {
    try {
      const res = await fetch('/logged');
      const isLoggedIn = await res.json();

      if (isLoggedIn) {
        clearInterval(intervalId);
      }; // user is logged in

      let modal = document.querySelector('#login-modal');

      if (!modal) {
        const loginRes = await fetch('/login/');
        const html = await loginRes.text();
        document.body.insertAdjacentHTML('beforeend', html);
        modal = document.querySelector('#login-modal');

        htmx.process(modal);
      }

      if (modal && typeof modal.showModal === 'function' && !modal.open) {
        alert("You must login to access");
        modal.showModal();
      }
    } catch (err) {
      console.error('Error checking login status:', err);
    }
  };

  setInterval(checkSession, 500);
})();
