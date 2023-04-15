//Imports for the dashboard
var ranchi = ee.FeatureCollection("users/gokulrajkamath96/Ranchi_shp"),
    Night_Lights_1992 = ee.Image("users/gokulrajkamath96/nightlights_1992"),
    Night_Lights_2002 = ee.Image("users/gokulrajkamath96/nightlights_2002"),
    Night_Lights_2013 = ee.Image("users/gokulrajkamath96/nightlights_2013"),
    lulc_2013 = ee.Image("users/gokulrajkamath96/LULC2013"),
    lulc_1992 = ee.Image("users/gokulrajkamath96/LULC_1992"),
    lulc_2022 = ee.Image("users/gokulrajkamath96/LULC_FINAL_2022"),
    lulc_2002 = ee.Image("users/gokulrajkamath96/Landuse_LandCover_2001"),
    NDBI_1992 = ee.Image("users/gokulrajkamath96/ndbi_1992"),
    NDBI_2001 = ee.Image("users/gokulrajkamath96/ndbi_2001"),
    NDVI_1992 = ee.Image("users/gokulrajkamath96/ndvi_1992"),
    NDBI_2021 = ee.Image("users/gokulrajkamath96/ndbi_2021"),
    NDVI_2021 = ee.Image("users/gokulrajkamath96/ndvi_2021"),
    NDBI_2013 = ee.Image("users/gokulrajkamath96/ndbi_2013"),
    NDVI_2001 = ee.Image("users/gokulrajkamath96/ndvi_2001"),
    NDVI_2013 = ee.Image("users/gokulrajkamath96/ndvi_2013"),
    NDWI_1992 = ee.Image("users/gokulrajkamath96/ndwi_1992"),
    NDWI_2001 = ee.Image("users/gokulrajkamath96/ndwi_2001"),
    NDWI_2013 = ee.Image("users/gokulrajkamath96/ndwi_2013"),
    NDWI_2021 = ee.Image("users/gokulrajkamath96/ndwi_2021"),
    change_1992_2002 = ee.Image("users/gokulrajkamath96/ChangeorIncrease_in_Builtup_1992-2001"),
    change_2002_2013 = ee.Image("users/gokulrajkamath96/ChangeorIncrease_in_Builtup_2001-2013"),
    change_2013_2022 = ee.Image("users/gokulrajkamath96/ChangeorIncrease_in_Builtup_2013-2022"),
    GHSL_Population_2000 = ee.Image("users/gokulrajkamath96/reclass_2000"),
    GHSL_Population_2010 = ee.Image("users/gokulrajkamath96/reclass_2010"),
    GHSL_Population_2020 = ee.Image("users/gokulrajkamath96/reclass_2020"),
    GHSL_Population_1990 = ee.Image("users/gokulrajkamath96/reclass_90");
    
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //Dashboard code
    // visualization paramaters
    
var imageVisParam = {"opacity":1,"bands":["b1"],"min":0,"max":5,"palette":["#c22c00","#1e32ff","#285c26","#f0ff95","#a8951a","#3cd63e"]}
var imageVisParam_change = {min:0,max:1,palette:['white','red']};
var imageVisPram_indices_NDVI= {min:-1,max:1,palette:['white','green']};
var imageVisPram_indices_NDWI= {min:0,max:1,palette:['white','blue']};
var imageVisPram_indices_NDBI= {min:0,max:1,palette:['white','red']};
var imageVisParam_GHSL = {min: 1,max: 4,palette : ["#2E7F18","#675E24","#8D472B","#C82538"]};

/* ARRAYS OF AREAS OF EACH CLASS FOR EVERY YEAR */ 

