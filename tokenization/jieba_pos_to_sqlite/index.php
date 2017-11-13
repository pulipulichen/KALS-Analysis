<?php
ini_set('max_execution_time', 3000000); //300 seconds = 5 minutes

require 'rb.php';
 R::setup('pgsql:host=localhost;dbname=text_mining',
        'kals','password'); //postgresql

$file = file_get_contents("jieba.dict.utf8.txt");
$file = trim($file);
$lines = explode("\n", $file);
$count = count($lines);

//$beans=R::dispense('bean',count($lines));
foreach ($lines AS $i => $line) {
    $fields = explode(" ", trim($line));
    $bean=R::dispense('bean');
    $bean->word = $fields[0];
    $bean->weight = $fields[1];
    $bean->pos = $fields[2];
    R::store($bean);
    echo $i . " / " . $count . "(" . intval( ($i/$count)*100 ) . ")<br />";
}
//R::storeAll($beans);