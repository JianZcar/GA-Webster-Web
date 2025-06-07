<?php

use flight\Engine;
use flight\net\Router;

/** 
 * @var Router $router 
 * @var Engine $app
 */

$router->get('/', function () use ($app) {
  if (empty($_SESSION['username'])) {
    $app->render('road-edit');
    $app->render('login');
    return;
  }
  $app->render('road-edit');
});

$router->get('/login', function () use ($app) {
  if (empty($_SESSION['username']) && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
    $app->render('login');
  } else {
    http_response_code(403);
    $app->render('forbidden');
  }
});

$router->get('/logged', function () {
  echo json_encode(!empty($_SESSION['username']));
});

$router->post('/login', function () {
  $username = trim($_POST['username'] ?? '');
  $password = $_POST['password'] ?? '';

  if ($username === '') {
    echo '<div class="text-red-600 text-center">Name is required.</div>';
    return;
  }

  if ($password !== 'password') {
    echo '<div class="text-red-600 text-center">Incorrect password.</div>';
    return;
  }

  $_SESSION['username'] = $username;

  echo '<div id="login-success" class="text-green-600 text-center">Welcome, ' . htmlspecialchars($username) . '!</div>
        <script>setTimeout(() => { $("#login-modal")[0].close(); $("#login-modal").remove(); }, 2000)</script>';
});
