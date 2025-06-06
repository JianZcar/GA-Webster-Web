<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <link href="css/style.css" rel="stylesheet">

  </style>
</head>

<body class="bg-light d-flex align-items-center justify-content-center vh-100">

  <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
    <h3 class="text-center mb-3">Login</h3>

    <div id="error-box"></div>

    <form
      hx-post="/login"
      hx-target="#error-box"
      hx-swap="innerHTML"
      hx-indicator="#spinner"
      hx-on::afterRequest="if (event.detail.xhr.status === 401 || event.detail.xhr.status === 400) document.querySelector('#error-box').innerHTML = event.detail.xhr.responseText">
      <div class="mb-3">
        <label for="username" class="form-label">Your Name</label>
        <input type="text" class="form-control" id="username" name="username" required>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Shared Password</label>
        <input type="password" class="form-control" id="password" name="password" required>
      </div>

      <div class="d-flex justify-content-center mb-3">
        <div id="spinner" class="spinner-border text-primary htmx-indicator" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>

</body>

</html>
