<?php
// Beveiligingsinstellingen
header('Content-Type: application/json');

// Alleen POST requests toestaan
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode niet toegestaan']);
    exit;
}

// Configuratie
$ontvangerEmail = "info@nordicfix.nl";
$websiteNaam = "NordicFix";

// Formulierdata ophalen en beveiligen
$naam = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$bedrijf = isset($_POST['company']) ? strip_tags(trim($_POST['company'])) : '';
$service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : '';
$bericht = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validatie
$errors = [];

if (empty($naam)) {
    $errors[] = "Naam is verplicht";
}

if (empty($email)) {
    $errors[] = "E-mailadres is verplicht";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Ongeldig e-mailadres";
}

if (empty($service)) {
    $errors[] = "Service selectie is verplicht";
}

if (empty($bericht)) {
    $errors[] = "Bericht is verplicht";
}

// Als er errors zijn, stuur deze terug
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Service namen vertalen
$serviceNamen = [
    'customer-service' => 'Customer Service',
    'website' => 'Website Development',
    'kennisshop' => 'Kennis.shop Expert',
    'tools' => 'Toolintegraties & Automatisering',
    'seo' => 'SEO Optimalisatie',
    'sparren' => 'Effectief Sparren',
    'anders' => 'Iets anders'
];

$serviceNaam = isset($serviceNamen[$service]) ? $serviceNamen[$service] : $service;

// E-mail samenstellen
$onderwerp = "Nieuw contactformulier bericht van $naam";

$emailBericht = "
Je hebt een nieuw bericht ontvangen via het contactformulier op $websiteNaam.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACTGEGEVENS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Naam: $naam
E-mail: $email
Bedrijf: " . ($bedrijf ?: 'Niet opgegeven') . "
Interesse in: $serviceNaam

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BERICHT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$bericht

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dit bericht is verzonden op: " . date('d-m-Y \o\m H:i') . "
IP-adres afzender: " . $_SERVER['REMOTE_ADDR'] . "
";

// E-mail headers
$headers = [
    'From' => "$websiteNaam <noreply@nordicfix.nl>",
    'Reply-To' => "$naam <$email>",
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

$headerString = '';
foreach ($headers as $key => $value) {
    $headerString .= "$key: $value\r\n";
}

// E-mail verzenden
$verzonden = mail($ontvangerEmail, $onderwerp, $emailBericht, $headerString);

if ($verzonden) {
    echo json_encode([
        'success' => true,
        'message' => 'Bedankt voor je bericht! Ik neem binnen 24 uur contact met je op.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Er is iets misgegaan bij het verzenden. Probeer het later opnieuw of mail direct naar info@nordicfix.nl'
    ]);
}
?>