var areas_1992 = [85.464, 51.229, 1274.123, 765.143, 2207.08,602.844];
var areas_2002 = [126.26, 54.57, 1538.84, 963.34, 1649.44,608.42];
var areas_2013 = [136.90, 86.75, 1446.75,307.26, 1337.72,1630.51];
var areas_2022 = [372.95, 92.36,2688.51, 104.47, 1516.44,211.15];
var class_names = ['Builtup', 'Water','Forest', 'BarrenLand','Fallow ','Cropland'];
var color = ["#c22c00","#1e32ff","#285c26","#f0ff95","#a8951a","#3cd63e"]
var classified_class=['Builtup', 'Water','Forest', 'BarrenLand','Fallow ','Cropland'];
var col2=["#2E7F18","#675E24","#8D472B","#C82538"]
/* CHANGE DETECTION AREAS FROM OTHER CLASSES TO URBAN */
var area_change_classes = ['Builtup-Builtup', 'Water-Builtup', 'Forest-Builtup', 'BarrenLand-Builtup', 'Fallow-Builtup','Cropland-Builtup'];
var area_change_1992_2002 = [16.751,4.061,4.192,46.777,38.354,11.173];
var area_change_2002_2013 = [38.101,3.909,26.502,25.582,37.016,5.792];
var area_change_2013_2022 = [77.425,8.972,17.607,38.482,72.740,159.211];
var panel = ui.Panel({style: {width:'30%', 'backgroundColor':'#181823'}});
//creating map panel
ui.root.insert(0,panel);
var main_map = ui.Map({style: {width:'70%'}});
main_map.setCenter(85.335978 , 23.367780, 10); // Set the center of the map and the zoom level
main_map.addLayer(ranchi);
ui.root.insert(1,main_map); // add the main map widget to the root
var class1=['Low','Medium' ,"High",'Very High']
//LEGEND
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* PANEL FOR LEGEND OF LULC */
var legend_panel =ui.Panel({
  style:{
    position : 'bottom-left',
    padding : '6px'
  }
});

// Add Legend title to the panel and add that legend to the panel
var legend_title = ui.Label({
  value: "LULC",
  style: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin : '0px'
  }
});
legend_panel.add(legend_title);
var list_legend = function(color,description){
  var c = ui.Label({
    style: {
      backgroundColor: color,
      padding: '10px',
      margin: '4px'
    }
  });
  var ds = ui.Label({
    value: description,
    style: {
      margin: '4px'
    }
  });
  return ui.Panel({
    widgets: [c, ds],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

for(var a = 0; a <5; a++){ // Increase the number of iterations depending on the number of classes in the classified image
  legend_panel.add(list_legend(color[a], classified_class[a])); // add each color and the class name to the legend 
}
//generating labels for GHSL
var legend_ghsl = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'GHSL POP',
  style: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin : '0px'
    }
});
 
