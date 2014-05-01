![Ouija Banner](https://dl.dropboxusercontent.com/u/783535/ouija/ouija-readme.png)

# [Ouija](http://ouija.io)
#### An inline commenting app for Ghost: http://ouija.io
Ouija brings inline commenting to your Ghost blog. See below for install instructions.

## Quick Install

1. Paste the Ouija CSS into the `<head>` section of your theme's `default.hbs` file. `<link rel="stylesheet" href="http://cdn.goinstant.net/external/ouija/0.1.0/ouija.min.css"></script>`

2. Paste the following snippet before the closing `</body>` tag. Replace `YOURACCOUNT/YOURAPP` with your GoInstant details.
Need a GoInstant connect URL? [Sign up here](https://goinstant.com/signup?src=ouija).

```
{{#with post}}
  <script>
    window.ouija_connect_url = 'https://goinstant.net/YOURACCOUNT/YOURAPP';
    window.ouija_identifier = {{id}};
  </script>
  <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
  <script src="http://cdn.goinstant.net/external/ouija/0.1.0/ouija.min.css"></script>
{{/with}}
```

## Developer Setup
These instructions assume you already have a Ghost blog set up. If not, follow the [Getting Started Guide for Developers](https://github.com/TryGhost/Ghost#getting-started-guide-for-developers) from Ghost to set one up.

1. Clone this repo into the `content/apps` folder of your blog.

1. Copy the `config/ouija.json.example` to `config/ouija.json` and insert the name of your custom theme folder. If you're using the default theme Casper, you don't need to change anything.

1. Execute `$ npm install`

1. Execute `$ gulp develop`

1. Add the CSS to the `<head>` section of your blog's `default.hbs` file: `<link rel="stylesheet" type="text/css" href="{{asset "css/ouija.css"}}" />`

1. Paste the following snippet before the closing `</body>` tag. Replace `YOURACCOUNT/YOURAPP` with your GoInstant connect URL.
Need a GoInstant connect URL? [Sign up here](https://goinstant.com/signup?src=ouija).

```
{{#with post}}
  <script>
    window.ouija_connect_url = 'https://goinstant.net/YOURACCOUNT/YOURAPP';
    window.ouija_identifier = {{id}};
  </script>
  <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
  <script src="{{asset "js/ouija.js"}}"></script>
{{/with}}
```

## How to create a GoInstant app

GoInstant is used to sync comments in real-time. You'll need to create a new app in GoInstant in order to use Ouija.

##### Created by GoInstant
1. If you haven't already, [sign up for GoInstant](https://goinstant.com/signup?src=ouija). From the GoInstant dashboard, __create a new app__ for Ouija.

1. Navigate to your new app's __Authentication__ page.

1. Add your blog's URL as an Authorized origin. If you're working locally, you might want to add `localhost`, too.

1. Ouija commenters login through Twitter (for now). Turn on __Twitter__ in the list of providers. Don't worry about the settings inside the Twitter box.

1. Copy the contents of `config/acl.json` to your app's ACL. This gives Ouija the correct permissions to run on your blog. You can change your app's ACL under __Security__.

## License
&copy; 2014 GoInstant Inc., a salesforce.com company. Licensed under the BSD 3-clause license.

[![GoInstant](http://goinstant.com/static/img/logo.png)](http://goinstant.com)
