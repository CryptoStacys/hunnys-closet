# hunnys-img
Scripts to batch transform the hundreds of Hunnys layer files. Resizing, merging, composites, changing colors and so on.

---

## rename.js 
> Fixes and renames the original layer files to a standardized format

Command    
``node scr/rename.js sincos_3000x``

---

## resize.js
> Takes layer folder with subfolders and renders them

Command    
``node src/resize.js [from] [to] [width] [height]``    

Example    
``node src/resize.js sincos_3000x sincos_600x 600 600``

---

## composite.js
> Merge layers to use as individual item thumbnails

Command    
``node src/resize.js [from] [to] [width] [height]``  