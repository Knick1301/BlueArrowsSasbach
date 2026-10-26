<?php

declare(strict_types=1);

// Nimmt Laufschul-Anmeldungen entgegen und schickt sie per Mail an den Verein.
// Auswahlwerte und Prüfregeln entsprechen src/utils/laufschulAnmeldung.ts – dort mitpflegen.

const EMPFAENGER = 'mail@bluearrows.de';
const ABSENDER = 'mail@bluearrows.de';
const RATE_DIR = __DIR__ . '/cache';
const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;
const MAX_BODY = 20000;
const MAX_LAENGE = 200;
const MAX_LAENGE_NACHRICHT = 2000;
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://localhost:5173',
    'https://blue-arrows-sasbach.vercel.app',
    'https://www.bluearrows.de',
    'https://bluearrows.de',
];

const GESCHLECHTER = ['weiblich', 'männlich'];
const ERFAHRUNG = [
    'noch keine Erfahrung (noch nie Inlineskates gefahren)',
    'Anfänger',
    'Fortgeschritten',
];
const LEIHAUSRUESTUNG = [
    'Inline-Skates',
    'Schutzausrüstung (Hand-, Knie-, Ellbogenschoner)',
    'Helm',
    'Sonstiges',
];
const WOCHENTAGE = ['Dienstag', 'Donnerstag', 'Freitag', 'Samstag (vormittags)'];
const ERWACHSENENKURS = ['Ja', 'Nein'];

function sendJson(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message, array $fehler = []): void
{
    $payload = ['error' => $message];
    if ($fehler !== []) {
        $payload['fehler'] = $fehler;
    }
    sendJson($status, $payload);
}

function applyCors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

function text(array $daten, string $feld): string
{
    $wert = $daten[$feld] ?? '';
    return is_string($wert) ? trim($wert) : '';
}

function liste(array $daten, string $feld): array
{
    $wert = $daten[$feld] ?? [];
    if (!is_array($wert)) {
        return [];
    }
    return array_values(array_filter($wert, 'is_string'));
}

function laenge(string $wert): int
{
    return function_exists('mb_strlen') ? mb_strlen($wert, 'UTF-8') : strlen($wert);
}

function istGueltigesGeburtsdatum(string $datum): bool
{
    $geburt = DateTimeImmutable::createFromFormat('!Y-m-d', $datum);
    if ($geburt === false || $geburt->format('Y-m-d') !== $datum) {
        return false;
    }
    $heute = new DateTimeImmutable('today');
    return $geburt <= $heute && $geburt >= $heute->modify('-100 years');
}