// Add the title to the panel
legend_ghsl.add(legendTitle);
var list_legend = function(color,description){
  var c = ui.Label({
    style: {
      backgroundColor: color,
      padding: '10px',
      margin: '4px'
    }
  });
  var ds = ui.Label({
    value: description,
    style: {
      margin: '4px'
    }
  });
  return ui.Panel({
    widgets: [c, ds],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

for(var a = 0; a <4; a++){ // Increase the number of iterations depending on the number of classes in the classified image
  legend_ghsl.add(list_legend(col2[a], class1[a])); // add each color and the class name to the legend 
}

/* PANEL FOR LEGEND OF CHANGE DETECTION */
var legend_change_panel =ui.Panel({
  style:{
    position : 'bottom-left',
    padding : '5px'
  }
});
var title = ui.Label('Decadal Urban Growth of Ranchi');
title.style().set({
  'color': '#ffffff', 
  'font-size': '35px',
  'padding': '20px 0 10px 20px',
  'backgroundColor':'#181823',
  'text-align': 'left',
  'font-weight': 'bold'
});
panel.add(title);
var dashboard_info = ui.Label('This Dashboard shows the decadal urban growth from 1992 to 2022 of Ranchi capital city of Jharkhand.'+
                              ' The user can select any Seven visualization options LULC, Builtup Change, Nightlights,GHSL,NDVI,NDBI,NDWI.')
dashboard_info.style().set({
  'color': '#000000', 
  'font-size': '22px',
  'padding': '17.5px',
  'text-align': 'justify',
  'backgroundColor': '#C0EEF2',
  'font-family': 'Helvetica',
});
panel.add(dashboard_info)
// slelect button
/////LABELS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
var lulc_label = ui.Label('The maps show the Land use Land cover statistics for 1992, 2002, 2013, and 2022,made using Random Forest Classification method'+
                            ',Click on the button below to select the map of the particular year.');
lulc_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var lulc_change_label = ui.Label('The maps show the change in Bulitup between 1992-2002,2002-2013, and 2013-2022.'+
                            'Click on the button below to select the map of the particular year.');
lulc_change_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var nightlight_label = ui.Label('Nightlight images are obtained from DMSP-OLS  for 1992, 2002, 2013'+
                            ',Click on the button below to select the map of the particular year.');
nightlight_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var GHSL_pop_label = ui.Label('GHSL Population layer(GHS P2022) gives an idea about the population per pixel of the study area  for 1990, 2000, 2010,2020'+
                            ',Click on the button below to select the map of the particular year.');
GHSL_pop_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var NDVI_label = ui.Label('NDVI image for 1992, 2001, 2013, and 2021.'+
                            'Click on the button below to select the map of the particular year.');
NDVI_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var NDBI_label = ui.Label('NDBI image for 1992, 2001, 2013, and 2021.'+
                            ' Click on the button below to select the map of the particular year.');
NDBI_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
var NDWI_label = ui.Label('NDWI image for 1992, 2001, 2013, and 2021.'+
                            'Click on the button below to select the map of the particular year.');
NDWI_label.style().set({
  'color': '#ffffff', 
  'font-size': '23px',
  'padding': '17px',
  'text-align': 'justify',
  'backgroundColor': '#181823',
  'font-family': 'Helvetica',
});
//Dictionaries for option Selection
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
var lulc = {
  'LULC 1992': lulc_1992,
  'LULC 2002': lulc_2002,
  'LULC 2013': lulc_2013,
  'LULC 2022': lulc_2022
};
var lulc_change = {
  'Builtup 1992-2002': change_1992_2002,
  'Builtup 2002-2013': change_2002_2013,
  'Builtup 2013-2022': change_2013_2022,
};
var Night_Lights = {
  'Night Lights 1992': Night_Lights_1992,
  'Night Lights 2002': Night_Lights_2002,
  'Night Lights 2013': Night_Lights_2013,
};
var NDBI = {
  'NDBI 1992': NDBI_1992,
  'NDBI 2001': NDBI_2001,
  'NDBI 2013': NDBI_2013,
  'NDBI 2021': NDBI_2021
};
var NDWI = {
  'NDWI 1992': NDWI_1992,
  'NDWI 2001': NDWI_2001,
  'NDWI 2013': NDWI_2013,
  'NDWI 2021': NDWI_2021
};
var NDVI = {
  'NDVI 1992': NDVI_1992,
  'NDVI 2001': NDVI_2001,
  'NDVI 2013': NDVI_2013,
  'NDVI 2021': NDVI_2021
};
var GHSL_pop = {
  'GHSL Population 1990': GHSL_Population_1990,
  'GHSL Population 2000': GHSL_Population_2000,
  'GHSL Population 2010': GHSL_Population_2010,
  'GHSL Population 2020': GHSL_Population_2020
};
var options = {
  'LULC': 'lulc_selection',
  'Builtup Change': 'lulc_change_selection',
  'Night Lights': 'Night Light 2000-2020',
  'NDWI change':'NDWI change',
  'NDVI change':'NDVI change',
  'NDBI change':'NDBI change',
  'GHSL Population change': 'GHSL Population Change',
};
//carts
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var chart_1992 = ui.Chart.array.values(areas_1992, 0, class_names).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Classes'},
                    title: 'Area by class 1992',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });

var chart_2002 = ui.Chart.array.values(areas_2002, 0, class_names).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Classes'},
                    title: 'Area by class 2002',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });
                  
var chart_2013 = ui.Chart.array.values(areas_2013, 0, class_names).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Classes'},
                    title: 'Area by class 2013',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });
                  
var chart_2022 = ui.Chart.array.values(areas_2022, 0, class_names).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Classes'},
                    title: 'Area by class 2022',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });
                  
var chart_1992_2002 = ui.Chart.array.values(area_change_1992_2002, 0, area_change_classes).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Class-Urban'},
                    title: 'Area change from each class to Urban from 1992-2002',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                    
                  });
                  
