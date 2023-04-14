/////////////////////////////////////////////////////////////////////////////////////
//Supervised Land Cover Classification using Random Forest//
/////////////////////////////////////////////////////////////////////////////////////

////******Part 1: Adding imagery, filtering to area and date range, masking out clouds, and making a composite.******
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert Landsat Image Collection and filter by area using an imported shapefile
var image = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
  .filterBounds(table);

//Function to cloud mask from the pixel_qa band of Landsat 8 SR data. Bits 3 and 5 are cloud shadow and cloud, respectively.
function maskL8sr(image) {
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  var qa = image.select('pixel_qa');

  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  return image.updateMask(mask).divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}

//Filter imagery for 2019 and 2020 summer date ranges.
//Create joint filter and apply it to Image Collection.
var sum20 = ee.Filter.date('1992-01-01','1992-12-31');

// var sum19 = ee.Filter.date('2019-01-01','2020-03-30');

var SumFilter = ee.Filter.or(sum20);

var allsum = image.filter(SumFilter);

//Make a Composite: Apply the cloud mask function, use the median reducer,
//and clip the composite to our area of interest
var composite = allsum
              .map(maskL8sr)
              .median()
              .clip(table);

//Display the Composite
Map.addLayer(composite, {bands: ['B5','B4','B3'],min: 0, max: 0.3},'FCC', 0);

print(composite)

//Specify the bands to use in the prediction.
var bands = ['B3', 'B4', 'B5', 'B6', 'B7'];

//******Part 2: Prepare for the Random Forest model******
//////////////////////////////////////////////

//Merge land cover classifications into one feature class
var newfc = Builtup.merge(Water).merge(Forest).merge(Barrenland).merge(Fallow).merge(Cropland);



//Make training data by 'overlaying' the points on the image.
var points = composite.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landuse'],
  scale: 30
}).randomColumn();

//Randomly split the samples to set some aside for testing the model's accuracy
//using the "random" column. Roughly 80% for training, 20% for testing.
var split = 0.8;
var training = points.filter(ee.Filter.lt('random', split));
var testing = points.filter(ee.Filter.gte('random', split));

//Print these variables to see how much training and testing data you are using
print('Samples n =', points.aggregate_count('.all'));
print('Training n =', training.aggregate_count('.all'));
print('Testing n =', testing.aggregate_count('.all'));

//******Part 3: Random Forest Classification and Accuracy Assessments******
//////////////////////////////////////////////////////////////////////////

//Run the RF model using 300 trees and 5 randomly selected predictors per split ("(300,5)").
//Train using bands and land cover property and pull the land cover property from classes
var classifier = ee.Classifier.smileCart(10).train({
features: training,
classProperty: 'landuse',
inputProperties: bands
});

//Test the accuracy of the model
////////////////////////////////////////

//Print Confusion Matrix and Overall Accuracy
var confusionMatrix = classifier.confusionMatrix();
print('Confusion matrix: ', confusionMatrix);
print('Training Overall Accuracy: ', confusionMatrix.accuracy());
var kappa = confusionMatrix.kappa();
print('Training Kappa', kappa);
 
var validation = testing.classify(classifier);
var testAccuracy = validation.errorMatrix('landuse', 'classification');
print('Validation Error Matrix RF: ', testAccuracy);
print('Validation Overall Accuracy RF: ', testAccuracy.accuracy());
var kappa1 = testAccuracy.kappa();
print('Validation Kappa', kappa1);

//Apply the trained classifier to the image
var classified = composite.select(bands).classify(classifier);


////******Part 4:Create a legend******
//////////////////////////////////////

