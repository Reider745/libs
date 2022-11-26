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
        ],
        right?: [
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

# Примеры

```js
ModAPI.addAPICallback("ClassicUI", function(api){
	api.registerAllHandler({
		onOpen(id, group, tile){
			let setting = api.getBlockFunctions(id);
			if(!setting.disableJeiMobile){
				let size = api.getSizeClassicUi(id, group);
				Jei.open({
					x: size.x + size.width,
					line: 6
				});
			}
		},
		onClose(){
			Jei.close();
		}
	});
});
```

```js
ModAPI.addAPICallback("ClassicUI", function(api){
  BackpackUI = api.getWindow("aw_item_backpack", BackpackUI, {});
});
```

```js
ModAPI.addAPICallback("ClassicUI", function(api){
  api.setBlockFunctions(BlockID.copperChest, {
      disableVanillaSlots: false,
      disableInventory: true,
      disableJeiMobile: true,
      tabs: {
          left: [
              {
                  id: 1,
                  icon: {
                      id: 264
                  },
                  onClick(default_window, config, theme, id){
                      return api.buildMain(default_window, id, config);
                  }
              }
          ],
          right: [
            {
              id: 1,
              icon: {
                id: 263,
              },
              onClick(default_window, config, theme, id){
                return new UI.Window({});
              }
            },
            {
              id: 2,
              icon: {
                id: 264
              },
              onClick(default_window, config, theme, id){
                return api.buildMain(default_window, id, config);
              }
            }
          ]
      }
  });
});
```

```js
ModAPI.addAPICallback("ClassicUI", function(api){
	api.registerUiConfig("coal_generator",{
    "x": 0,
		"y": 75,
		"scale": -0.19999999999999996
	});
	api.registerUiConfig("oxygen_storage_module",{
		"x": -25,
		"y": 50,
		"scale": -0.19999999999999996
	});
	
	api.registerTheme("Dark_SpacesCraft", {
		"slot":	"_default_slot",
		"invSlot": "_default_slot",
		"selected_slot": "_selection",
		"selected_invSlot": "_selection",
		"frame": "workbench_frame3",
		"color_inventory": "#ffffff",
		"color_title": "#ffffff",
	});
	
	api.registerAllHandler({
	  updateUi(id, window, tile){
	   let content = window.getContent();
	   
	   let config = api.getConfig(id);
	   let theme = api.getTheme(id);
	   
	   if(config.theme == "Dark_SpacesCraft")
	    for(let key in content.elements){
	     let element = content.elements[key];
	     
	     if(element.bitmap == "SPC.SPC_Canister"){
	        element.bitmap = "SPC_Canister_Dark"};
	        
	     if(element.bitmap == "Others.en_slot"){
	        element.bitmap = "en_slot_dark"};
	        
	     if(element.bitmap == "RocketSlots"){
	        element.bitmap = "RocketSlots_dark"};
	        
	     if(element.bitmap == "trashslot"){
	        element.bitmap = "dark_trashslot"};
	        
	     if(element.bitmap == "ChestableSlot"){
	        element.bitmap = "ChestableSlot_dark"};
	        
	        
	        
	     if(element.bitmap == "Others.O2Slot"){
	        element.bitmap = "O2Slot_dark"};
	        if(element.bitmap == "coalslot"){
	        element.bitmap = "coalslot_dark"};
	        
	        if(element.bitmap == "energy_small_background"){
	        element.bitmap = "energy_small_dark"};
	        if(element.bitmap == "arrow_bar_background"){
	        element.bitmap = "arrow_bar_dark"};
	    }
	  }
	 });
});
```
