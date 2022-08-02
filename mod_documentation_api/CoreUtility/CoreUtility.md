# Core Utility
## Область применения
Область применения ядра досточно большая, даже не смотря на то что ядро досточно молодое.
Ядро имеет возможность хукать и вызывать ванильнные методы из js, что значительно увеличивает возможности моддинга.

+ Декларации
    + core-utility.d.ts - декларация на англиском

## ToolTip
Добавляет tool tip предмету
```js
ToolTip.addToolTip(id, data, name);
```

Добавляет динамический tool tip 
```js
ToolTip.addDynamicPre(id, data, function(item){

});
```
Добавляет динамический tool tip 
```js
ToolTip.addDynamicPost(id, data, function(item){
    
});
```

Добавляет несколько tool tip предмету
```js
ToolTip.addToolTips(id, data, names);
```

Удаляет tool tip
```js
ToolTip.deletToolTip(id, data, names);
```

Очищает tool tip предмета
```js
ToolTip.clearToolTip(id, data);
```

Возврвщает tool tip предмета
```js
ToolTip.getToolTips(id, data);
```
Очищает все tool tip
```js
ToolTip.clearToolTips();
```

## NativeAPI
Типы конвертации id
```js
ConversionType.ITEM
ConversionType.BLOCK
```

Преобразовывает динамический в статический id
```js
NativeAPI.dynamicToStatic(id, type);
```

Преобразовывает статическиq в динамический id
```js
NativeAPI.staticToDynamic(id, type);
```

Возвращает уникальный индентификатор моба по поинтеру класса
```js
NativeAPI.getActorID(actor);
```

Возвращает класс моба по индентификатор моба
```js
NativeAPI.getActorById(id);
```

## Ванильные классы, вступление
Для не большого упрощения использования ядра ванильные классы наследуются от PointerClass

Возвращает поинтер класса
```js
<pointerClass>.getPointer();
```

## BlockPos
* наследован от PointerClass

```js
new BlockPos(pointer);
new BlockPos(x, y, z);
```

```js
<blockPos>.getX();
<blockPos>.getY();
<blockPos>.getZ();
```

```js
<blockPos>.setX(x);
<blockPos>.setY(y);
<blockPos>.setZ(z);
```

```js
<blockPos>.free();
```

## Vec3
* наследован от PointerClass

```js
new Vec3(pointer);
new Vec3(x, y, z);
```

```js
<vec3>.getX();
<vec3>.getY();
<vec3>.getZ();
```

```js
<vec3>.setX(x);
<vec3>.setY(y);
<vec3>.setZ(z);
```

```js
<vec3>.free();
```

## Vec2
* наследован от PointerClass

```js
new Vec2(pointer);
new Vec2(x, y);
```

```js
<vec2>.getX();
<vec2>.getY();
```

```js
<vec2>.setX(x);
<vec2>.setY(y);
```

```js
<vec2>.free();
```

## ChunkPos
* наследован от PointerClass

```js
new ChunkPos(pointer);
new ChunkPos(x, z);
```

```js
<ChunkPos>.getX();
<ChunkPos>.getZ();
```

```js
<ChunkPos>.setX(x);
<ChunkPos>.setZ(z);
```

```js
<ChunkPos>.free();
```

## ItemsUtil

Возвращает PointerClass по динамическому id предмета
```js
ItemsUtil.getItemById(id);
```

Заменяет имя предмету
```js
ItemsUtil.overrideName(id, data, name);
```

Заменяет защиту брони
```js
ItemsUtil.overrideArmorValue(id, value);
```

## EntityRegister
Добавляет прослушиватель тика на моба, по текстовому id предмета(minecraft:zombie<>)
```js
EntityRegister.setHandlerTick(name, function(ent){

});
```

## Gui
Проигрывавает анимацию разрушения блока
```js
Gui.animationDestroy(x, y, z, speed);
```

## TickingAreasManager

