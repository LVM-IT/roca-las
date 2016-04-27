# LVM LAS ROCA

Run with:

```
vagrant up
vagrant ssh
cd /vagrant
npm run compile
npm run server
```

Now you can visit http://localhost:8080 to see the application.

During development you can run `vagrant rsync-auto` to copy all changes you make to
the code into the box.

## JavaScript

You need to have Node.js (5.X.X) installed. Run `npm install` to install all dependencies.
Then you have the following tasks available:

* `npm run test`: Lint the JavaScript files
* `npm run compile`: Compile the JavaScript and CSS files
* `npm run assets`: Copy the assets (images and fonts) to this project
* `npm run webpack`: Compile the JavaScript files
* `npm run webpack-watch`: Watch the JavaScript files and compile on every change
* `npm run less`: Compile the CSS files
