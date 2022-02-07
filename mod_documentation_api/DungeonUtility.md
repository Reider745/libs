# Dungeon Utility 
Dungeon Utility - мод библиотека, для создания структур и работы со структурами

+ Преимущества:
  + 1. Быстрая скорость работы 
  + 2. Поддержка различных форматов 
  + 3. Большое количество возможностей 
+ Минусы 
  + 1. Поддержка только inner core 1.16
  + 2. Необходимо делать зависимость мода от Dungeon Utility

## Создание своей структуры 
Базовые методы 
Для начала необходимо создать структуру, это можно сделать кодом или загрузить структуру из файла 

### Сохранение структуры в файл 
+ Для начала возьмите топор их креатива "Dungeon wood"
  + 1. Вылелите первую и вторую точку(нажатие по блоку)
  + 2. Выберите середину структуры(нажатие на шифте)
  + 3. Ввиде команду "/struct save name:string save_air:bool specialSeparator:bool type:string, compile:bool", если проще говоря "/struct save name false false"



+ Все поддерживаемые форматы 
  + DungeonUtility 
  + DungeonAPI
  + DungeonAPI_V2
  + DungeonCore
  + Structures



Регистрация загрузка структуры(Структуры загржаются во время загрузки мира)

**StructureLoader.load(path, name, type, compression)**
+ Параметры 
  + path - полный путь к файлу
  + name - имя структуры под которым она будет доступна 
  + type - формат загружаемой структуры, по умолчанию DungeonUtility 
  + compression - сжатали структура, по умолчанию false 

Загружает структуру в любое время, не все форматы это поддерживают

**StructureLoader.loadRuntine(path, name, type, compression)**
+ Параметры 
  + path - полный путь к файлу
  + name - имя структуры под которым она будет доступна 
  + type - формат загружаемой структуры, по умолчанию DungeonUtility 
  + compression - сжатали структура, по умолчанию false 

Проверка загружинали структура 

**StructureLoader.isLoad(name)**
+ Параметры
  + name - имя структуры 


Создание структуры кодом

**StructureUtility.newStructure(name, stru)**
+ Параметры
  + имя структуры 
  + массив блоков, по умолчанию пустой 


Добавление блоков в структуру

**StructureUtility.addBlock(stru, x, y, z, state, extra, tag)**
+ Параметры
  + name - имя структуры 
  + x, y, z - координаты 
  + state - BlockState основного блока
  + extra - BlockState дополнительного блока, по умолчанию null
  + tag - NBT.CompoundTag блока


Получение имени всех структур 

**StructureUtility.getAllStructureName()**


Установка структуры в мире

**Structure.setStructure(name, x, y, z, region, packet)**
+ Параметры 
  + name - имя структуры 
  + x, y, z - координаты 
  + region - BlockSource 
  + packet - по умолчанию {}, требуется для создания более сложных структур, передаётся в прототип структуры 



Создание прототипа структуры 

**Structure.setGlobalPrototype(name, obj)**
+ Параметры 
  + имя структуры 
  + obj - объект описания
    + isBlock(original_pos, data, region, packet){return true} проверка можетли блок быть установлен 
    + setBlock(original_pos, data, region, packet){} - событие установики блока
    + before(x, y, z, region, packet){} - перед установки структуры 
    + after(x, y, z, region, packet){} - после установки структуры 



Создание объекта структуры 

**new Structure.advanced(name)**
+ name - имя структуры 
+ создаёт объект 
  + **setStructure(x, y, z, region, packet)**
    + x, y, z - объект структуры 
    + region - BlockSource 
    + packet - по умолчанию {}, требуется для создания более сложных структур, передаётся в прототип структуры 
  + **setProt(obj)**
    + принимает объект описания
      + isBlock(original_pos, data, region, packet){return true} проверка можетли блок быть установлен 
      + setBlock(original_pos, data, region, packet){} - событие установики блока
      + before(x, y, z, region, packet){} - перед установки структуры 
      + after(x, y, z, region, packet){} - после установки структуры 
  + **setUseGlobalPrototype(value)**
    + использовать ли глобальный прототип 



Класс PrototypeJS может использоваться место обычного прототипа, более быстрый но в некоторых ситуациях может выдовать ошибку

**класс PrototypeJS(isBlock, setBlock, before, after)**
+ Параметры
  + isBlock(original_pos, data, region, packet){return true} проверка можетли блок быть установлен 
  + setBlock(original_pos, data, region, packet){} - событие установики блока
  + before(x, y, z, region, packet){} - перед установки структуры 
  + after(x, y, z, region, packet){} - после установки структуры 

## Новые кэлбэки 
перед загрузки структур
```js
Callback.addCallback("StructurePreLoad", function(){
  
});
```
после загрузки структур
```js
Callback.addCallback("StructureLoad", function(){
  
});
```

# Примеры

```js
ModAPI.addAPICallback("DungeonUtility", function(api){
  const StructureUtility = api.StructureUtility;
    
  //создание структуры 
  StructureUtility.newStructure("test");
    
  //добавляем в структуру блоки 
  for(let i = 0;i < 10;i++)
    StructureUtility.addBlock("test", 0, i, 0, new BlockState(5, 2));
  
  //генерация структуры 
  new api.Structure.GenerateType.OverworldFind({
    chance: 100,//чем больше чесло, тем реже генерируются
    stru: new api.Structure.advanced("test")
  });
});
```

```js
ModAPI.addAPICallback("DungeonUtility", function(api){
  const StructureUtility = api.StructureUtility;
  
  //создание структуры 
  StructureUtility.newStructure("test");
  
  //добавляем в структуру блоки 
  for(let i = 0;i < 10;i++)
    StructureUtility.addBlock("test", 0, i, 0, new BlockState(5, 2));
    
  Callback.addCallback("ItemUse", function(coords,item,block,isExter,player){
    //устанавливаем структуру при нажатии 
    api.Structure.setStructure("test", coords.x,coords.y,coords.z,BlockSource.getDefaultForActor(player))
  });
});
```

```js
ModAPI.addAPICallback("DungeonUtility", function(api){
  //загрузка структуры
  api.StructureLoader.load(__dir__+"/Test.struct", "test");
  let Test = new api.Structure.advanced("test");
  
  //создание прототипа структуры
  Test.setProt(new api.PrototypeJS(function(original_pos, data, region, packet){
      //с 50% шансов устанавливаем блок
      return Math.random() <= .5;
    }, function(pos, data, region, packet){
      //устанавливаем блок досок
      region.setBlock(pos.x+data.x,pos.y+data.y,pos.z+data.z, 5);
    }, function(x, y, z, region, packet){
    
    },function(x, y, z, region, packet){
      
  }));
  Callback.addCallback("ItemUse", function(coords,item,block,isExter,player){
  //устанавливаем структуру при нажатии 
    Test.setStructure(coords.x,coords.y,coords.z,BlockSource.getDefaultForActor(player))
  });
});
```
Также DungeonUtility использует Schematic, AncientWonders, Dungeon craft.
