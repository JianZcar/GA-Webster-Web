<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Not Found</title>

  <?php include_once(__DIR__ . '/' . '../includes/imports.php'); ?>
</head>

<body>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white w-full p-10 text-center">
      <h1 class="text-5xl font-extrabold text-red-600 mb-6 tracking-wide">404 Not Found</h1>
      <p class="text-gray-600 mb-8 text-lg leading-relaxed">
        The page you have requested could not be found.
      </p>
      <a href="/"
        class="inline-block px-8 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-shadow shadow-md hover:shadow-lg">
        Go to Homepage
      </a>
    </div>
  </div>
</body>

</html>
