<?php
declare(strict_types=1);
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

(require __DIR__ . '/../src/routes.php')($app);

$app->run();

