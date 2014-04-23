/* jshint browser:true */
/* global require */

'use strict';

// Ouija component class
var Ouija = require('./ouija');

var config = {
  // Unique identifier for each page where Ouija is present
  identifier: window.ouija_identifier,
  // GoInstant connect URL
  connect_url: window.ouija_connect_url
};

var ouija = new Ouija(config);

ouija.initialize();


$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
