<?php
$fh = fopen("all.csv", "wb");
$months = range(1,12);
fputcsv($fh, ['date', 'value']);

$directory_name = 'data/ushcn.v2.5.5.20150614';
$files = scandir($directory_name);
foreach($files as $file) {
    if(!is_dir($file) || !preg_match('/^\./', $file)) {
        if (($handle = fopen($directory_name . '/' . $file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $row = preg_replace('/\s+/', ',', $data[0]);
                $row_array = explode(',', $row);
                $year = substr($row_array[0], -4);

                if($year < 1900) continue;

                $avg_data = [];
                for($i=0; $i<13; $i++) {
                    if($i >= 1) {
                        if($row_array[$i] == '' || $row_array[$i] == -9999) continue;
                        $avg_data[0] = $i . '/' . $year;

                        $avg_data[1] = round((($row_array[$i] / 100) * 9/5 + 32), 2); // Convert to Fahrenheit
                        fputcsv($fh, $avg_data);
                    }
                }

              //  print_r($avg_data);
            }
            fclose($handle);
        }
    }
}

fclose($fh);