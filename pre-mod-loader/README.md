# Pre mod load

Библиотека создана для изменения порядка запуска модификаций 

1)Подключить java библ
2)Добавте файл preloader 

Напишите там это
```js
Callback.addCallback("ModsPreLoaded", function(){
	let Loader = WRAP_JAVA("com.reider.premodloader.ModLoader")
	Loader.addPreLoad(__dir__, "Item-Information")
	//место Item-Information пишете название своего мода
})
```