function validiere(array $d): array
{
    $fehler = [];

    $pflicht = [
        'vorname' => 'Bitte den Vornamen des Kindes angeben.',
        'name' => 'Bitte den Nachnamen des Kindes angeben.',
        'erziehungsberechtigter' => 'Bitte den Namen eines Erziehungsberechtigten angeben.',
        'wohnort' => 'Bitte den Wohnort angeben.',
    ];
    foreach ($pflicht as $feld => $meldung) {
        $wert = text($d, $feld);
        if ($wert === '') {
            $fehler[$feld] = $meldung;
        } elseif (laenge($wert) > MAX_LAENGE) {
            $fehler[$feld] = 'Bitte höchstens ' . MAX_LAENGE . ' Zeichen.';
        }
    }

    if (!in_array(text($d, 'geschlecht'), GESCHLECHTER, true)) {
        $fehler['geschlecht'] = 'Bitte ein Geschlecht auswählen.';
    }

    if (!istGueltigesGeburtsdatum(text($d, 'geburtsdatum'))) {
        $fehler['geburtsdatum'] = 'Bitte ein gültiges Geburtsdatum angeben.';
    }

    $telefon = text($d, 'telefon');
    if (
        !preg_match('#^\+?[\d\s/()-]+$#', $telefon)
        || strlen(preg_replace('/\D/', '', $telefon)) < 6
        || laenge($telefon) > MAX_LAENGE
    ) {
        $fehler['telefon'] = 'Bitte eine gültige Telefonnummer angeben.';
    }

    $email = text($d, 'email');
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || laenge($email) > MAX_LAENGE) {
        $fehler['email'] = 'Bitte eine gültige E-Mail-Adresse angeben.';
    }

    if (!in_array(text($d, 'erfahrung'), ERFAHRUNG, true)) {
        $fehler['erfahrung'] = 'Bitte die Erfahrung auf Skates auswählen.';
    }

    $leih = liste($d, 'leihausruestung');
    if (array_diff($leih, LEIHAUSRUESTUNG) !== []) {
        $fehler['leihausruestung'] = 'Ungültige Auswahl bei der Leihausrüstung.';
    }
    $leihDetails = text($d, 'leihDetails');
    $brauchtDetails = in_array('Inline-Skates', $leih, true) || in_array('Sonstiges', $leih, true);
    if ($brauchtDetails && $leihDetails === '') {
        $fehler['leihDetails'] = 'Bitte Schuhgröße bzw. gewünschte Ausrüstung angeben.';
    } elseif (laenge($leihDetails) > MAX_LAENGE) {
        $fehler['leihDetails'] = 'Bitte höchstens ' . MAX_LAENGE . ' Zeichen.';
    }

    $tage = liste($d, 'wochentage');
    if ($tage === []) {
        $fehler['wochentage'] = 'Bitte mindestens einen Wochentag wählen.';
    } elseif (array_diff($tage, WOCHENTAGE) !== []) {
        $fehler['wochentage'] = 'Ungültige Auswahl bei den Wochentagen.';
    }

    if (!in_array(text($d, 'erwachsenenkurs'), ERWACHSENENKURS, true)) {
        $fehler['erwachsenenkurs'] = 'Bitte Ja oder Nein auswählen.';
    }

    if (laenge(text($d, 'nachricht')) > MAX_LAENGE_NACHRICHT) {
        $fehler['nachricht'] = 'Bitte höchstens ' . MAX_LAENGE_NACHRICHT . ' Zeichen.';
    }

    if (($d['datenschutz'] ?? false) !== true) {
        $fehler['datenschutz'] = 'Bitte der Datenschutzerklärung zustimmen.';
    }

    return $fehler;
}

// Höchstens RATE_LIMIT Anmeldungen pro IP und Stunde. Die IP wird nur gehasht gespeichert.
function rateLimitErreicht(): bool
{
    if (!is_dir(RATE_DIR) && !mkdir(RATE_DIR, 0755, true) && !is_dir(RATE_DIR)) {
        return false;
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unbekannt';
    $file = RATE_DIR . '/anmeldung_' . hash('sha256', $ip . __FILE__) . '.json';

    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }
    flock($handle, LOCK_EX);
    $zeiten = json_decode((string) stream_get_contents($handle), true);
    $jetzt = time();
    $zeiten = array_values(array_filter(
        is_array($zeiten) ? $zeiten : [],
        fn ($zeit) => is_int($zeit) && $jetzt - $zeit < RATE_WINDOW
    ));
    $erreicht = count($zeiten) >= RATE_LIMIT;
    if (!$erreicht) {
        $zeiten[] = $jetzt;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($zeiten));
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    return $erreicht;
}

function formatiereDatum(string $iso): string
{
    $datum = DateTimeImmutable::createFromFormat('!Y-m-d', $iso);
    return $datum === false ? $iso : $datum->format('d.m.Y');
}

function mailHeaderText(string $wert): string
{
    // Zeilenumbrüche entfernen, damit niemand eigene Mail-Header einschleusen kann.
    return '=?UTF-8?B?' . base64_encode(str_replace(["\r", "\n"], ' ', $wert)) . '?=';
}

// Kommt vom Formular: true, solange in Storyblok „fullyBooked“ gesetzt ist.
function istWarteliste(array $d): bool
{
    return ($d['warteliste'] ?? false) === true;
}

