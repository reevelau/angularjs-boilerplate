'use strict';

/**
 * @ngdoc directive
 * @name navdrawerApp.directive:navigationDrawer
 * @description
 * # navigationDrawer
 */
angular.module('navdrawerApp')
  .directive('navigationDrawer', function () {
    return {
      templateUrl: 'views/directives/navigationDrawer.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
