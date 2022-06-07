# DependenceHelper 
Библиотека для создания зависимостей модификаций. 

пример:
```js
//launcher.js
new Dependence(__name__)
	.addDependence("CoreUtility")
	.setLaunch(function(api){
		Launch(api["CoreUtility"]);
	});
```