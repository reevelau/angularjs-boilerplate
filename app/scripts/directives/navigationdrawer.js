'use strict';

//requestAnimationFrame + customEvent
(function() {
  var throttle = function(type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function() {
          if (running) { return; }
          running = true;
           requestAnimationFrame(function() {
              obj.dispatchEvent(new CustomEvent(name));
              running = false;
          });
      };
      obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle("resize", "optimizedResize");
})();


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

        scope.isPhone = false;

        function init(){
          var phoneTabletBreak = 600;
          
          if(window.outerWidth > phoneTabletBreak)
          {
            // tablet form
            scope.lastPan.endX = 0;

            scope.isPhone = false;
            scope.menu.moveTo(0);
            scope.menu.isPhone = false;
          }
          else
          {
            // phone
            scope.lastPan.endX = 280;

            scope.isPhone = true;
            scope.menu.moveTo(scope.lastPan.endX);
            scope.menu.isPhone = true;
          }
        }
        

        window.addEventListener("optimizedResize", function() {
          console.log(`window [innerWidth:${window.innerWidth}] [innerHeight:${window.innerHeight}]`);
          console.log(`window [outerWidth:${window.outerWidth}] [outerHeight:${window.outerHeight}]`);
          
          init();
        });

        function Menu(draggable){
          if(! draggable instanceof HTMLElement)
            return;
          
          var _self = this;
          this.draggable = draggable;
          this.width = draggable.clientWidth;
          this.isPhone = false;
          this.translatedX = 0;

          this.normalizeMoveRange = function (x){
            
            var checkX = x;
            var factor = 1;
            if(!scope.isPhone){
              checkX = x * -1;
              factor = -1;
            }

            if(factor * checkX > _self.width)
              return factor * _self.width;
            
            console.log(checkX);
            if(checkX < 0)
              return 0;
            
            return factor * checkX;

            /*
            if(scope.isPhone){
              // range 0 <-> _self.width
              if(x > _self.width)
                return _self.width;
              
              if(x < 0)
                return 0;
              
              return x;
            }
            else{
              // range - _self.width <-> 0
              if(x < - _self.width)
                return - _self.width;
            
              if(x > 0)
                return 0;
    
              return x;
            }
            */
          }; 

          this.moveTo = function (translatex){
            var toX = _self.normalizeMoveRange(translatex);
            _self.translatedX = toX;

            _self.draggable.style.transform = `translate3d( ${toX}px, 0, 0)`;
          }

          this.close = function(){
            if(_self.isPhone){
              _self.moveTo(0);
            }
            else{
              _self.moveTo(-1 * _self.width)
            }
          }

          this.open = function(){
            if(_self.isPhone){
              _self.moveTo(_self.width);
            }
            else{
              _self.moveTo(0);
            }
          }

          var draggableX = function(){
            //_self.draggable.
          }

          this.isOpen = function(){
            console.log(`menu x: ${_self.translatedX}`);

            if(_self.isPhone && _self.translatedX === _self.width){
              return true;
            }
            else if(! _self.isPhone && _self.translatedX === 0){
              return true;
            }

            return false;
          }
        };

        function PanMove(menuWidth){
          var _self = this;
          var endX = 0; // assuming
          this.menuWidth = menuWidth;

          this.normalizeMoveRange = function (x){
            var checkX = x;
            var factor = 1;
            if(!scope.isPhone){
              checkX = x * -1;
              factor = -1;
            }

            if(checkX > _self.width)
              return factor * _self.width;
            
            if(checkX < 0)
              return 0;
            
            return factor * checkX;
          };
          
          this.tabletEnd = function(deltaX){
            var xEnd = _self.normalizeMoveRange(deltaX);
            console.log(`pan end ${xEnd}`);
            if(xEnd < -scope.menu.width /3  )
            {
              // go to -scope.menu.width
              scope.menu.moveTo(-scope.menu.width);
              //scope.lastPan.endX = -scope.menu.width;
            }
            else
            {
              // go to 0
              scope.menu.moveTo(0);
              //scope.lastPan.endX = 0;
            }
          }

          this.moving = function(deltaX){

          }
          this.moveEnd = function(deltaX){

          }
        }

        //console.log('postLink');
        //console.log(element);
        var draggableMenu = element[0].querySelector('.touch-menu');
        scope.lastPan = {};
        scope.lastPan.endX = 0;

        scope.menu = new Menu(draggableMenu);
        


        scope.onPanMove = function onHammer (event) {
          console.log(`panMove deltaX ${event.deltaX}, endX ${scope.lastPan.endX}`);
          //var translatex = scope.lastPan.endX + event.deltaX;
          var translatex = scope.lastPan.endX + event.deltaX;
          
          scope.menu.moveTo(translatex);
        };

        scope.onPanStart = function onPanStart(event){
          console.log('pan start!');
        };

        scope.onPanEnd = function onPanEnd(event){
          //var bounds = element[0].getBoundingClientRect();
          //scope.lastPan.endX  = scope.lastPan.endX + event.deltaX;
          console.log(`scope.lastPan.endX ${scope.lastPan.endX}`);
          var xEnd = scope.menu.normalizeMoveRange(scope.lastPan.endX + event.deltaX);
          console.log(`pan end ${xEnd}`);

          var breakPointRatio = 1 /  3;
          var breakPoint;
          var factor = 1;
          if(scope.isPhone){
            breakPoint = scope.menu.width * (1 - breakPointRatio);
          }
          else{
            breakPoint = -1 * scope.menu.width * breakPointRatio;
            factor = -1;
          }


          console.log(`isPhone(${scope.isPhone}) xEnd(${xEnd}) < breakPoint(${breakPoint})`);
          if(xEnd < breakPoint  )
          {
            // go to -scope.menu.width
            if(scope.isPhone){
              //scope.menu.moveTo(0);
              scope.lastPan.endX = 0;
            }
            else {
              //scope.menu.moveTo( factor * scope.menu.width);
              scope.lastPan.endX = factor * scope.menu.width;
            }
            scope.menu.close();
          }
          else
          {
            // go to 0
            if(scope.isPhone){
              //scope.menu.moveTo(scope.menu.width);
              scope.lastPan.endX = scope.menu.width;
            }
            else{
              //scope.menu.moveTo(0);
              scope.lastPan.endX = 0;
            }
            scope.menu.open();
          }
        };
         
        scope.onClick = function onClick(){
          console.log('click');
          console.log( `scope.menu.isOpen(): ${scope.menu.isOpen()}`);
        }

        init();

      }
      
    };
  });
