interface.js
============

for define and check implementation of interface javascript
<h3>Define Interface</h3>
```js
var Collection = Interface.define('Collection', {

    add : function(object){
    
    },
    
    addAll : function(collection){
    
    }
});
```
<h3>Extends Interface</h3>
```js
var List = Interface.define('List', {
    
    get : function(index){
    
    },
    
    set : function(index, object){
    
    }
}).extends(Collection);
```
<h3>Implements Interface</h3>
```js
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

console.log(Interface.isImplements(ArrayList, Collection)); //true

console.log(Interface.isImplements(ArrayList, List)); //false
//because it's not implements method set(index, object) of Interface 'List'

console.log(Interface.ensureImplements(ArrayList, Collection)); //not throw Error

console.log(Interface.ensureImplements(ArrayList, List)); 
//throw Error, because it's not implements method set(index, object) of Interface 'List'


//implements method set
ArrayList.prototype.set = function(index){
   //coding...
};

console.log(Interface.ensureImplements(ArrayList, List)); 
//throw Error, because it's not implements arguments 'object' of method set(index, object) of Interface 'List'

//new implements method set
ArrayList.prototype.set = function(index, object){ //success
   //coding...
};
```
