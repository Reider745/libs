# Pre mod load

Библиотека создана для изменения порядка запуска модификаций 

1)Подключить java библ

2)Добавте файл preloader 

Напишите там это
```js
Callback.addCallback("ModsPreLoaded", function(){
	let ModLoader = WRAP_JAVA("com.reider.ModLoader");
	ModLoader.addPreLoad(__dir__);
});
```

# Список методов 
*Имя мода это название папки* 

*Изменит приоритет загрузки мода*
```js
ModLoader.addPreLoad(dir);
ModLoader.addPreLoad(dir, name);

ModLoader.addPostLoad(dir);
ModLoader.addPostLoad(dir, name);
```

*Проверит естли мод в списке модов*
Возвращает java boolean 
```js
ModLoader.isRegisterModLoadedByName(name);
ModLoader.isRegisterModLoadedByDir(dir);
```

*Удалит загрузку мода*
```js
ModLoader.deleteLoadedByName(name);
ModLoader.deleteLoadedByDir(dir);
```

*Возвращает количество модов*
```js
ModLoader.countMod();
```