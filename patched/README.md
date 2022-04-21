# Библиотека Patched 
Это java библиотека для изменения/добавления функционала методов

patched.js - подключается как обычная js библиотека

classes.dex - подключается как обычная java библиотека 

# Список методов 
*флаги*
```js
Flags.BEFORE - до выполнения метода
Flags.AFTER - после выполнения метода
Flags.REPLACE - заменить метод

//Flags.BEFORE | Flags.AFTER - до и после выполнения метода 
//Flags.BEFORE | FLAGS.REPLACE - до выполнения метода и заменить метод
```

*Заменяет метод в объекте*
```js
Patched.patchedToObject(object, name, function(controller){
//controller - java класс контроллера 
}, flags)
```

*Получает заменённый метод*
```js
Patched.getReplacedFunction(orginalFunction, function(controller){
//controller - java класс контроллера 
}, flags);
```

*Методы контроллера*
```js
controller.setReplaced(boolean);
controller.isReplaced();
controller.getValue(cmd);
controller.getThisValue(cmd);//возвращает результат из области видимости, где выполняется функция, исключением является закрытая область 
controller.getContextValue(cmd);//возвращает результат из области видимости, где выполняется функция 
controller.putValue(cmd, value);
controller.putThisValue(cmd, value);
controller.putContextValue(cmd, value);
controller.eval(code);//выполняет код, для области видимости функции
controller.getOriginalFunction();
controller.getContext();
controller.setArguments(array);
controller.getArguments();
controller.setResult(value);
controller.getResult();
controller.call();//вызывает оригинальный метод 
controller.construct();//вызывает оригинальный конструктор 
```

### Пример
```js
let items = {};
 
Patched.patchedToObject(Item, "createItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
```
