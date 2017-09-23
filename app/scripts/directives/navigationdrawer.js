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
        var draggableMenu = element[0].querySelector('.touch-menu');
        scope.lastPan = {};
        scope.lastPan.endX = 0;
        scope.lastPan.endY = 0;

        scope.menu = {};
        scope.menu.draggable = draggableMenu;
        scope.menu.width = 280;
        scope.menu.moveTo = function (translatex){
          var toX = scope.menu.normalizeMoveRange(translatex); 

          scope.menu.draggable.style.transform = `translate3d( ${toX}px, 0, 0)`;
        };
        scope.menu.normalizeMoveRange = function (x){
          if(x < -scope.menu.width)
            return -scope.menu.width;
          
          if(x > 0)
            return 0;

          return x;
        };

        scope.onHammer = function onHammer (event) {
          var translatex = scope.lastPan.endX + event.deltaX;
          scope.menu.moveTo(translatex);
        };

        scope.onPanStart = function onPanStart(event){
          console.log('pan start!');
        };

        scope.onPanEnd = function onPanEnd(event){
          //var bounds = element[0].getBoundingClientRect();
          //scope.lastPan.endX  = scope.lastPan.endX + event.deltaX;
          //console.log(`scope.lastPan.endX ${scope.lastPan.endX}`);
          var xEnd = scope.menu.normalizeMoveRange(event.deltaX);
          if(xEnd < -scope.menu.width /3  )
          {
            // go to -scope.menu.width
            scope.menu.moveTo(-scope.menu.width);
            scope.lastPan.endX = -scope.menu.width;
          }
          else
          {
            // go to 0
            scope.menu.moveTo(0);
            scope.lastPan.endX = 0;
          }
        };
         
        scope.onClick = function onClick(){
          console.log('click');

        }
      }
      
    };
  });
