interface.js
============

for define and check implementation of interface javascript
<h3>Define interface</h3>
- Syntax
```js
var prototype = {
    //define prototype as a function
};

var MyInterface = Interface.define(interface_name, prototype);
```
- Example
```js
var Collection = Interface.define('Collection', {

    add : function(object){
    
    },
    
    addAll : function(collection){
    
    }
});
```
<h3>Extends interface</h3>
- Syntax
```js
var MyInterface = Interface.define('INTERFACE_NAME', {

   //define prototype as a function

}).extends(Interface1, Interface2, Interface3, ..., InterfaceN) 
```
- Example
```js
var List = Interface.define('List', {
    
    get : function(index){
    
    },
    
    set : function(index, object){
    
    }
}).extends(Collection); //*****

// you can extends multiple interfaces
// use .extends(Interface1, Interface2, Interface3, ..., InterfaceN) 
```
<h3>Implements interface</h3>
Define class (implementation)
```js
//class ArrayList
var ArrayList = function(){

};

ArrayList.prototype.add = function(object){
   //coding...
};

ArrayList.prototype.addAll = function(collection){
   //coding...
};

ArrayList.prototype.get = function(index){
   //coding...
};
```
Implementation check
<br/>
- Syntax
```js
//return true, if implements all
Interface.isImplements(class_or_implementation, Interface1, Interface2, Interface3, ..., InterfaceN)

//throw Error, if not implements all
Interface.ensureImplements(class_or_implementation, Interface1, Interface2, Interface3, ..., InterfaceN)
```
- Example
```js
console.log(Interface.isImplements(ArrayList, Collection)); //true

console.log(Interface.isImplements(ArrayList, List)); //false
//because it's not implements method set(index, object) of Interface 'List'

Interface.ensureImplements(ArrayList, Collection); //not throw Error

Interface.ensureImplements(ArrayList, List); 
//throw Error: it's not implements method set() of interface "List".
```
Try again
```js
//implements method set
ArrayList.prototype.set = function(index){
   //coding...
};

Interface.ensureImplements(ArrayList, List); 
//throw Error: it's not implements arguments on method set(index, object) of interface "List".
```
And try again
```js
//new implements method set
ArrayList.prototype.set = function(index, object){ //success
   //coding...
};

Interface.ensureImplements(ArrayList, List); //not throw Error
```
