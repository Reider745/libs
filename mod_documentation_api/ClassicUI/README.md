# ClassicUi
## Список функций

Возвращает изменённый интерфейс
```js
getWindow(id, window, tile?);
```

Добавляет интерфейсу ванильные слоты
```js
addVanillaSlots(strId);
```


Возвращает конфиг блока
```js
getConfig(id);
```

Возвращает настройки темы
```js
getTheme(id);
```

Устанавливает конфиг интерфейсу
```js
registerUiConfig(id, config);
```

Создаёт тему
```js
registerTheme(id, theme);
```

Устанавливает свойства интерфейсу
```js
setBlockFunctions(id, {
    disableVanillaSlots?: boolean,
    disableInventory?: boolean,
    disableJeiMobile?: boolean,//добавляет Jei-mobile
    tabs?: {
        left?: [
            {
                id: number,
                icon?: {
                    id?: number,
                    count?: number,
                    data?: number
                },
                onClick(default_window, config, theme, id){
                    return new UI.Window(...)
                }
            }
        ]
    }
});
```

Возвращает свойства интерфейса
```js
getBlockFunctions(id);
```

Возвращает размер интерфейса ClassicUI
```js
getSizeClassicUi(id, group);
```

Устанавливает значение конфига по умолчанию
```js
setConfigDefaultValue(id, name, value);
```

Добавляет конфиг
```js
addedConfig(id... аргументы библиотеки RuntimeConfig);
```

Добавляет прослушиватель на интерфейс
```js
registerHandler(id, {
    preCreate?(group, tile){

    },
    postCreate?(group, tile){

    },
    updateUi?(group, tile){

    },
    onClose?(group, tile){
        
    },
    onOpen?(group, tile){

    }
});
```

Добавляет прослушиватель на все интерфейсы
```js
registerAllHandler({
    preCreate?(id, group, tile){

    },
    postCreate?(id, group, tile){

    },
    updateUi?(id, group, tile){

    },
    onClose?(id, group, tile){
        
    },
    onOpen?(id, group, tile){

    }
});
```

```js
requireGlobal(cmd);
```