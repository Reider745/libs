# libs

### DungeonAPI
Вся документация со стены группы вк, если есть притензии, то это к Илье
* Dungeon.isStructure(name, x, y, z, rotation, dimension);
* DungeonArr.isStructure(x, y, z, rotation, dimension);
* DungeonArr.transferDungeonAPI(false/true);
* DungeonArr.ReadStructure(rotation);
* Dungeon.removeBlockStrusture(file, identifier);
* Dungeon.addBlockStructure(file, identifier);
* Dungeon.setStructure(file, x, y, z);
* Dungeon.generateionIdentifier(obj);
* Dungeon.getStructure(file);
* <структура>.getStructure();
* <структура>.getPrototype();
* Dungeon.setDir(path);
* Dungeon.destroyStructure(file, x, y, z, rotation);
* Dungeon.copy(file, file2, value[true or false]);
* Dungeon.transferStructureAPI(file, file2, value[true or false]);
* Dungeon.transferDungeonAPI(file, file2, value[true or false]);
* Dungeon.ReadStructure(file, x, y, z, rotation);



### сохранение структуры

___ В библиотеку уже встроенны метод сохранения структур

* импортируйте библиотеку IMPORT("DungeonAPI");

* в папке мода создайте папку: structure

* войдите в Horizon

* зайдите в игру и пропишите команду /tool

* отметите 1 и 2 точку(просто нажав по блоку, предметом который вам выдолся)

* установите центр структуры нажав по блоку на шифте(тагже тем предметом)

* пропишите команду /structure write <имя файла>.json на конце должен быть .json

_____ структура сохранена 

** функция для работы со структурами

* для создания нового данжа

var StructureTest = new DungeonAPI("primer.json");

"primer.json" - название файла

* установка другого файла

* <структура>.setPath("Primer2.json");

" Primer2.json" - название файла

* создание протатипа структуры
Внимание!!! Прототип должен быть обязательно! 

<структура>.setPrototype({
    isSetBlock: function (x, y, z, id, data, identification){
        //с помощью этой функции можно настроить установку блока(эта функция обязательна) 
        return true;
    }, 
    setStructure: function (x, y, z, id, data, identification){
        //эта фото выполняется после установки блока(эта функция не обязательна) 
    }
});
Параметры 

* X - координата x где установился блок

* y - координата y где установился блок

* z - координата z где установился блок

* id - id блока который был установлен

* data - data блока который был установлен 

* identification - индификатор блока(у каждого блока он разный, это можно использовать для управления каждым блоком отдельно) состоит из id.data.x.y.z


==>установка структуры

При установке структуры выполняются функции в prototype

<структура>.setStructure(x, y, z);

* x - координата x на котором будет установлена структура

* y - координата x на котором будет установлена структура

* z - координата x на котором будет установлена структура


** ==>установка структуры

При установке структуры не выполняются функции в prototype

<структура>.setStructurePro(x, y, z, {
    isSetBlock: function (x, y, z, id, data, identification){
        //эта функция обязательна
        return true;
    }
});

* x - координата x на котором будет установлена структура

* y - координата x на котором будет установлена структура

* z - координата x на котором будет установлена структура

* func - выглядит тагже как и prototype

* ==>функции для добавления дропа в сундуки

>для создания нового генератора
var testGenerate = new ItemGenerate();

>добавление предмета который будет генерироватся
<генератор>.addItem(id, random, {min: 0, max: 1}, data);
* id - id предмета
* random - шанс появление предмета
* min - минимальное количество предметов(не обязательно)
* max - максимальное количество предметов(не обязательно)
* data - data предмета(не обязательно) 

* >создание протатипа 
<генератор>.setPrototype({
isGenerate: function (slot, x, y, z, id, data, count){
//тагже как и у структуры обязательнный параметр
return true
}, 
* setFunction: function(slot, x, y, z, id, data, count){
//не обязательнный параметр
} 
});
*slot - слот в котором сгенерировался предмет 
* x - координат x где генерируется 
* y - координат y где генерируется 
* z - координат z где генерируется 
* id - id предмета который с генерировался
* data - data предмета который с генерировался
* count - количество предметов которые с генерировались

>заполнения сундука
При генерации выполняется функции в prototype
<генератор>.fillChest(x, y, z);
* x - координат x где генерируется 
* y - координат y где генерируется 
* z - координат z где генерируется

>заполнения сундука
При генерации не выполняется функции в prototype
<генератор>.fillChestPro(x, y, z, func);
* x - координат x где генерируется 
* y - координат y где генерируется 
* z - координат z где генерируется
* func - тоже самое что и прототип 

>получить массив с параметрами генерации предметов 
<генератор>.getItem();
Пример:
var test = testGenerate.getItem();



