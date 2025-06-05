<?php
require(__DIR__ . '/' . '../../vendor/autoload.php');
Flight::set('flight.views.path', __DIR__ . '/' . '../views');

$app = Flight::app();
$router = $app->router();
require('routes.php');
$app->start();
