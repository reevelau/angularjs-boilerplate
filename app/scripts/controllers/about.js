'use strict';

/**
 * @ngdoc function
 * @name navdrawerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the navdrawerApp
 */
angular.module('navdrawerApp')
  .controller('AboutCtrl', function () {
    console.log('about page');
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
