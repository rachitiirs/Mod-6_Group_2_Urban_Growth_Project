# PGD-GI_22-23_Mod-6_Group_2
Repository for Group 2 Big Geodata Processing Group Project on Analysis of Urban Growth using decadal RS data 

This project analyses the urban growth of Ranchi district of Jharkhand over three decades i.e. from 1992 to 2021 by using machine learning algorithm in Google Earth Engine for classification of built up areas in satellite imagery and detecting change or extent of urban sprawl.

In this repository Google Earth Engine codes has been added for the project from the repository that can be accessed via following links:
1992 classification: https://code.earthengine.google.com/1988223455e88af763e51daae426d364
2001 classification: https://code.earthengine.google.com/6481ba40821d62b6d1d6abe2420a024a
2013 classification: https://code.earthengine.google.com/9acf78b75d1b795af1c0ac5d9748767a
2021 classification: https://code.earthengine.google.com/9554386004cf8eb37b4c1d44587436e4
Change Detection: https://code.earthengine.google.com/da29a76c1d19e201a45f0ad7d83381de
Indices code: https://code.earthengine.google.com/bfad591fb2040e8c3d92be8b8247aacf
Nightlights: https://code.earthengine.google.com/63eb43d430fab2949b32450063fe48bb
GHSL: https://ghsl.jrc.ec.europa.eu/download.php?ds=pop

This repository contains 5 google earth engine code files and 1 folder for datasets containing all the datasets used in the project work.

Datasets: This folder contains all the dataset used and outputs generated/exported from the codes

1. Download_Classification_of_Datasets.js
This file contains code importing datasets from Google Earth Engine for the Landsat 5 and Landsat 8 satellites filtered using the Ranchi shapefile from SOI, date filters were applied for the whole year, cloud cover was set to less than 10%. The median of the whole image collection was taken as the input for classification. Landsat 5 TM Collection 2 Tier 1 Surface Reflectance product was used for classification of year 1992 and 2002 respectively since the Landsat 7 data for 2002 was having greater mis-classifications compared to the former. Landsat 8 OLI/TIRS Collection 2 Tier 1 Surface Reflectance was used to classify both 2013 and 2022, since 2012 data had scanline error in Landsat 7 and Landsat 5 data was only available till May 2012. 

Training samples were created using polygon and marker geometry features manually on map display screen which get stored as variables in the script Random Forest, SVM, CART classification was performed using 80% of the total samples for training and rest for testing and validation. Accuracy Assessment was performed by calculating Training, testing overall accuracies and Kappa coefficient for confusion matrix.

2. Change_Detection.js
Required classified images of all the years were imported as images and land cover classes were remaped to new values. Previous year image is multiplied with 100 and the next year image is added to get new pixel values which show transition from previoous class to next class. Consequently transition matrix and changed area was obtained.

3. Indices.js
Normalised indexes (NDBI and NDVI) were used to get enhanced images of built-up area. A new Built-up index (BU) was calculated using difference of NDBI and NDVI to get higher overall accuracy.

4. Nightlights.js
Nightlight maps were obtained from GEE from the Defense Meteorological Program (DMSP) Operational Line Scan System (OLS) (Resolution :463.83m) for the years 1992, 2002 and 2013. Median of data for the whole years was taken. Further analysis of 2022 was discontinued because of compatibility issues between DMSP-OLS and VIIRS DNB data sets.

5. Dashboard.js
The code in this javascript file has been written to generate a dashboard in google earth engine app.

Tutorial for making ui web app
https://developers.google.com/earth-engine/tutorials/community/creating-web-apps