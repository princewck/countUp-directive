;(function(global, factory) {
    if (typeof exports === 'object' && typeof module != 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && typeof define.amd) {
        define([], factory);
    } else {
        if (global.CountUp && global.angular) {
            global.fCountUp = factory();
        } else {
            throw new Error('fCountUp needs angular and countUp.js');
        }
    }
} (this, function() { 'use strict';
    angular.module('fCountUpModule',[])
        .directive('fCountUp', ['$parse', function($parse) {
        return {
            restrict: 'A',
            scope: {
                endVal: '=fCountUp',
                startValue: '=',
                instance: '='
            },
            link: function(scope, element, attrs, controller, transcludeFn) {
                if(['true', 'false'].indexOf(attrs.useEasing)) {
                    attrs.useEasing = $parse(attrs.useEasing);
                } else {
                    attrs.useEasing = true;
                }
                if (['true', 'false'].indexOf(attrs.useGrouping)) {
                    attrs.useGrouping = $parse(attrs.useGrouping);
                } else {
                    attrs.useGrouping = true;
                }
                attrs.separator = attrs.separator || ',';
                attrs.decimal = Number(attrs.decimal) ? attrs.decimal : '.';
                attrs.prefix = attrs.prefix || '';
                attrs.suffix = attrs.suffix || '';
                attrs.duration = parseInt(attrs.duration) || 3;
                attrs.decimalLen = parseInt(attrs.decimalLen) || 0;
                var getOptions = function() {
                    return {
                        useEasing : attrs.useEasing,
                        useGrouping : attrs.useGrouping,
                        separator : attrs.separator,
                        decimal : attrs.decimal,
                        prefix : attrs.prefix,
                        suffix : attrs.suffix
                    };                    
                };
                var getStartValue = function() {
                    if(isNaN(Number(scope.startValue))) {
                        return 0;
                    } else {
                        return Number(scope.startValue);
                    }
                };
                scope.getAttrs = function() {
                    return attrs.useEasing + attrs.useGrouping 
                            + attrs.separator + attrs.decimal 
                            + attrs.prefix + attrs.suffix
                            + attrs.duration + attrs.decimalLen;
                };
                scope.cu = new CountUp(element[0], getStartValue(), scope.endVal, attrs.decimalLen, attrs.duration, getOptions());
                scope.cu.start();
                scope.$watch('endVal', function(n, o) {
                    if(isNaN(n)) return;                   
                    scope.cu.update(n);
                });
                scope.$watchGroup(['getAttrs()', 'startValue'], function(n,o) {
                    console.log(attrs);
                    scope.cu = new CountUp(element[0], getStartValue(), scope.endVal, attrs.decimalLen, attrs.duration, getOptions());
                    scope.cu.start();                    
                });
                scope.instance = function() {
                   return scope.cu;
                };
            }
        }
    }]);
}));