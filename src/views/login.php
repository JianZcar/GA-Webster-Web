<dialog id="login-modal" class="rounded-md p-6 w-full max-w-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-xs">
  <div id="error-box" class="mb-2 text-sm"></div>

  <form
    hx-post="/login"
    hx-target="#error-box"
    hx-swap="innerHTML"
    hx-indicator="#submit">
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input type="text" id="username" name="username" required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div class="mb-4">
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input type="password" id="password" name="password" required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <button id="submit" type="submit"
      class="w-full py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <span id="submit-label">Login</span>
      <div id="spinner" class="htmx-indicator animate-spin w-3 h-3 border-4 border-white-500 border-t-transparent rounded-full" role="status"></div>
    </button>
  </form>

  <script>
    $('#login-modal').on('cancel', e => e.preventDefault())[0].showModal();
  </script>
  <script src="/js/auth-enforcer.js"></script>
</dialog>
