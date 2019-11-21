# express-cache-control-middleware

A middleware to add Cache-Control header with fine granularity configuration for each path.

## How to install

```
npm install --save
``` 

## How to use this library

```
import {cacheControl} from 'express-cache-control-middleware'

app.use(cacheControl({
   '/': {
      maxAge: 600 // 10 min
   },
   '/assets/images/**': {
      maxAge: 86400 // 1 day
   },
   default: {
      noCache: true
   },
}))
```

The path matching syntax is applied from [minimatch](https://github.com/isaacs/minimatch).

# Credits

This library is heavily inspired by our application at [Stuff](http://www.stuff.co.nz). 
The original motivation is we haven't found a good express middleware meeting our requirement in this space.
