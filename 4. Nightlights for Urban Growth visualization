//Importing Ranchi district shapefile and Nighttime lights datasets
var roi = ee.FeatureCollection("projects/ee-rachit2147/assets/Ranchi"),
    DMSP = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS"),
// VIIRS = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG");

//DMSP-OLS FOR 1992
var roi = ee.FeatureCollection("projects/ee-rachit2147/assets/Ranchi");
var geometry = roi.geometry();
var data_1992 = DMSP.select('avg_vis')
.filterDate('1992-01-01', '1992-12-31').filterBounds(roi).median();
var med_data1 = data_1992.clip(geometry);
Map.addLayer(med_data1,{min:2, max:52},'1992');

//DMSP-OLS FOR 2002
var data_2002 = DMSP.select('avg_vis')
.filterDate('2002-01-01', '2002-12-31').filterBounds(roi).median();
var med_data2 = data_2002.clip(geometry);
Map.addLayer(med_data2,{min:2.5, max:62.5},'2002');

//DMSP-OLS FOR 2013
var data_2013 = DMSP.select('avg_vis')
.filterDate('2013-01-01', '2013-12-31').filterBounds(roi).median();
var med_data3 = data_2013.clip(geometry);
Map.addLayer(med_data3,{min:3, max:63},'2013');

//VIIRS FOR 2022 DATA
var data_2022 = VIIRS.select('avg_rad')
.filterDate('2022-01-01', '2022-12-31').filterBounds(roi).median();
var med_data4 = data_2022.clip(geometry);
Map.addLayer(med_data4,{min:0.3275, max:51.9525},'2022');

//Exporting the images, specifying scale and region. 
Export.image.toDrive({ 
  image: med_data1,
  description: 'nightlights_1992', 
  scale: 1000, 
  region: roi 
});

Export.image.toDrive({ 
  image: med_data2,
  description: 'nightlights_2002', 
  scale: 1000, 
  region: roi 
});

Export.image.toDrive({ 
  image: med_data3,
  description: 'nightlights_2013', 
  scale: 1000, 
  region: roi 
});

Export.image.toDrive({ 
  image: med_data4,
  description: 'nightlights_2022', 
  scale: 1000, 
  region: roi 
});
