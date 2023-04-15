//Importing required assets
var roi = ee.FeatureCollection("projects/ee-rachit2147/assets/Ranchi"),
    LULC_1992 = ee.Image("projects/ee-rachit2147/assets/LULC_1992"),
    LULC_2001 = ee.Image("projects/ee-rachit2147/assets/LULC_2001"),
    LULC_2013 = ee.Image("projects/ee-rachit2147/assets/LULC_2013"),
    LULC_2022 = ee.Image("projects/ee-rachit2147/assets/LULC_2022");

Map.centerObject(roi);

var previousyear = LULC_1992.remap([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]);
var nextyear = LULC_2001.remap([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]);

// // Show all builtup areas
var builtup1992 = LULC_1992.clip(roi).eq(0);
var builtup2001 = LULC_2001.clip(roi).eq(0);
var builtup2013 = LULC_2013.clip(roi).eq(0);
var builtup2022 = LULC_2022.clip(roi).eq(0);


// // Selecting pixels that have changed from all other classes to the built-up class
var change1 = builtup2001.and(builtup1992.not());
var change2 = builtup2013.and(builtup2001.not());
var change3 = builtup2022.and(builtup2013.not());
var change4 = builtup2022.and(builtup1992.not());

// // Display the builtup pixels on the map
// Map.addLayer(builtup1992, {min: 0, max: 1, palette: 'white, red'}, 'Builtup_1992');
// Map.addLayer(builtup2001, {min: 0, max: 1, palette: 'white, red'}, 'Builtup_2001');
// Map.addLayer(builtup2013, {min: 0, max: 1, palette: 'white, red'}, 'Builtup_2013');
// Map.addLayer(builtup2022, {min: 0, max: 1, palette: 'white, red'}, 'Builtup_2022');


//Display the change/increase in builtup pixels on the map
// Map.addLayer(change1, {min:0, max:1, palette: ['white', 'red']}, 'Change/Increase in Builtup(1992-2001)');
// Map.addLayer(change2, {min:0, max:1, palette: ['white', 'red']}, 'Change/Increase in Builtup(2001-2013)');
// Map.addLayer(change3, {min:0, max:1, palette: ['white', 'red']}, 'Change/Increase in Builtup(2013-2022)');
// Map.addLayer(change4, {min:0, max:1, palette: ['white', 'red']}, 'Change/Increase in Builtup(1992-2022)');


// Previous year image is multiplied with 100 and the nextn year image is added
//Results in unique pixel values representing each unique transition
// e.g. 201 - water to builtup, 103 builtup to Forest etc.
var merged = previousyear.multiply(100).add(nextyear).rename('transitions');

// Use a frequencyHistogram to get a pixel count per class
var transitionMatrix = merged.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(), 
  geometry: roi,
  maxPixels: 1e13,
  scale:30,
});
// This prints number of pixels for each class transition
print(transitionMatrix.get('transitions'),'Transition matrix');

// If we want to calculate the area of each class transition
// we can use a grouped reducer

// Divide by 1e6 to get the area in sq.km.
var areaImage = ee.Image.pixelArea().divide(1e6).addBands(merged);
print(areaImage)
// Calculate Area by each Transition Class
// using a Grouped Reducer
var areas = areaImage.reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'transitions',
    }),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
    }); 

print(areas,'areas transition 1992-2001')

// Post-process the result to generate a clean output
var classAreas = ee.List(areas.get('groups'));
var classAreaLists = classAreas.map(function(item) {
      var areaDict = ee.Dictionary(item);
      var classNumber = ee.Number(areaDict.get('transitions')).format();
      var area = ee.Number(areaDict.get('sum'));
      return ee.List([classNumber, area]);
    });
var classTransitionsAreaDict = ee.Dictionary(classAreaLists.flatten());
print(classTransitionsAreaDict,'classTransitionsArea1992-2001');




//Export Original and Changed_Images
// Export.image.toDrive({
//   image: builtup1992,
//   description: 'Builtup_1992',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: builtup2001,
//   description: 'Builtup_2001',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: builtup2013,
//   description: 'Builtup_2013',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: builtup2022,
//   description: 'Builtup_2022',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: change1,
//   description: 'Change/Increase in Builtup(1992-2001)',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: change2,
//   description: 'Change/Increase in Builtup(2001-2013)',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: change3,
//   description: 'Change/Increase in Builtup(2013-2022)',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });

// Export.image.toDrive({
//   image: change4,
//   description: 'Change/Increase in Builtup(1992-2022)',
//   scale: 30,
//   region: roi,
//   maxPixels: 1e13,
// });