Проверяет естли область загрузки
```js
TickingAreasManager.hasActiveAreas();
```

Добавляет область загрузки
```js
TickingAreasManager.addArea(dimension, name, x, y, z, range);
```

Добавляет область загрузки
```js
TickingAreasManager.addAreaPostions(dimension, name, x1, y1, z1, x2, y2, z2);
```
Добавляет область загрузки, привязывает её к мобу
```js
TickingAreasManager.addEntityArea(dimension, entity);
```

Возвращает количество областей загрзки
```js
TickingAreasManager.countStandaloneTickingAreas();
```

Возвращает количество областей загрзки в измерении
```js
TickingAreasManager.countPendingAreas(dimension);
```

## FileUtils
Нативный модуль для работы с файлами

```js
FileUtils.deleteDirectory(path);
FileUtils.deleteDirectoryContents(path);
FileUtils.deleteEmptyDirectory(dir);
FileUtils.deleteFile(file);
FileUtils.renameDirectory(old_name, new_name);
FileUtils.renameFile(old_name, new_name);
FileUtils.copyDirectory(from, to); 
FileUtils.fileExists(file);
FileUtils.directoryExists(dir);    
FileUtils.isValidPath(path);
FileUtils.isRelativePath(path);
FileUtils.isExists(path_or_file);
FileUtils.createDirectory(path);
FileUtils.createDirectoryForFile(path);
```

## World

Добавляет мир в список миров
```js
World.addWorldToCache(path);
```

Обновляет список миров
```js
World.updateWorlds();
```

Возвращает список миров
```js
World.getWorldsCount();
```


## Random
* наследован от PointerClass

Генерирует рандомное число
```js
<random>.nextInt(max);
```

## Level
* наследован от PointerClass

Возвращает класс  Random
```js
<level>.getRandom(max);
```

## Options
* наследован от PointerClass

Возвращет тип интерфейса
```js
<options>.getUiProfile();
```

## GuiData
* наследован от PointerClass

Вывводит сообщение Title
```js
<guiData>.setTitle(name);
```
Вывводит сообщение Subtitle
```js
<guiData>.setSubtitle(name);
```
Вывводит сообщение ActionMessage
```js
<guiData>.setActionMessage(name);
```

## ClientInstance
* наследован от PointerClass

Возвращает Options
```js
<ClientInstance>.getOptions();
```
Возвращает GuiData
```js
<ClientInstance>.getGuiData();
```
Воспроизводит анимацию ломания блока
```js
<ClientInstance>.renderDestroyBlock(x, y, z, speed);
```

## GlobalContext
Возвращает ClientInstance
```js
<globalContext>.getClientInstance();
```
Возвращает Level
```js
<globalContext>.getServerLevel();
```
Возвращает Level
```js
<globalContext>.getLevel();
```

## BlockUtils

Возврвщает PointerClass
```js
BlockUtils.getBlockById(id);
```

Возврвщает PointerClass
```js
BlockUtils.getBlockStateForIdData(id, data);
```

# Продвинутые возможности
## Вступление
Каждый метод в майнкрафте имеет свой уникальный индентификатор, символ по нему можно добавлять хуки(прослушиватель) на метод, ну или вызвать метод.<br/>
Где узнать символ метода?<br/>
На телефоне можно в приложении Disassembler<br/>

### Injector
Создан для работы с ванильнными классами

```js
new Injector(pointer);
new Injector(PointerClass);
```

Возвращет класс Offset
```js
<injector>.getOffset();
<injector>.getOffset(offset);
```

Вызывает ванильный метод
```js
<injector>.call(symbol, parametrs, table);
```
Вызывает ванильный метод, и возвразает число
```js
<injector>.getIntResult(symbol, parametrs, table);
```
Вызывает ванильный метод, и возвразает число
```js
<injector>.getFloatResult(symbol, parametrs, table);
```
Вызывает ванильный метод, и возвразает bool
```js
<injector>.getBoolResult(symbol, parametrs, table);
```
Вызывает ванильный метод, и возвразает строку
```js
<injector>.getStringResult(symbol, parametrs, table);
```
Вызывает ванильный метод, и возвразает поинтер на класс
```js
<injector>.getPointerResult(symbol, parametrs, table);
```

