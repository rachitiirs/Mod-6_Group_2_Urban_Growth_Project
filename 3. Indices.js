/////For making binary file of built-up index from landsat 5 and landsat 8 data./////
///For visualization.//
var l5_fcc_vis ={min: 0, max: 3000, bands: ['B4','B3','B2']};

Map.addLayer(table, {}, "ROI", true);
Map.centerObject(table, 10);

/////For the year 1992./////
var L5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")
        .filterDate('1992-01-01','1992-12-31')
        .filterBounds(table)
        .filterMetadata('CLOUD_COVER', 'less_than', 30);
        
var L5_1992_median_image = ee.Image(L5.median());
Map.addLayer(L5_1992_median_image, l5_fcc_vis, 'L5_1992_median_image', false);

var ndvi_c_1992 = L5_1992_median_image
                  .normalizedDifference(['B4','B3']);
var ndvi_b_1992 = ee.Image.constant(254)
                  .updateMask(ndvi_c_1992.gt(0));
                  
var ndbi_c_1992 = L5_1992_median_image
                  .normalizedDifference(['B5','B4']);
var ndbi_b_1992 = ee.Image.constant(254)
                  .updateMask(ndvi_c_1992.gt(0));
                  
var bu_1992 = ndbi_b_1992.subtract(ndvi_c_1992).rename("bu_1992");

Map.addLayer(ndvi_c_1992, {}, 'ndvi_c_1992', false);
Map.addLayer(ndvi_b_1992, {}, 'ndvi_b_1992', false);
Map.addLayer(ndbi_c_1992, {}, 'ndbi_c_1992', false);
Map.addLayer(ndbi_b_1992, {}, 'ndbi_b_1992', false);

Map.addLayer(bu_1992.clip(table), {}, 'nu_1992');
print(bu_1992.reduceRegion(ee.Reducer.count(),table, 30));


//----------------------For the year 2001.----------------------
// var L5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")
//         .filterDate('2001-01-01','2001-12-31')
//         .filterBounds(table)
//         .filterMetadata('CLOUD_COVER', 'less_than', 30);

// var L5_2001_median_image = ee.Image(L5.median());
// Map.addLayer(L5_2001_median_image, l5_fcc_vis, 'L5_2001_median_image', false);


// var ndvi_c_2001 = L5_2001_median_image
//                   .normalizedDifference(['B4','B3']);
// var ndvi_b_2001 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2001.gt(0));
                  
// var ndbi_c_2001 = L5_2001_median_image
//                   .normalizedDifference(['B5','B4']);
// var ndbi_b_2001 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2001.gt(0));
                  
// var bu_2001 = ndbi_b_2001.subtract(ndvi_c_2001).rename("bu_2001");

// Map.addLayer(ndvi_c_2001, {}, 'ndvi_c_2001', false);
// Map.addLayer(ndvi_b_2001, {}, 'ndvi_b_2001', false);
// Map.addLayer(ndbi_c_2001, {}, 'ndbi_c_2001', false);
// Map.addLayer(ndbi_b_2001, {}, 'ndbi_b_2001', false);

// Map.addLayer(bu_2001, {}, 'nu_2001');
// print(bu_2001.reduceRegion(ee.Reducer.count(),table, 30));
//---------------------------------------------------------------------------

/////------------------For the year 2013 and 2021---------------------
///For visualization of landsat 8 fcc image.///
// var l8_fcc_vis ={min: 0, max: 3000, bands: ['B5','B4','B3']};

// var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
//         .filterDate('2013-01-01','2013-12-31')
//         .filterBounds(table)
//         .filterMetadata('CLOUD_COVER', 'less_than', 30);
        
// var L8_2013_median_image = ee.Image(L8.median());
// Map.addLayer(L8_2013_median_image, l8_fcc_vis, 'L8_2013_median_image', false);

// var ndvi_c_2013 = L8_2013_median_image
//                   .normalizedDifference(['B5','B4']);
// var ndvi_b_2013 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2013.gt(0));
                  
// var ndbi_c_2013 = L8_2013_median_image
//                   .normalizedDifference(['B6','B5']);
// var ndbi_b_2013 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2013.gt(0));
                  
// var bu_2013 = ndbi_b_2013.subtract(ndvi_c_2013).rename("bu_2013");

// Map.addLayer(ndvi_c_2013, {}, 'ndvi_c_2013', false);
// Map.addLayer(ndvi_b_2013, {}, 'ndvi_b_2013', false);
// Map.addLayer(ndbi_c_2013, {}, 'ndbi_c_2013', false);
// Map.addLayer(ndbi_b_2013, {}, 'ndbi_b_2013', false);

// Map.addLayer(bu_2013, {}, 'nu_2013');
// print(bu_2013.reduceRegion(ee.Reducer.count(),table, 30));

///------------------------For the year 2021------------------------
// var l8_fcc_vis ={min: 0, max: 3000, bands: ['B5','B4','B3']};
// var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
//         .filterDate('2021-01-01','2021-12-31')
//         .filterBounds(table)
//         .filterMetadata('CLOUD_COVER', 'less_than', 30);

// var L8_2021_median_image = ee.Image(L8.median());
// Map.addLayer(L8_2021_median_image, l8_fcc_vis, 'L8_2021_median_image', false);


// var ndvi_c_2021 = L8_2021_median_image
//                   .normalizedDifference(['B4','B3']);
// var ndvi_b_2021 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2021.gt(0));
                  
// var ndbi_c_2021 = L8_2021_median_image
//                   .normalizedDifference(['B5','B4']);
// var ndbi_b_2021 = ee.Image.constant(254)
//                   .updateMask(ndvi_c_2021.gt(0));
                  
// var bu_2021 = ndbi_b_2021.subtract(ndvi_c_2021).rename("bu_2001");

// Map.addLayer(ndvi_c_2021, {}, 'ndvi_c_2001', false);
// Map.addLayer(ndvi_b_2021, {}, 'ndvi_b_2001', false);
// Map.addLayer(ndbi_c_2021, {}, 'ndbi_c_2001', false);
// Map.addLayer(ndbi_b_2021, {}, 'ndbi_b_2001', false);

// Map.addLayer(bu_2021, {}, 'nu_2021');
// print(bu_2021.reduceRegion(ee.Reducer.count(),table, 30));
