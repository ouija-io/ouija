### Ouija

#### Developer Setup

1.  Follow the Ghost [Getting Started Guide for Developers](https://github.com/TryGhost/Ghost#getting-started-guide-for-developers)
2.  Clone the `develop` branch into the `content/apps` folder
3.  Execute `$ npm install`
4.  Execute `$ gulp`
5.  Paste the following snippet above the closing body tag (`</body>`) of `default.hbs`

```
{{#with post}}
  <script>
    window.ouija_connect_url = 'https://goinstant.net/YOURACCOUNT/YOURAPP'
    window.ouija_identifier = {{id}};
  </script>
  <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
  <script src="{{asset "js/ouija.js"}}"></script>
{{/with}}
```

_Note: The gulp develop task will deploy a compiled `ouija.js` file to `themes/casper/assets/js/` which is the home of the default casper theme._
