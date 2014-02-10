/**
 * @author jittagorn pitakmetagoon
 * create 10/02/2014
 */
window.Interface = window.Interface || (function(Array, Object) {


    var FuntionUtils = (function(String) {

        //This regex is from require.js
        var FUNCTION_ARGUMENT_REGEX_PATTERN = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

        // protect old browser not support method trim
        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }

        return {
            /**
             * regular expression pattern for get arguments name in the function
             */
            FUNCTION_ARGUMENT_REGEX_PATTERN: FUNCTION_ARGUMENT_REGEX_PATTERN,
            /**
             * for get arguments name of input function parameter
             * code from http://stackoverflow.com/questions/20058391/javascript-dependency-injection
             *
             * @param {Function} func
             * @throws Error
             * @returns {Array<String>} - array of arguments name
             */
            getArgumentsFromFunction: function(func) {
                if (typeof func !== 'function') {
                    throw new Error('FuntionUtils.getArgumentsFromFunction(Function func) require parameter is a function');
                }

                var args = func.toString().match(FUNCTION_ARGUMENT_REGEX_PATTERN)[1].split(',');
                var length = args.length;
                for (var i = 0; i < length; i++) {
                    args[i] = args[i].trim().replace('\n/**/', '');
                }

                return args;
            }
        };
    }).call(this, String);


    function is(data, type) {
        return Object.prototype.toString.call(data) === '[object ' + type + ']';
    }

    function isFunction(data) {
        return is(data, 'Function');
    }

    function isBoolean(data) {
        return is(data, 'Boolean');
    }

    function isString(data) {
        return is(data, 'String');
    }

    function isObject(data) {
        return is(data, 'Object');
    }

    function forEachProperty(object, callback, context) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                var bool = callback.call(context || null, object[property], property, object);
                if (isBoolean(bool) && !bool) {
                    return;
                }
            }
        }
    }

    /**
     * define global variable Interface
     */
    var Interface = function() {
        //define interface
    };


    var __slice = Array.prototype.slice;

    /**
     * public static method
     * 
     * @param {String} name
     * @param {Object} prototype
     * 
     * @returns {Bridge} interface
     */
    Interface.define = function(name, prototype) {
        if (!isString(name) || !isObject(prototype)) {
            throw new Error('Interface.define(String interfaceName, Object prototypeInterface)');
        }

        var Bridge = function() {
            //define bridge
        };

        Bridge.prototype = new Interface();
        Bridge.interfaceName = name;

        forEachProperty(prototype, function(behavior, property) {
            if (isFunction(behavior)) {
                Bridge.prototype[property] = new Function(FuntionUtils.getArgumentsFromFunction(behavior), functionBody(property));
            }
        });


        function functionBody(property) {
            return "throw new Error('abstract method \\'" + property + "()\\' of interface \\'" + name + "\\' it\\'s not implements.')";
        }

        /**
         * for extends from SuperInterface to this interface
         * @param {Bridge} SuperInterface
         * @returns {Bridge} interface
         */
        Bridge.extends = function() {
            forEachProperty(__slice.call(arguments), function(interfc, index) {
                if (!isFunction(interfc) || !(interfc.prototype instanceof Interface)) {
                    throw new Error('Interface.extends(Interface interfaces...) interfaces[' + index + '] is not "Interface".');
                }

                forEachProperty(interfc.prototype, function(method, property) {
                    Bridge.prototype[property] = method;
                });
            });

            return Bridge;
        };

        return Bridge;
    };


    Interface.ensureImplements = function() {
        if (arguments.length < 2 || !(isFunction(arguments[0]) || isObject(arguments[0]))) {
            throw new Error('Invalid input type paramters, Interface.ensureImplements(Class class, Interface interfaces...)');
        }

        var classInstance = isFunction(arguments[0]) ? arguments[0].prototype : arguments[0];
        var interfaces = __slice.call(arguments, 1);

        //implements multiple interfaces
        forEachProperty(interfaces, function(interfc, index) {
            if (!isFunction(interfc) || !(interfc.prototype instanceof Interface)) {
                throw new Error('Interface.ensureImplements(Class class, Interface interfaces...) interfaces[' + index + '] is not "Interface".');
            }

            forEachProperty(interfc.prototype, function(behavior, property) {
                var interfaceArgs = FuntionUtils.getArgumentsFromFunction(behavior);
                var classArgs = FuntionUtils.getArgumentsFromFunction(classInstance[property]);

                if ((isFunction(behavior) && !hasProperty(classInstance, property)) || interfaceArgs.length !== classArgs.length) {
                    throw new Error('it\'s not implements method ' + property + '(' + interfaceArgs.join(', ') + ') of interface "' + interfc.interfaceName + '".');
                }
            });
        });

        //protect prototype inheritance
        function hasProperty(context, property) {
            for (var prop in context) {
                if (prop === property) {
                    return true;
                }
            }

            return false;
        }
    };



    Interface.isImplements = function() {
        try {
            Interface.ensureImplements.apply(this, arguments);
        } catch (ex) {
            return false;
        }

        return true;
    };


    /**
     * return Interface
     */
    return Interface;

}).call(this, Array, Object);