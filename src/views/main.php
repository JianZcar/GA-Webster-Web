<!DOCTYPE html>
<html lang="en" class="h-full">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GAxWebster</title>
  <?php require_once(__DIR__ . '/../includes/imports.php'); ?>
  <script src="https://cdn.jsdelivr.net/npm/d3/dist/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.3/ace.js"></script>
</head>

<body class="h-full m-0 p-0">
  <div x-data="{ current: 'roadedit' }" class="h-full flex flex-col">

    <!-- Tabs -->
    <div class="flex min-h-14 px-4 pt-4 gap-4 text-sm">
      <div class="tabs tabs-box">
        <input type="radio" name="nav-tab" class="tab" aria-label="Road Editor" checked="checked"
          hx-get="/roadedit"
          hx-target="#content"
          hx-swap="innerHTML" />
        <input type="radio" name="nav-tab" class="tab" aria-label="XML Editor"
          hx-get="/edit"
          hx-target="#content"
          hx-swap="innerHTML" />
        <input type="radio" name="nav-tab" class="tab" aria-label="About"
          hx-get="/about"
          hx-target="#content"
          hx-swap="innerHTML" />
      </div>
    </div>

    <!-- HTMX content container -->
    <div id="content"
      class="flex-1 w-full opacity-0 transition-opacity duration-500"
      hx-on::after-request="this.classList.add('opacity-100'); this.classList.remove('opacity-0')"
      hx-get="/roadedit"
      hx-trigger="load"
      hx-target="this"
      hx-swap="innerHTML">
    </div>

  </div>
</body>

</html>
