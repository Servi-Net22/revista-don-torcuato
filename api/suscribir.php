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

if (!empty($data['website'])) {
    echo json_encode(['ok' => true, 'mensaje' => 'Listo, te anotamos.']);
    exit;
}

$email = strtolower(trim((string) ($data['email'] ?? '')));
$whatsapp = preg_replace('/\D+/', '', (string) ($data['whatsapp'] ?? ''));
$porEmail = !empty($data['por_email']);
$porWa = !empty($data['por_whatsapp']);

if ($whatsapp !== '' && substr($whatsapp, 0, 2) !== '54' && strlen($whatsapp) === 10) {
    $whatsapp = '549' . $whatsapp;
}

if ($email === '' && $whatsapp === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Poné un email o un WhatsApp.']);
    exit;
}

if ($porEmail && ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL))) {
    http_response_code(400);
    echo json_encode(['error' => 'El email no es válido.']);
    exit;
}

if ($porWa && strlen($whatsapp) < 10) {
    http_response_code(400);
    echo json_encode(['error' => 'El WhatsApp no es válido.']);
    exit;
}

if (!$porEmail && !$porWa) {
    $porEmail = $email !== '';
    $porWa = $whatsapp !== '';
}

$dir = dirname(__DIR__) . '/_private';
if (!is_dir($dir)) {
    mkdir($dir, 0750, true);
}

$file = $dir . '/suscriptores.json';
$fh = fopen($file, 'c+');
if ($fh === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar en el hosting.']);
    exit;
}

flock($fh, LOCK_EX);
$contents = stream_get_contents($fh);
$list = $contents ? json_decode($contents, true) : [];
if (!is_array($list)) {
    $list = [];
}

$now = date('c');
$found = false;
foreach ($list as &$item) {
    $sameMail = $email !== '' && isset($item['email']) && $item['email'] === $email;
    $sameWa = $whatsapp !== '' && isset($item['whatsapp']) && $item['whatsapp'] === $whatsapp;
    if ($sameMail || $sameWa) {
        $item['email'] = $email !== '' ? $email : ($item['email'] ?? '');
        $item['whatsapp'] = $whatsapp !== '' ? $whatsapp : ($item['whatsapp'] ?? '');
        $item['por_email'] = $porEmail;
        $item['por_whatsapp'] = $porWa;
        $item['actualizado'] = $now;
        $found = true;
        break;
    }
}
unset($item);

if (!$found) {
    $list[] = [
        'email' => $email,
        'whatsapp' => $whatsapp,
        'por_email' => $porEmail,
        'por_whatsapp' => $porWa,
        'alta' => $now,
        'actualizado' => $now,
    ];
}

rewind($fh);
ftruncate($fh, 0);
fwrite($fh, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
fflush($fh);
flock($fh, LOCK_UN);
fclose($fh);

$csv = $dir . '/suscriptores.csv';
$out = fopen($csv, 'w');
if ($out) {
    fputcsv($out, ['email', 'whatsapp', 'por_email', 'por_whatsapp', 'alta']);
    foreach ($list as $row) {
        fputcsv($out, [
            $row['email'] ?? '',
            $row['whatsapp'] ?? '',
            !empty($row['por_email']) ? 'si' : 'no',
            !empty($row['por_whatsapp']) ? 'si' : 'no',
            $row['alta'] ?? '',
        ]);
    }
    fclose($out);
}

$config = is_file($dir . '/config.php') ? require $dir . '/config.php' : [];
$notify = $config['notify_email'] ?? '';
if ($notify && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
    $body = "Nueva suscripción a Revista Brisas\n"
        . "Email: {$email}\n"
        . "WhatsApp: {$whatsapp}\n"
        . "Email: " . ($porEmail ? 'sí' : 'no') . "\n"
        . "WhatsApp: " . ($porWa ? 'sí' : 'no') . "\n";
    @mail($notify, 'Nueva suscripción · Revista Brisas', $body, 'From: ' . $notify);
}

echo json_encode([
    'ok' => true,
    'mensaje' => $found
        ? 'Ya estabas en la lista. Actualizamos tus datos.'
        : 'Listo. Te mandamos la próxima edición.',
]);
