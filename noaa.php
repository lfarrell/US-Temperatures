<?php
$months = range(1,12);
/*
foreach($months as $month) {
    if($month < 10) { $month = "0" . $month; }

    $links = [
       'temp' => "http://www.ncdc.noaa.gov/cag/time-series/us/110/00/tavg/1/$month/1895-2015.csv?base_prd=true&firstbaseyear=1901&lastbaseyear=2000",
   //    'temp' =>  "http://www.ncdc.noaa.gov/cag/time-series/us/110/00/tavg/1/$month/1895-2015.csv?base_prd=true&firstbaseyear=1895&lastbaseyear=2015",
     //  'precip' => "http://www.ncdc.noaa.gov/cag/time-series/us/110/00/pcp/1/$month/1895-2015.csv?base_prd=true&firstbaseyear=1895&lastbaseyear=2015"
    ];

    foreach($links as $type => $link) {
        $ch = curl_init($link);
        $fp = fopen("us_all_data/$type" . '_' . "$month.csv", "wb");

        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        curl_exec($ch);
        curl_close($ch);
        fclose($fp);
    }

    echo $month . " processed\n";
}

$state_nums = range(1,48);
foreach($state_nums as $state_num) {
    if($state_num < 10) { $state_num = "0" . $state_num; }

    $states = [
        'states_temp' => "http://www.ncdc.noaa.gov/cag/time-series/us/$state_num/00/tavg/1/",
        'states_precip' => "http://www.ncdc.noaa.gov/cag/time-series/us/$state_num/00/pcp/1/"
    ];

    foreach($states as $dir => $state) {
        foreach($months as $month) {
            if($month < 10) { $month = "0" . $month; }

            $ch = curl_init($state . $month . "/1895-2014.csv?base_prd=true&firstbaseyear=1895&lastbaseyear=2014");
            $fp = fopen("us_all_data/$dir/" . $state_num . '_' . "$month.csv", "wb");

            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_HEADER, 0);

            curl_exec($ch);
            curl_close($ch);
            fclose($fp);
        }
    }

    echo $state_num . "processed\n";
}
*/
$state_list = array(
    'AL'=>"Alabama",
    'AZ'=>"Arizona",
    'AR'=>"Arkansas",
    'CA'=>"California",
    'CO'=>"Colorado",
    'CT'=>"Connecticut",
    'DE'=>"Delaware",
    'FL'=>"Florida",
    'GA'=>"Georgia",
    'ID'=>"Idaho",
    'IL'=>"Illinois",
    'IN'=>"Indiana",
    'IA'=>"Iowa",
    'KS'=>"Kansas",
    'KY'=>"Kentucky",
    'LA'=>"Louisiana",
    'ME'=>"Maine",
    'MD'=>"Maryland",
    'MA'=>"Massachusetts",
    'MI'=>"Michigan",
    'MN'=>"Minnesota",
    'MS'=>"Mississippi",
    'MO'=>"Missouri",
    'MT'=>"Montana",
    'NE'=>"Nebraska",
    'NV'=>"Nevada",
    'NH'=>"New Hampshire",
    'NJ'=>"New Jersey",
    'NM'=>"New Mexico",
    'NY'=>"New York",
    'NC'=>"North Carolina",
    'ND'=>"North Dakota",
    'OH'=>"Ohio",
    'OK'=>"Oklahoma",
    'OR'=>"Oregon",
    'PA'=>"Pennsylvania",
    'RI'=>"Rhode Island",
    'SC'=>"South Carolina",
    'SD'=>"South Dakota",
    'TN'=>"Tennessee",
    'TX'=>"Texas",
    'UT'=>"Utah",
    'VT'=>"Vermont",
    'VA'=>"Virginia",
    'WA'=>"Washington",
    'WV'=>"West Virginia",
    'WI'=>"Wisconsin",
    'WY'=>"Wyoming"
);

$files = scandir('us_all_data/temp');
$fh = fopen("us_all.csv", "wb");
fputcsv($fh, ['date', 'value', 'anomaly', 'state']);

foreach($files as $file) {
    if(!is_dir($file) || !preg_match('/^./', $file)) {
        if (($handle = fopen("us_all_data/temp/" . $file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if(preg_match('/^\d/', $data[0])) {
                    $date = str_split($data[0], 2);
                    $data[0] = $date[2] . '/' . $date[0] . $date[1];
                    $data[3] = 'US';
                    fputcsv($fh, $data);
                }
            }
            fclose($handle);
        }
    }
}
fclose($fh);