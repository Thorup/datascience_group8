# How to setup webpack
___
[Link for setting up WebPack](https://webpack.js.org/guides/getting-started/)

In project folder, run following commands
```
$ mkdir src
$ mkdir dist
$ touch index.html
$ cd src
$ touch index.js
$ npm init -y
$ npm install webpack webpack-cli --save-dev
``` 
In index.html, reference main.js
#### __index.html__
```html
 <!doctype html>
  <html>
   <head>
     <title>Getting Started</title>
   </head>
   <body>
        <script src="main.js"></script>
   </body>
  </html>
```
Now you should be able to import and use npm modules in a browser application<br>

Finally, to compile the project navigate to project root folder and run 
```
$ npx webpack
```

To automate the process of compiling the project, go to [webpack intro](https://webpack.js.org/guides/getting-started/)

__(OR INSERT LATER YOU LAZY BASTARD)__