var chart_2002_2013 = ui.Chart.array.values(area_change_2002_2013, 0, area_change_classes).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Class-Urban'},
                    title: 'Area change from each class to Urban from 2002-2013',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });
                  
var chart_2013_2022 = ui.Chart.array.values(area_change_2013_2022, 0, area_change_classes).setChartType('ColumnChart')
                    .setOptions({
                    hAxis: {title: 'Area Km2'},
                    vAxis: {title: 'Class-Urban'},
                    title: 'Area change from each class to Urban from 2013-2022',
                    legend: { position: "none" },
                    orientation: 'vertical',
                    fontName: 'arial',
                    fontSize: 10,
                    chartArea: {backgroundColor: 'EBEBEB'}
                  });
///Selection dial
//----------------------------------------------------------------------------------------------------------------------------------
var lulc_selection = ui.Select({
  items: Object.keys(lulc),
  onChange: function(key){
    if(key === 'LULC 1992'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(lulc['LULC 1992'].clip(ranchi), imageVisParam, 'LULC 1992');
      main_map.add(legend_panel);
      panel.add(chart_1992);
    }
    
    if(key === 'LULC 2002'){
      main_map.clear();
      panel.remove(chart_1992);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(lulc['LULC 2002'].clip(ranchi), imageVisParam, 'LULC 2002');
      main_map.add(legend_panel);

      panel.add(chart_2002);
    }
    
    if(key === 'LULC 2013'){
      main_map.clear();
      panel.remove(chart_1992);
      panel.remove(chart_2002);
      panel.remove(chart_2022);
      main_map.addLayer(lulc['LULC 2013'].clip(ranchi), imageVisParam, 'LULC 2013');
      main_map.add(legend_panel);

      panel.add(chart_2013);
    }
    
    if(key === 'LULC 2022'){
      main_map.clear();
      panel.remove(chart_1992);
      panel.remove(chart_2002);
      panel.remove(chart_2013)
      main_map.addLayer(lulc['LULC 2022'].clip(ranchi), imageVisParam, 'LULC 2022');
      main_map.add(legend_panel);

      panel.add(chart_2022);
    }
  }
  
});
lulc_selection.setPlaceholder('Select the LULC image');
lulc_selection.style().set({
  color: 'black',
  padding: '0 20px 0 25px',
  'backgroundColor':'#181823'
});
var lulc_change_selection = ui.Select({
  items: Object.keys(lulc_change),
  onChange: function(key){
    if(key === 'Builtup 1992-2002'){
      main_map.clear();
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022)
      main_map.addLayer(lulc_change['Builtup 1992-2002'].clip(ranchi), imageVisParam_change, 'Builtup 1992-2002');
      
      // create legend for the LULC Change images
      main_map.add(legend_change_panel)
      

      panel.add(chart_1992_2002);
    }
    
    if(key === 'Builtup 2002-2013'){
      main_map.clear();
      panel.remove(chart_1992_2002)
      panel.remove(chart_2013_2022)
      main_map.addLayer(lulc_change['Builtup 2002-2013'].clip(ranchi), imageVisParam_change, 'Builtup 2002-2013');
      
      // create legend for the LULC Change images
      main_map.add(legend_change_panel)
      

      panel.add(chart_2002_2013);
    }
    
    if(key === 'Builtup 2013-2022'){
      main_map.clear();
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      main_map.addLayer(lulc_change['Builtup 2013-2022'].clip(ranchi), imageVisParam_change, 'Builtup 2013-2022');
      
      // create legend for the LULC Change images
      main_map.add(legend_change_panel);
      

      panel.add(chart_2013_2022);
    }
  }
});
lulc_change_selection.setPlaceholder('Select the Builtup Change Image');
lulc_change_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});
var Night_lights_selection = ui.Select({
  items: Object.keys(Night_Lights),
  onChange: function(key){
    if(key === 'Night Lights 1992'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(Night_Lights['Night Lights 1992'].clip(ranchi), {min:2.5,max:63}, 'Night Lights 1992');
      //main_map.add(legend_panel);
    }
    
    if(key === 'Night Lights 2002'){
      main_map.clear();
      panel.remove(chart_1992);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(Night_Lights['Night Lights 2002'].clip(ranchi), {min:2.5,max:63}, 'Night Lights 2002');
      //main_map.add(legend_panel);
    }
    
   if(key === 'Night Lights 2013'){
      main_map.clear();
      panel.remove(chart_1992);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(Night_Lights['Night Lights 2013'].clip(ranchi), {min:2.5,max:63}, 'Night Lights 2013');
      //main_map.add(legend_panel);
    }
  }
});
Night_lights_selection.setPlaceholder('Select the Night lights image');
Night_lights_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});
var GHSL_pop_selection = ui.Select({
  items: Object.keys(GHSL_pop),
  onChange: function(key){
    if(key === 'GHSL Population 1990'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(GHSL_pop['GHSL Population 1990'].clip(ranchi),imageVisParam_GHSL, 'GHSL Population 1990');
      main_map.add(legend_ghsl);
    }
    
     if(key === 'GHSL Population 2000'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(GHSL_pop['GHSL Population 2000'].clip(ranchi),imageVisParam_GHSL, 'GHSL Population 2000');
      main_map.add(legend_ghsl);
    }
    
    if(key === 'GHSL Population 2010'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(GHSL_pop['GHSL Population 2010'].clip(ranchi),imageVisParam_GHSL, 'GHSL Population 2010');
      main_map.add(legend_ghsl);
    }
     if(key === 'GHSL Population 2020'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(GHSL_pop['GHSL Population 2020'].clip(ranchi),imageVisParam_GHSL, 'GHSL Population 2020');
      main_map.add(legend_ghsl);
    }
  }
});
GHSL_pop_selection.setPlaceholder('Select the GHSL POP image');
GHSL_pop_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});
var NDWI_selection = ui.Select({
  items: Object.keys(NDWI),
  onChange: function(key){
    if(key === 'NDWI 1992'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDWI['NDWI 1992'].clip(ranchi),imageVisPram_indices_NDWI, 'NDWI 1992');
     
    }
    
   if(key === 'NDWI 2001'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDWI['NDWI 2001'].clip(ranchi),imageVisPram_indices_NDWI, 'NDWI 2001');
      
    }
    
    if(key === 'NDWI 2013'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDWI['NDWI 2013'].clip(ranchi),imageVisPram_indices_NDWI, 'NDWI 2013');

    }
    
    if(key === 'NDWI 2021'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDWI['NDWI 2021'].clip(ranchi),imageVisPram_indices_NDWI, 'NDWI 2021');
    }
  }
  
});
NDWI_selection.setPlaceholder('Select the NDWI image');
NDWI_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});

