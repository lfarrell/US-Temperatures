<?php
$months = range(1,12);
/*
foreach($months as $month) {
   // if($month < 10) { $month = "0" . $month; }

    $link = "http://www.ncdc.noaa.gov/cag/time-series/global/globe/land_ocean/1/$month/1880-2015.csv";

    $ch = curl_init($link);
    $fp = fopen("world/" . $month . ".csv", "wb");

    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    curl_exec($ch);
    curl_close($ch);
    fclose($fp);


    echo $month . " processed\n";
} */

$files = scandir('world');

$fh = fopen('world/all.csv', 'wb');
fputcsv($fh, array('date', 'anomaly'));

foreach($files as $file) {
    if(!is_dir($file)) {
        $month = preg_split('/\./', $file)[0];
        if($month < 10) { $month = '0' . $month; }

        if (($handle = fopen("world/" . $file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if(preg_match('/^\d/', $data[0]) &&  $data[0] > 1894) {
                    $data[0] =  $month . '/' . $data[0];
                 //   $data[1] = ($data[1] * 9/5);
                    fputcsv($fh, $data);
                }
            }

            fclose($handle);
        }
    }
}

