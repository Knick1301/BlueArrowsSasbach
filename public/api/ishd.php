<?php

declare(strict_types=1);

const ISHD_BASE = 'https://ishd.de';
const CLUB_SLUG = 'blue-arrows-sasbach';
const CACHE_TTL = 900;
const CACHE_DIR = __DIR__ . '/cache';
const PAGE_LIMIT = 30;
const MAX_PAGES = 20;
const TEAM_PATTERN = '/^[1-9]-(herren|damen|junioren|jugend|schueler|bambini)$/';
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://localhost:5173',
    'https://blue-arrows-sasbach.vercel.app',
    'https://www.bluearrows.de',
    'https://bluearrows.de',
];

function sendJson(int $status, array $payload, string $cacheState = ''): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=300');
    if ($cacheState !== '') {
        header('X-Cache: ' . $cacheState);
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message): void
{
    sendJson($status, ['error' => $message]);
}

function applyCors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
    }
}

function fetchIshd(string $path): ?array
{
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: BlueArrowsSasbach-Website (+https://www.bluearrows.de)\r\n",
        ],
    ]);

    $body = @file_get_contents(ISHD_BASE . $path, false, $context);
    if ($body === false) {
        return null;
    }

    $statusLine = $http_response_header[0] ?? '';
    if (!preg_match('/\s200\s/', $statusLine)) {
        return null;
    }

    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

function fetchSchedule(string $team, int $season): ?array
{
    $basePath = '/vereine/verein/' . CLUB_SLUG . '/' . $team . '/spielplan/' . $season . '.json';
    $games = [];
    $page = 1;
    $pages = 1;

    do {
        $data = fetchIshd($basePath . '?page=' . $page . '&limit=' . PAGE_LIMIT);
        if ($data === null) {
            return null;
        }
        $pages = (int) ($data['pages'] ?? 1);
        foreach ($data['_embedded']['schedule'] ?? [] as $game) {
            $games[] = $game;
        }
        $page++;
    } while ($page <= $pages && $page <= MAX_PAGES);

    return ['season' => $season, 'team' => $team, 'games' => $games];
}

function fetchTables(array $schedule): ?array
{
    $leagues = [];
    foreach ($schedule['games'] as $game) {
        $href = $game['league']['_links']['self']['href'] ?? '';
        if (preg_match('#^/saison/\d{4}/ligen/[a-z0-9-]+$#', $href) && !isset($leagues[$href])) {
            $leagues[$href] = [
                'name' => $game['league']['name'] ?? '',
                'code' => $game['league']['code'] ?? '',
            ];
        }
    }

    $tables = [];
    foreach ($leagues as $href => $league) {
        $data = fetchIshd($href . '/tabelle.json');
        if ($data === null) {
            return null;
        }
        $tables[] = [
            'league' => $league,
            'placements' => array_values($data['placements'] ?? []),
            'modifications' => $data['modifications'] ?? [],
        ];
    }

    return ['season' => $schedule['season'], 'team' => $schedule['team'], 'tables' => $tables];
}

function readCache(string $file): ?array
{
    if (!is_file($file)) {
        return null;
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : null;
}

function writeCache(string $file, array $data): void
{
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    rename($tmp, $file);
}

function cached(string $key, callable $loader): array
{
    $file = CACHE_DIR . '/' . $key . '.json';
    $cachedData = readCache($file);

    if ($cachedData !== null && time() - filemtime($file) < CACHE_TTL) {
        return [$cachedData, 'HIT'];
    }

    $lock = fopen(CACHE_DIR . '/' . $key . '.lock', 'c');
    if ($lock !== false) {
        flock($lock, LOCK_EX);
        clearstatcache(true, $file);
        $cachedData = readCache($file);
        if ($cachedData !== null && time() - filemtime($file) < CACHE_TTL) {
            flock($lock, LOCK_UN);
            fclose($lock);
            return [$cachedData, 'HIT'];
        }
    }

    $fresh = $loader();
    if ($fresh !== null) {
        writeCache($file, $fresh);
    }

    if ($lock !== false) {
        flock($lock, LOCK_UN);
        fclose($lock);
    }

    if ($fresh !== null) {
        return [$fresh, 'MISS'];
    }
    if ($cachedData !== null) {
        return [$cachedData, 'STALE'];
    }
    return [null, 'ERROR'];
}

applyCors();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    fail(405, 'Nur GET erlaubt.');
}

$typ = $_GET['typ'] ?? '';
if (!in_array($typ, ['spielplan', 'tabelle'], true)) {
    fail(400, 'Ungültiger Parameter "typ" (erlaubt: spielplan, tabelle).');
}

$team = $_GET['team'] ?? '';
if (!is_string($team) || !preg_match(TEAM_PATTERN, $team)) {
    fail(400, 'Ungültiger Parameter "team" (z. B. 1-herren, 2-schueler).');
}

$currentYear = (int) date('Y');
$season = $currentYear;
if (isset($_GET['saison'])) {
    if (!is_string($_GET['saison']) || !preg_match('/^\d{4}$/', $_GET['saison'])) {
        fail(400, 'Ungültiger Parameter "saison".');
    }
    $season = (int) $_GET['saison'];
    if ($season < 2010 || $season > $currentYear + 1) {
        fail(400, 'Ungültiger Parameter "saison".');
    }
}

if (!is_dir(CACHE_DIR) && !mkdir(CACHE_DIR, 0755, true) && !is_dir(CACHE_DIR)) {
    fail(500, 'Cache-Ordner konnte nicht angelegt werden.');
}

$scheduleKey = 'spielplan_' . $team . '_' . $season;
[$schedule, $scheduleState] = cached($scheduleKey, fn () => fetchSchedule($team, $season));

if ($schedule === null) {
    fail(502, 'ISHD ist gerade nicht erreichbar.');
}

if ($typ === 'spielplan') {
    sendJson(200, $schedule, $scheduleState);
}

[$tables, $tablesState] = cached('tabelle_' . $team . '_' . $season, fn () => fetchTables($schedule));

if ($tables === null) {
    fail(502, 'ISHD ist gerade nicht erreichbar.');
}

sendJson(200, $tables, $tablesState);
