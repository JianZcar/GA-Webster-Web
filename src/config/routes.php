<?php

use flight\Engine;
use flight\net\Router;

/** 
 * @var Router $router 
 * @var Engine $app
 */

$router->get('/', function () use ($app) {
  if (empty($_SESSION['username'])) {
    $app->render('login');
    return;
  }
  $app->render('road-edit');
});

$router->get('/login', function () use ($app) {
  if (!empty($_SESSION['username'])) {
    header('Location: /');
    exit;
  }
  $app->render('login');
});

$router->post('/login', function () {
  $username = trim($_POST['username'] ?? '');
  $password = $_POST['password'] ?? '';

  if ($username === '') {
    echo '<div class="alert alert-danger text-center">Name is required.</div>';
    return;
  }

  if ($password !== 'password') {
    echo '<div class="alert alert-danger text-center">Incorrect password.</div>';
    return;
  }

  $_SESSION['username'] = $username;

  echo '<div class="alert alert-success text-center">Welcome, ' . htmlspecialchars($username) . '!</div>';
  echo '<script>window.location.reload(true);</script>';
  header('Location: /');
});