var NDBI_selection = ui.Select({
  items: Object.keys(NDBI),
  onChange: function(key){
    if(key === 'NDBI 1992'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDBI['NDBI 1992'].clip(ranchi),imageVisPram_indices_NDBI, 'NDBI 1992');
    }
    
   if(key === 'NDBI 2001'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDBI['NDBI 2001'].clip(ranchi),imageVisPram_indices_NDBI, 'NDBI 2001');
      
    }
    
    if(key === 'NDBI 2013'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDBI['NDBI 2013'].clip(ranchi),imageVisPram_indices_NDBI, 'NDBI 2013');
      
    }
    
    if(key === 'NDBI 2021'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDBI['NDBI 2021'].clip(ranchi),imageVisPram_indices_NDBI, 'NDBI 2021');
      
    }
  }
  
});
NDBI_selection.setPlaceholder('Select the NDBI image');
NDBI_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});
var NDVI_selection = ui.Select({
  items: Object.keys(NDVI),
  onChange: function(key){
    if(key === 'NDVI 1992'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDVI['NDVI 1992'].clip(ranchi),imageVisPram_indices_NDVI, 'NDVI 1992');
      
    }
    
   if(key === 'NDVI 2001'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDVI['NDVI 2001'].clip(ranchi),imageVisPram_indices_NDVI, 'NDVI 2001');
      
    }
    
    if(key === 'NDVI 2013'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDVI['NDVI 2013'].clip(ranchi),imageVisPram_indices_NDVI, 'NDVI 2013');
      
    }
    
    if(key === 'NDVI 2021'){
      main_map.clear();
      panel.remove(chart_2002);
      panel.remove(chart_2013);
      panel.remove(chart_2022);
      main_map.addLayer(NDVI['NDVI 2021'].clip(ranchi),imageVisPram_indices_NDVI, 'NDVI 2021');
    }
  }
  
});
NDVI_selection.setPlaceholder('Select the NDVI image');
NDVI_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});
//Main widget map selection
//------------------------------------------------------------------------------------------------------------------------------------------------------------
var options_selection = ui.Select({
  items: Object.keys(options), 
  onChange: function(key){
    if(key === 'LULC'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_change_label);
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      panel.remove(legend_panel);
      panel.add(lulc_label);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.remove(GHSL_pop_selection);
      panel.remove(GHSL_pop_selection);
      panel.remove(lulc_change_selection);
      ui.root.widgets().reset([panel, main_map]);
      panel.add(lulc_selection);
    }
    else if(key === 'Builtup Change'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      panel.remove(legend_panel);
      panel.add(lulc_change_label);
      panel.remove(lulc_selection);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.remove(GHSL_pop_label);
      panel.remove(GHSL_pop_selection);
      panel.remove(GHSL_pop_selection);
      ui.root.widgets().reset([panel, main_map]);
      panel.add(lulc_change_selection);
    }
    else if (key === 'Night Lights'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(lulc_change_label);
      panel.remove(legend_panel);
      panel.add(nightlight_label);
      panel.add(Night_lights_selection);
      panel.remove(lulc_selection);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.remove(GHSL_pop_label);
      panel.remove(GHSL_pop_selection);
      ui.root.widgets().reset([panel, main_map]);
      panel.remove(lulc_change_selection);
    }
    else if (key === 'NDWI change'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(lulc_change_label);
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      panel.remove(legend_panel);
      panel.add(NDWI_label);
      panel.add(NDWI_selection);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(lulc_selection);
      panel.remove(GHSL_pop_label);
      panel.remove(GHSL_pop_selection);
      ui.root.widgets().reset([panel, main_map]);
     // panel.remove(lulc_change_selection);
    }
    else if (key === 'NDVI change'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(lulc_change_label);
      panel.remove(legend_panel);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.add(NDVI_label);
      panel.add(NDVI_selection);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      panel.remove(lulc_selection);
      panel.remove(GHSL_pop_label);
      panel.remove(GHSL_pop_selection);
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      ui.root.widgets().reset([panel, main_map]);
     // panel.remove(lulc_change_selection);
    }
    else if (key === 'NDBI change'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(lulc_change_label);
      panel.remove(legend_panel);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.add(NDBI_label);
      panel.add(NDBI_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(lulc_selection);
      ui.root.widgets().reset([panel, main_map]);
      panel.remove(GHSL_pop_label);
      panel.remove(GHSL_pop_selection);
     // panel.remove(lulc_change_selection);
    }
    else if (key === 'GHSL Population change'){
      main_map.clear();
      panel.remove(chart_1992)
      panel.remove(chart_2002)
      panel.remove(chart_2013)
      panel.remove(chart_2022)
      panel.remove(nightlight_label);
      panel.remove(Night_lights_selection);
      panel.remove(chart_1992_2002)
      panel.remove(chart_2002_2013)
      panel.remove(chart_2013_2022);
      panel.remove(lulc_label);
      panel.remove(lulc_change_label);
      panel.remove(legend_panel);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.add(GHSL_pop_label);
      panel.add(GHSL_pop_selection);
      panel.remove(NDVI_label);
      panel.remove(NDVI_selection);
      panel.remove(lulc_selection);
      panel.remove(NDWI_label);
      panel.remove(NDWI_selection);
      panel.remove(NDBI_label);
      panel.remove(NDBI_selection);
      ui.root.widgets().reset([panel, main_map]);
      panel.remove(lulc_change_selection);
    }
  }
});
options_selection.setPlaceholder('Choose a map');
options_selection.style().set({
  color: 'black',
  padding: '0 20px 0 20px',
  'backgroundColor':'#181823'
});

panel.add(options_selection);
