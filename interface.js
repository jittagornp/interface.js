/**
 * for define and check implementation of interface javascript
 *
 * @author jittagorn pitakmetagoon
 * create 10/02/2014
 *
 * License Apache License Version 2.0, January 2004
 * 
 * =============================================================================
 * example to use
 * 
 * var UserService = Interface.define('UserService', {
 * 
 *     save : function(user){
 *     
 *     }
 * });
 * 
 * //define class
 * var UserServiceImpl = function(){
 * 
 * };
 * 
 * //define method
 * UserServiceImpl.prototype.save = function(){
 * 
 * };
 * 
 * Interface.ensureImplements(UserServiceImpl, UserService); 
 * //will throw Error, it's not implements arguments user on save method
 * 
 * modify new
 * -----------------------------------------------------------------------------
 * UserServiceImpl.prototype.save = function(user){
 * 
 * };
 * 
 * Interface.ensureImplements(UserServiceImpl, UserService); //not throw Error
 */
window.Interface = window.Interface || (function(Array, Object, String, Function, Error, undefined) {

    //define class ImplementsException
    var ImplementsException = function() {
        //
    };

    //extends an Error
    ImplementsException.prototype = new Error();

    // protect old browser not support method trim
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    //code from http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array
    Array.prototype.remove = function(item) {
        for (var i = this.length; i--; ) {
            if (this[i] === item) {
                this.splice(i, 1);
            }
        }
    };

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

    var FuntionUtils = (function() {

        //This regex is from require.js
        var FUNCTION_ARGUMENT_REGEX_PATTERN = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

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
                if (!isFunction(func)) {
                    throw new Error('Invalid input type parameters, FuntionUtils.getArgumentsFromFunction(Function func) - func is not function.');
                }

                var args = func.toString().match(FUNCTION_ARGUMENT_REGEX_PATTERN)[1].split(',');
                var length = args.length;
                for (var i = 0; i < length; i++) {
                    args[i] = args[i].trim().replace('\n/**/', '');
                }

                args.remove('');

                return args;
            }
        };
    }).call(this);

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
     * define global Interface
     */
    var Interface = function() {
        //define interface
    };


    var __slice = Array.prototype.slice;

    /**
     * public static method for define Interface by interface name an interface prototype
     * 
     * @param {String} name
     * @param {Object} prototype
     * 
     * @throws {Error} - invalid input type parameters
     * @returns {Bridge} interface
     */
    Interface.define = function(name, prototype) {
        if (!isString(name) || !isObject(prototype)) {
            throw new Error('Invalid input type parameters, Interface.define(String name, Object prototype).');
        }

        var Bridge = function() {
            //define bridge
        };

        //extends an Interface
        Bridge.prototype = new Interface();
        Bridge.__interfaceName = name;

        forEachProperty(prototype, function(behavior, property) {
            if (isFunction(behavior)) {
                var args = FuntionUtils.getArgumentsFromFunction(behavior);
                Bridge.prototype[property] = new Function(args, functionBody(property, args));
            }
        });


        function functionBody(property, args) {
            return "throw new Error('Abstract method \\'" + property + "(" + args.join(', ') + ")\\' of interface \\'" + name + "\\' it\\'s not implements.')";
        }

        /**
         * for extends from SuperInterface to this interface
         * @param {Bridge} SuperInterface
         * @returns {Bridge} interface
         */
        Bridge.extends = function() {
            forEachProperty(__slice.call(arguments), function(interfc, index) {
                if (!isFunction(interfc) || !(interfc.prototype instanceof Interface)) {
                    throw new Error('Invalid input type parameters, Interface.extends(Interface interfaces...) - interfaces[' + index + '] is not "Interface".');
                }

                forEachProperty(interfc.prototype, function(method, property) {
                    Bridge.prototype[property] = method;
                });
            });

            return Bridge;
        };

        return Bridge;
    };

    /**
     * for ensure Class or class instance implements an interfaces
     * 
     * @param {Function | Object} class
     * @param {Interface} interfaces.. 
     *
     * @throws {Error} - invalid input type parameters
     * @throws {ImplementsException} 
     */
    Interface.ensureImplements = function() {
        if (arguments.length < 2 || !(isFunction(arguments[0]) || isObject(arguments[0]))) {
            throw new Error('Invalid input type parameters, Interface.ensureImplements(<Function | Object> class, Interface interfaces...).');
        }

        var classInstance = isFunction(arguments[0]) ? arguments[0].prototype : arguments[0];
        var interfaces = __slice.call(arguments, 1);

        //implements multiple interfaces
        forEachProperty(interfaces, function(interfc, index) {
            if (!isFunction(interfc) || !(interfc.prototype instanceof Interface)) {
                throw new Error('Invalid input type parameters, Interface.ensureImplements(<Function | Object> class, Interface interfaces...) - interfaces[' + index + '] is not "Interface".');
            }

            forEachProperty(interfc.prototype, function(behavior, property) {
                if (isFunction(behavior)) {
                    if (!isFunction(classInstance[property])) {
                        throw new ImplementsException('it\'s not implements method ' + property + '() of interface "' + interfc.__interfaceName + '".');
                    }

                    var interfaceArgs = FuntionUtils.getArgumentsFromFunction(behavior);
                    var classArgs = FuntionUtils.getArgumentsFromFunction(classInstance[property]);

                    if (interfaceArgs.length !== classArgs.length) {
                        throw new ImplementsException('it\'s not implements arguments on method ' + property + '(' + interfaceArgs.join(', ') + ') of interface "' + interfc.__interfaceName + '".');
                    }
                }
            });
        });
    };


    /**
     * for check Class or class instance implements an interfaces
     * 
     * @param {Function | Object} class
     * @param {Interface} interfaces.. 
     *
     * @throws {Error} - invalid input type parameters
     * @return {Boolean}
     */
    Interface.isImplements = function() {
        try {
            Interface.ensureImplements.apply(this, arguments);
        } catch (ex) {
            if (ex instanceof ImplementsException) {
                return false;
            }

            throw ex;
        }

        return true;
    };



    /**
     * return Interface
     */
    return Interface;

}).call(this, Array, Object, String, Function, Error);
