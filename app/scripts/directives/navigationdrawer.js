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
      /*
      controller : ['$scope', function($scope){
        $scope.onClick = function(){
          console.log('click');
        };

        $scope.onHammer = function onHammer(event){
          console.log(event);
        }
      }]
      */
      
      link: function postLink(scope, element, attrs) {
        console.log('postLink');
        console.log(element);
        scope.lastPan = {};
        scope.lastPan.endX = 0;
        scope.lastPan.endY = 0;

        scope.onHammer = function onHammer (event) {
          console.log(`x: ${event.deltaX}, y: ${event.center.y}, isFinal: ${event.isFinal}`, event);
          var draggable = event.element[0];
          var translatex = scope.lastPan.endX + event.deltaX;
          console.log(`translatex: ${translatex} = ${scope.lastPan.endX} + ${event.deltaX}`);
          draggable.style.transform = `translate3d( ${translatex}px, 0, 0)`;
        };

        scope.onPanStart = function onPanStart(event){
          console.log('pan start!');
        };

        scope.onPanEnd = function onPanEnd(event){
          var bounds = element[0].getBoundingClientRect();
          scope.lastPan.endX  = scope.lastPan.endX + event.deltaX;
          console.log(`scope.lastPan.endX ${scope.lastPan.endX}`);
        };
         
        scope.onClick = function onClick(){
          console.log('click');

        }
      }
      
    };
  });
