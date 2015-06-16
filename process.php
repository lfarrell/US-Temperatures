<?php
$fh = fopen("all.csv", "wb");
$months = range(1,12);
fputcsv($fh, array_merge(['Year'], $months, ['Yearly_Avg']));

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
                for($i=0; $i<count($row_array); $i++) {
                    $avg_data[0] = $year;

                    if($i >= 1) {
                        if($row_array[$i] == '') continue;
                        $avg_data[$i] = round($row_array[$i] / 100, 2);
                    }
                }
                fputcsv($fh, $avg_data);
                print_r($avg_data);
            }
            fclose($handle);
        }
    }
}

fclose($fh);