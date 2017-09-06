'use strict';

describe('Directive: navigationDrawer', function () {

  // load the directive's module
  beforeEach(module('navdrawerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<navigation-drawer></navigation-drawer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the navigationDrawer directive');
  }));
});
