# Классы игрока

+ Методы AncientWonders.ClassType
  + addParameter(name, min, max)
    + name - имя нового параметра 
    + min - изначальное значение параметра
    + max - максимальное значение параметра
  + setParameter(name, value)
    + name - имя нового параметра 
    + value - значение параметра 
  + getParameter

Возвращает ClassType
**AncientWonders.getClassTypeByName(name)**
+ Параметры 
  + name - имя класса

Добавляет параметр всем классам
**AncientWonders.addAllClassParameter(name, min, max)**
+ Параметры
  + name - имя параметра
  + min - изначальное значение параметра
  + nax - максимальное значение параметра

Проверят значения параметров игрока 
**AncientWonders.isParameters(player, obj, bonus)**
+ Параметры 
  + player - индефикатор игрока
  + obj - параметр: значение 
  + bonus - параметр: значение 

Отправляет сообщение в чат о требованиях к параме
**AncientWonders.message(player, obj, bonus, message)**
+ Параметры 
  + player - индефикатор игрока
  + obj - параметр: значение 
  + bonus - параметр: значение 
  + message(player, obj, bonus, parameter){} - метод должен возвращать сообщение 

Устанавливае игроку класс
**AncientWonders.setPlayerClass(player, name)**
+ Параметры
  + player - индефикатор игрока
  + name - имя класса

## Примеры

Если у игрока 10 магия и 15 защита, то отправляем сообщение в чат
```js
ModAPI.addAPICallback("AncientWonders", function(api){
  Callback.addCallback("ItemUse", function(coords, item, block, is, player){
    if(api.AncientWonders.isParameters(player, {
      magic: 10,
      protection: 15
    }, {}))
      Game.message("yes");
  });
});
```

Создание класса
```js
ModAPI.addAPICallback("AncientWonders", function(api){
  //недостающие параметры будут скопированы из класса magic 
  new api.AncientWonders.ClassType("druid", "magic")
  	.addParameter("protection", 0, 40)
  	.addParameter("necromancer", 0, 10)
  	.addParameter("aspects", 0, 100000)
  	.setParameter("aspectsNow", 5000);
});
```

Изменение класс
```js
ModAPI.addAPICallback("AncientWonders", function(api){
  new api.AncientWonders.ClassType("warrior")
	  .addParameter("magic", 0, 180);
});
```

Добавление нового параметра 
```js
ModAPI.addAPICallback("AncientWonders", function(api){
  api.AncientWonders.addAllClassParameter("druid", 0, 100);
});
```