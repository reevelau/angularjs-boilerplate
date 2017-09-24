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

        function init(){
          var phoneTabletBreak = 600;
          
          if(window.outerWidth > phoneTabletBreak){
            // tablet form
            scope.menu.setMenuType(false);
            
          }
          else{
            // phone
            scope.menu.setMenuType(true);
          }

          scope.menu.open(false);
        }
        

        window.addEventListener("optimizedResize", function() {
          console.log(`window [innerWidth:${window.innerWidth}] [innerHeight:${window.innerHeight}]`);
          console.log(`window [outerWidth:${window.outerWidth}] [outerHeight:${window.outerHeight}]`);
          
          init();
        });

        function Menu(menuDiv, maskDiv){
          if(! menuDiv instanceof HTMLElement)
            return;
          
          if(! maskDiv instanceof HTMLElement)
            return;

          var _self = this;
          this.menuDiv = menuDiv;
          this.maskDiv = maskDiv;
          this.width = menuDiv.clientWidth;
          this.isPhone = false;
          this.translatingX = 0;
          this.translatedX = 0;
          var menuZIndex = window.getComputedStyle(menuDiv).zIndex;

          this.normalizeMoveRange = function (x){
            
            var checkX = x;
            var factor = 1;
            if(!_self.isPhone){
              checkX = x * -1;
              factor = -1;
            }

            if(factor * checkX > _self.width)
              return factor * _self.width;
            
            if(checkX < 0)
              return 0;
            
            return factor * checkX;
          }; 

          var setMaskOpacity = function(newMenuPos){
            if(!_self.isPhone)
              return;
            
            _self.maskDiv.style.zIndex = menuZIndex -1;
            var opacity = parseFloat((newMenuPos / _self.width) * 0.8);
            _self.maskDiv.style.opacity = opacity;
          }

          this.moveTo = function (translatex, animate){
            if(animate){
              _self.menuDiv.style.transition = `all 0.3s ease-out`;
            }
            else{
              _self.menuDiv.style.transition = 'none';
            }

            var toX = _self.normalizeMoveRange(translatex);
            _self.translatingX = toX;

            _self.menuDiv.style.transform = `translate3d( ${toX}px, 0, 0)`;

            setMaskOpacity(toX);
          }

          this.moveByDelta = function(deltaX){
            _self.moveTo(_self.translatedX + deltaX, true);
          }

          

          this.close = function(animate){
            if(_self.isPhone){
              _self.moveTo(0, animate);
            }
            else{
              _self.moveTo(-1 * _self.width, animate)
            }
            _self.released();

            _self.maskDiv.style.zIndex = -1;
          }

          this.open = function(animate){
            if(_self.isPhone){
              _self.moveTo(_self.width, animate);

              _self.maskDiv.style.zIndex = menuZIndex -1; 
            }
            else{
              _self.moveTo(0, animate);
            }
            _self.released();


          }

          this.released = function(){
            _self.translatedX = _self.translatingX;
            
          };

          this.releaseWithDelta = function(deltaX){
            var xEnd = _self.normalizeMoveRange(_self.translatedX + deltaX);
            
            var breakPointRatio = 1 /  3;
            var breakPoint;
            var factor = 1;
            if(scope.menu.isPhone){
              breakPoint = _self.width * (1 - breakPointRatio);
            }
            else{
              breakPoint = -1 * _self.width * breakPointRatio;
              factor = -1;
            }

            if(xEnd < breakPoint  ){
              _self.close(true);
            }
            else{
              _self.open(true);
            }
            _self.released();

          };

          this.isOpen = function(){
            if(_self.isPhone && _self.translatedX === _self.width){
              return true;
            }
            else if(! _self.isPhone && _self.translatedX === 0){
              return true;
            }

            return false;
          }

          this.setMenuType = function(isPhone){
            _self.isPhone = isPhone;
          }
        };

        var draggableMenu = element[0].querySelector('.nav-touch-menu');
        var mask = element[0].querySelector('.nav-touch-menu-mask');

        scope.menu = new Menu(draggableMenu, mask);
        

        scope.onPanMove = function onHammer (event) {
          scope.menu.moveByDelta(event.deltaX);
        };

        scope.onPanStart = function onPanStart(event){
          console.log('pan start!');
        };

        scope.onPanEnd = function onPanEnd(event){
          scope.menu.releaseWithDelta(event.deltaX);
        };
         
        scope.onClick = function onClick(){
          console.log('click');
          console.log( `scope.menu.isOpen(): ${scope.menu.isOpen()}`);
          if(scope.menu.isOpen()){
            scope.menu.close(true);
          }
          else{
            scope.menu.open(true);
          }

        }

        init();

      }
      
    };
  });
