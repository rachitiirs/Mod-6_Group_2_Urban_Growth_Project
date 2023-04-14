# PGD-GI_22-23_Mod-6_Group_2
Repository for Group 2 Big Geodata Processing Group Project on Analysis of Urban Growth using decadal RS data 

In this repository Google Earth Engine codes has been added for the project from the repository that can be accessed via following link:
https://code.earthengine.google.com/?accept_repo=users/rachit2147/Urban_growth_project

The datasets are imported from Google Earth Engine for the Landsat 5 and Landsat 8 satellites filtered using the Ranchi shapefile from SOI, date filters were applied for the whole year, cloud cover was set to less than 10%. The median of the whole image collection was taken as the input for classification. Landsat 5 TM Collection 2 Tier 1 Surface Reflectance product was used for classification of year 1992 and 2002 respectively since the Landsat 7 data for 2002 was having greater mis-classifications compared to the former. Landsat 8 OLI/TIRS Collection 2 Tier 1 Surface Reflectance was used to classify both 2013 and 2022, since 2012 data had scanline error in Landsat 7and Landsat 5 data was only available till May 2012. Nightlight maps were obtained from GEE from the Defense Meteorological Program (DMSP) Operational Line Scan System (OLS) (Resolution :463.83m) for the years 1992, 2002 and 2013. Median of data for the whole years was taken. Further analysis of 2022 was discontinued because of compatibility issues between DMSP-OLS and VIIRS DNB data sets.