Заменяет метод класса на другой
```js
<injector>.replace(table, methot, symbol);
```

Очищает инжектор из памяти
```js
<injector>.free();
```

Устанавливает из какой нативной библиотеки будет вызыватся метод
```js
<injector>.setLib(name);
```

### Вызов статичных методов
Вызов статичных методов происходит также, но необходмо вызывать пустой конструктор
```js
new Injector();
```

### Offset
Класс позволяет получать значения в классе по offset

```js
<offset>.getInt(offset);
<offset>.getPointer(offset);
<offset>.getBool(offset);
<offset>.getString(offset);
<offset>.getFloat(offset);
<offset>.free();
```

### Хуки
+ 1 - создайте в декриктории мода файл hooks.json
+ 2 - напишите туда объект описание хука
+ 3 - добавьте кэлбэк хука(всегда первым параметрам controller, а вторым указатель на хукнутый класс)

Объект описания
```json
{
    "symbol": "...",
    "callback": "CallbackName",
    "args": [],//по умолчанию []
    "lib":"mcpe",//по умолчанию mcpe
    "return":"bool"//по умолчанию void
}
```
+ Возвращемые типы даннх
    + stl::strin
    + void - принимает поинтер на класс
    + int
    + float
    + bool

+ Аргументы типы даннх
    + stl::strin
    + int
    + float
    + ptr
    + BlockPos
    + Vec2
    + Vec3
    + ChunkPos


# Примеры использования
+ Модификаии
    + TimeWand
    + NotBurningMobs
    + Faster Ladder Climbing

Пример Injector, при нажатии на блок будет вызывать его randomTick
```js
function getNativeBlock(region, x, y, z){
    let injector = new Injector(region.getPointer()).setArgsType(["ptr"]);
    let pos = new BlockPos(x, y, z);
    let block = injector.getPointerResult("_ZNK11BlockSource8getBlockERK8BlockPos", [
        Parameter.getPointer(pos)
    ]);
    injector.free();
    pos.free();
    return block;
}
function randomTick(block, x, y, z, region){
    let injector = new Injector(block).setArgsType(["ptr", "ptr", "ptr"]);
    let pos = new BlockPos(x, y, z);
    injector.call("_ZNK5Block10randomTickER11BlockSourceRK8BlockPosR6Random", [
        Parameter.getPointer(region.getPointer()),
        Parameter.getPointer(pos),
        Parameter.getPointer(GlobalContext.getServerLevel().getRandom())
    ]);
    pos.free();
    injector.free();
}
Callback.addCallback("ItemUse", function(pos, item, block, is, player){
    let region = BlockSource.getDefaultForActor(player);
    randomTick(getNativeBlock(region, pos.x, pos.y, pos.z), pos.x, pos.y, pos.z, region);
});
```

Пример Offset, при нажатии на блок создаст экземпляр BlockPos, и получит из класса по оофсету координаты
```js
Callback.addCallback("ItemUse", function(coords, item, block, is, player){
    let pos = new BlockPos(coords.x, coords.y, coords.z);
    let injector = new Injector(pos);
    let offset = injector.getOffset();
    alert(offset.getInt(0)+" "+offset.getInt(4)+" "+offset.getInt(8));
    pos.free();
    injector.free();
});
```

Пример хука
```json
[
    {
        "symbol":"_ZNK9Dimension5isDayEv",
        "callback":"Dimension.isDay",
        "args":[],
        "priority":"pre",
        "return":"bool"
    }
]
```
```js
Callback.addCallback("Dimension.isDay", function(controller, self){
    controller.replace();
    controller.setResult(false);
});
```