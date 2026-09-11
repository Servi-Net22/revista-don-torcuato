<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Usá POST']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$config = require dirname(__DIR__) . '/_private/config.php';
$clave = trim((string) ($data['clave'] ?? ''));
if ($clave === '' || !hash_equals((string) $config['lista_clave'], $clave)) {
    http_response_code(401);
    echo json_encode(['error' => 'Clave incorrecta']);
    exit;
}

$file = dirname(__DIR__) . '/_private/suscriptores.json';
$list = [];
if (is_file($file)) {
    $decoded = json_decode((string) file_get_contents($file), true);
    if (is_array($decoded)) {
        $list = $decoded;
    }
}

echo json_encode([
    'ok' => true,
    'total' => count($list),
    'suscriptores' => $list,
]);