//Set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
//Create legend title
var legendTitle = ui.Label({
  value: 'Classification Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
//Add the title to the panel
legend.add(legendTitle);
 
//Create and style 1 row of the legend.
var makeRow = function(color, name) {
 
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
     
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//Identify palette with the legend colors
var palette =['c22c00', '1e32ff', '285c26', 'f0ff95','a8951a', '3cd63e' ];
 
//Identify names within the legend
var names = ['Builtup','Water','Forest','Barrenland','Fallow', 'Cropland'];
 
// //Add color and names
// for (var i = 0; i < 8; i++) {
//   legend.add(makeRow(palette[i], names[i]));
//   }  

// //Add legend to map
// Map.add(legend);

////******Part 5: Display the Final Land Cover Classification and Provide Export Options******
//////////////////////////////////////////////////////////////////////////////////////////////

//Create palette for the final land cover map classifications
var urbanPalette =
'<RasterSymbolizer>' +
' <ColorMap  type="intervals">' +
    '<ColorMapEntry color="#c22c00" quantity="0" label="Builtup"/>' +
    '<ColorMapEntry color="#1e32ff" quantity="1" label="Water"/>' +
    '<ColorMapEntry color="#285c26" quantity="2" label="Forest"/>' +
    '<ColorMapEntry color="#f0ff95" quantity="3" label="Barrenland"/>' +
    '<ColorMapEntry color="#a8951a" quantity="4" label="Fallow"/>' +
    '<ColorMapEntry color="#3cd63e" quantity="5" label="Cropland"/>' +
  '</ColorMap>' +
'</RasterSymbolizer>';

//Mask out impervious surfaces
// var finalmap = classified.blend(masked);

//Add final map to the display
Map.addLayer(classified.sldStyle(urbanPalette), {}, "Land Classification");

//Center the map for display
//Map.setCenter(-70.3322, 43.8398, 10);

Export.image.toDrive({
image: classified,
description:"Landuse_LandCover",
scale: 30,
region:table,
maxPixels:3e10
});

// Create a 2 band image with the area image and the classified image
// Divide the area image by 1e6 so area results are in Sq Km
var areaImage = ee.Image.pixelArea().divide(1e6).addBands(classified);

// Calculate Area by Class
// Using a Grouped Reducer
var areas = areaImage.reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'classification',
    }),
    geometry: table,
    scale: 30,
    //tileScale: 4,
    maxPixels: 1e10
    }); 

var classAreas = ee.List(areas.get('groups'))
print(classAreas)

var areaChart = ui.Chart.image.byClass({
  image: areaImage,
  classBand: 'classification', 
  region: table,
  scale: 30,
  reducer: ee.Reducer.sum(),
  classLabels: ['Builtup', 'Water', 'Forest', 'Barrenland', 'Fallow','Cropland'],
}).setOptions({
  hAxis: {title: 'Classes'},
  vAxis: {title: 'Area Km^2'},
  title: 'Area by class',
  series: {
    0: { color: 'red' },
    1: { color: 'blue' },
    2: { color: 'green' },
    3: { color: 'lime' },
    4: { color: 'pink' },
    5: { color: 'yellow' }
  }
});
print(areaChart);

// Code for NDVI,NDBI and NDWI.
// var ndvi = composite.select('B5').subtract(composite.select('B4'))
//             .divide(composite.select('B5').add(composite.select('B4')));
// var ndbi = composite.select('B5').subtract(composite.select('B4'))
//             .divide(composite.select('B5').add(composite.select('B4')));
// var ndwi = composite.select('B3').subtract(composite.select('B5'))
//             .divide(composite.select('B3').add(composite.select('B5')));

// var ndvipalette = 'FFFFFF,CE7E45,DF923D,F1B555,FCD163,99B718,74A901,66A000,529400,3E8601,207401,056201,004C00,023B01,012E01,011D01,011301';
// var ndbipalette = 'FFFFFF,CE7E45,DF923D,F1B555,FCD163,99B718,74A901,66A000,529400,3E8601,207401,056201,004C00,023B01,012E01,011D01,011301';
// var ndwipalette = 'FFFFFF,CE7E45,DF923D,F1B555,FCD163,99B718,74A901,66A000,529400,3E8601,207401,056201,004C00,023B01,012E01,011D01,011301';

// Map.addLayer(ndvi.clip(table), {min:-0.05, max:0.5, palette: ndvipalette}, 'ndvi');
// Map.addLayer(ndbi.clip(table), {min:-0.05, max:0.5, palette: ndbipalette}, 'ndbi');
// Map.addLayer(ndwi.clip(table), {min:-0.05, max:0.5, palette: ndbipalette}, 'ndwi');


// Export.image.toDrive({
// image: ndwi,
// scale: 30,
// region:table,
// maxPixels:3e10
// });


//--------------------Tuning Hyperparameters (No. of Trees) for Random Forest-----------------------------
var list = ee.List([5,10,15,20,25,30,35,40,45,50,100,150,200]);
var trees_kappa_test=ee.List([]);
var trees_kappa_train=ee.List([]);
for (var i=0;i<13;++i){
  var classifier1 = ee.Classifier.smileRandomForest(list.get(i),2).train({
      features: training,
      classProperty: 'Class',
      inputProperties: bands
    });
  var confusionMatrix = classifier1.confusionMatrix();
  var confusionMatrix = classifier1.confusionMatrix();
  var kappa = confusionMatrix.kappa();
  var validation = testing.classify(classifier1);
  var testAccuracy = validation.errorMatrix('Class', 'classification');
  var kappa1 = testAccuracy.kappa();  
  trees_kappa_train=ee.List(trees_kappa_train).add(kappa);
  trees_kappa_test=ee.List(trees_kappa_test).add(kappa1);
}
print('Training Kappa', trees_kappa_train);
print('Testing Kappa', trees_kappa_test);
