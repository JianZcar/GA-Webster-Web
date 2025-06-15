<?php

use flight\Engine;
use flight\net\Router;

/** 
 * @var Router $router 
 * @var Engine $app
 */

$app->map('notFound', function () use ($app) {
  http_response_code(404);
  $app->render('404');
});

$router->get('/', function () use ($app) {
  $app->render('main');
  empty($_SESSION['username']) && $app->render('login');
});

$router->get('/roadedit', function () use ($app) {
  echo $app->view()->fetch('road-edit');
});

$router->get('/about', function () use ($app) {
  echo $app->view()->fetch('about');
});

$router->get('/edit', function () use ($app) {
  $app->render('xml-editor');
});


$router->get('/login', function () use ($app) {
  if (empty($_SESSION['username']) && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
    $app->render('login');
  } else {
    http_response_code(403);
    $app->render('403');
  }
});

$router->get('/logged', function () {
  echo json_encode(!empty($_SESSION['username']));
});

$router->get('/wasm', function () use ($app) {
  $app->render('test-wasm');
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