function mailText(array $d): string
{
    $leih = liste($d, 'leihausruestung');
    $zeilen = [
        'Neue Anmeldung zur Laufschule über bluearrows.de',
        'Status:           ' . (istWarteliste($d) ? 'WARTELISTE (Kurse waren voll)' : 'Anmeldung'),
        '',
        'KIND',
        'Vorname:          ' . text($d, 'vorname'),
        'Nachname:         ' . text($d, 'name'),
        'Geschlecht:       ' . text($d, 'geschlecht'),
        'Geburtsdatum:     ' . formatiereDatum(text($d, 'geburtsdatum')),
        '',
        'KONTAKT',
        'Erziehungsber.:   ' . text($d, 'erziehungsberechtigter'),
        'Handy:            ' . text($d, 'telefon'),
        'E-Mail:           ' . text($d, 'email'),
        'Wohnort:          ' . text($d, 'wohnort'),
        '',
        'LAUFSCHULE',
        'Erfahrung:        ' . text($d, 'erfahrung'),
        'Mögliche Tage:    ' . implode(', ', liste($d, 'wochentage')),
        'Leihausrüstung:   ' . ($leih === [] ? 'keine' : implode(', ', $leih)),
    ];
    if (text($d, 'leihDetails') !== '') {
        $zeilen[] = 'Größe/Details:    ' . text($d, 'leihDetails');
    }
    $zeilen[] = 'Erwachsenenkurs:  ' . text($d, 'erwachsenenkurs');
    if (text($d, 'nachricht') !== '') {
        $zeilen[] = '';
        $zeilen[] = 'FRAGEN, ANREGUNGEN, WÜNSCHE';
        $zeilen[] = text($d, 'nachricht');
    }
    $zeilen[] = '';
    $zeilen[] = 'Eingegangen am ' . date('d.m.Y \u\m H:i') . ' Uhr. Einwilligung Datenschutz: ja';
    $zeilen[] = 'Auf diese Mail antworten = Antwort an die Eltern.';

    return implode("\r\n", $zeilen);
}

date_default_timezone_set('Europe/Berlin');
applyCors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    fail(405, 'Nur POST erlaubt.');
}

$body = (string) file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
if (strlen($body) > MAX_BODY) {
    fail(413, 'Anfrage zu groß.');
}
$daten = json_decode($body, true);
if (!is_array($daten)) {
    fail(400, 'Ungültige Anfrage.');
}

// Honeypot ausgefüllt: Bot. So tun, als hätte es geklappt.
if (text($daten, 'website') !== '') {
    sendJson(200, ['ok' => true]);
}

$fehler = validiere($daten);
if ($fehler !== []) {
    fail(422, 'Bitte die markierten Felder prüfen.', $fehler);
}

if (rateLimitErreicht()) {
    fail(429, 'Zu viele Anmeldungen. Bitte später erneut versuchen.');
}

$betreff = (istWarteliste($daten) ? 'Warteliste: ' : '') . 'Laufschul-Anmeldung: '
    . text($daten, 'vorname') . ' ' . text($daten, 'name');
$headers = [
    'From: ' . mailHeaderText('Blue Arrows Website') . ' <' . ABSENDER . '>',
    // E-Mail ist per FILTER_VALIDATE_EMAIL geprüft und enthält daher keine Zeilenumbrüche.
    'Reply-To: ' . text($daten, 'email'),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

// @: eine PHP-Warnung würde sonst die JSON-Antwort zerstören; Fehler landet unten im Log.
$gesendet = @mail(
    EMPFAENGER,
    mailHeaderText($betreff),
    mailText($daten),
    implode("\r\n", $headers),
    '-f' . ABSENDER
);

if (!$gesendet) {
    error_log('Laufschul-Anmeldung: mail() fehlgeschlagen.');
    fail(500, 'Die Anmeldung konnte nicht versendet werden.');
}

sendJson(200, ['ok' => true]);
