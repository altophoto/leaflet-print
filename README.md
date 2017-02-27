# Leaflet print function
[![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

One time i needed to print map using leaflet v0.7. 
But i had a lot of troubles and bugs to do this.
So after some time i wrote this function. 
I hope it can help somebody.


## Dependency

This function require following:
 - [leafletjs library](http://leafletjs.com/). (0.7.3 minimum)
 - [html2canvas library](https://html2canvas.hertzen.com/). (doesn't matter)

i think its all.

## How to use
To start you need to include this script to you html, like this
```html
<script src="leaflet-print-map.js"></script>
```
and then you can use it by call a function:
```javascript
	PrintMap.print(your_leaflet_map_object,_your_callback_function);
	
	//or fast example
	PrintMap.print(map,function(image_data){window.open(image_data);});
```

## Some details
The PrintMap object has only one public function - `print`. It has two params:
- `_map` its a reference to you leaflet map object
- `_callback` its a function which would be called after generating of screenshot, in first parameter should be taken base64 representation of image


## License

(The MIT License)

Copyright (c) 2015 Korol Kirill 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.