<?php

$filename = $argv[1];
$base = basename($filename, '.json');
$imgPath = $argv[2] . '/' . $base;

$data = file_get_contents($argv[1]);
$json = json_decode($data);

$start = $json[0];

foreach($json as $i => $v) {
    $v->Video = $start->Video;
    $v->URL = $start->URL;
    $v->Image = $imgPath . '/' . $base . '_' . $i . '.png';
}

$data = json_encode($json);
file_put_contents($filename, $data);
