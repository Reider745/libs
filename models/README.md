# RenderUtil
RenderUtil - библиотека для создания моделей.
Для создания модели через Block bench установите плагин inner-core-model, на ходится в репозитории 

создайте проект, конвертируете его в Inner Core Model, в разделе фильтр будет кнопка сохранения модели.

## Методы RenderUtil
**new RenderUtil.Model()**
+ Создаёт объект
  + **addBoxByBlock(name, x1, y1, z1, x2, y2, z2, id, data)**
    + добавляет новый бокс
    + name - имя бокса
    + x, y, z - координаты 
    + id, data - текстура бокса
  + **getBoxes()**
    + получить боксы
  + **setBoxes(boxes)**
    + установить боксы моделе
  + **getAllName()**
    + получить все имена боксов
  + **getBlockRender()**
    + получить модель как BlockRenderer
  + **getCollisionShape()**
    + получить модель как CollisionShape
  + **getICRenderModel()**
    + получить модель как ICRender.Model
  + **getRenderMesh()**
    + получить модель как RenderMesh
  + **copy()**
    + возвращает копию модели
  + **setBlockModel(id, data)**
    + устанавливает модель блоку
    + id - id блока
    + data - data блока

**new RenderUtil.Animation(model, obj)**
+ Параметры
  + model - RenderUtil.Model, изначальная модель 
  + obj - объект [кадр]: модель
  + создаёт объект 
    + **setTime(time)**
      + установить время проигрования анимации(в тиках)
    + **setAnimation(obj)**
      + obj - объект [кадр]: модель
    + **updateModel(x, y, z)**
      + обновляет модель на координатах 
    + **play(x, y, z)**
      + проигрывает анимацию 

## Пример
создание модели
```js
let model = new RenderAPI.Model().addBoxByBlock(null, 0, 0, 0, .5, .5, .5);
```

включаем изменение модели на кординатах для блока
```js
BlockRenderer.enableCoordMapping(98, -1, model.getICRenderModel());
```
создаём простую анимацию
```js
let animation = new RenderAPI.Animation(model, {
	"25": new RenderAPI.Model().addBoxByBlock(null, 0, 0, .5, .5, .5, 1),
	"50": new RenderAPI.Model().addBoxByBlock(null, .5, 0, .5, 1, .5, 1),
	"75": new RenderAPI.Model().addBoxByBlock(null, .5, 0, 0, 1, .5, .5),
	"100": new RenderAPI.Model().addBoxByBlock(null, 0, 0, 0, .5, .5, .5)
});
```
устанавливаем время воспроизведения анимации 
```js
animation.setTime(100);
```
проигроваем анимацию, при клики на блок
```js
Callback.addCallback("ItemUse", function(coords){
	animation.play(coords.x,coords.y,coords.z);
});
```