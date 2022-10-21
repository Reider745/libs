### Создание квестов FtbQuests
+ Основные классы
    + UiMainBuilder - отвечает за интерфейс в целом
    + StandartTabElement - отвечает за вкладки и за их функционал
    + TabCloseElement - вкладка, при нажатии на которую происходит выход из интерфейса
    + Quest - отвечает за квест и его функционал
    + RecipeCheck - отвечает за отслеживания крафтов
    + DestroyBlocks - отвечает за отслеживания разрушения блоков
    + AchievementAPI - отвечает за анимацию выдачи квестов
    + GiveItems - отвечает за выдачу предметов за квест

## UiMainBuilder
Создаёт экземпляр UiMainBuilder
```js
new UiMainBuilder(clinet_name: string)
```

Возвращает класс вкладки
```js
<UiMainBuilder>.getTab(isLeft: boolean, tab: string): StandartTabElement
```

Возвращает класс квеста
```js
<UiMainBuilder>.getQuest(isLeft: boolean, tab: string, quest: string): Quest
```

Выдаёт квест, без анимации
```js
<UiMainBuilder>.giveQuest(isLeft: boolean, tab: string, quest: string, player: number = Player.get(), value: boolean = true, is: boolean = true): boolean
```

Выдаёт квест, с анимацией
```js
<UiMainBuilder>.give(isLeft: boolean, tab: string, quest: string, player: number = Player.get(), value: boolean = true, is: boolean = true): void
```

Проверяет выданли квест
```js
<UiMainBuilder>.canQuest(isLeft: boolean, tab: string, quest: string, player: number = Player.get()): boolean
```

Привязывает открытие окна к определённому предмету
```js
<UiMainBuilder>.registerItem(id: number | string): UiMainBuilder
```

Заставляет сохранять статусы квестов
```js
<UiMainBuilder>.registerSave(): UiMainBuilder
```

Добавляет вкладку
```js
<UiMainBuilder>.addRenderLeft(element: StandartTabElement)
<UiMainBuilder>.addRenderRight(element: StandartTabElement)
```

## StandartTabElement

Создаст экземпляр класса
```js
new StandartTabElement(id: string)
```

Вернёт список id квестов
```js
<StandartTabElement>.getAllQuest(): string[]
```

Добавит квест во вкладку
```js
<StandartTabElement>.addQuest(quest: Quest): StandartTabElement
```

Вернёт квест по id
```js
<StandartTabElement>.getQuest(id: string): Quest 
```

Скопирует квесты одной вкладки в другую
```js
<StandartTabElement>.copyQuests(tab: StandartTabElement): StandartTabElement
```


Вернёт id вкладки
```js
<StandartTabElement>.getId(): string
```

Вернёт отображаемое ия вкладки
```js
<StandartTabElement>.getDisplayName(): string
```

Установит отображаемое имя вкладки
```js
<StandartTabElement>.setDisplayName(name: string): StandartTabElement
```

Вернёт иконку вкладки
```js
<StandartTabElement>.getItem(): ItemInstance
```

Установит иконку вкладки
```js
<StandartTabElement>.setItem(item: ItemInstance): StandartTabElement
```

## Quest

Создаст экземпляр класса
```js
new Quest({
    id: string,
    x: number,
    y: number,
    size?: number,
    item?: ItemInstance,
    texture?: string,
    texturePost?: string,
    lines?: string[]
})
```

Вернёт id квеста
```js
<Quest>.getId(): string 
```

```js
<Quest>.getX(): number
```

```js
<Quest>.getY(): number
```

Установит диалог для квеста
```js
<Quest>.setDialog(dialog: UiDialogBase): Quest
```

## TabCloseElement

Создаст экземпляр класса, этот класс отвечает за кнопку выхода
```js
new TabCloseElement(id);
```

## GiveItems
Регистрирует выдачу предметов за квест
```js
GiveItems.registerGive(main: UiMainBuilder, isLeft: boolean, tab: string, quest: string, items: ItemInstance[])
```

## DestroyBlocks
```js
DestroyBlocks.registerDestroyBlocks(ui: UiMainBuilder, blocks: string[], isLeft: boolean, tab: string, quest: string, title?: string, description?: string): void
```

## RecipeCheck
```js
RecipeCheck.registerRecipeCheck(ui: UiMainBuilder, items: number[], isLeft: boolean, tab: string, quest: string, title?: string, description?: string): void
```

## UiDialogBase

Создаст экземпляр класса
```js
new UiDialogBase(message: string, x: number = 0, y: number = 0);
```

```js
<UiDialogBase>.openCenter();
```

```js
<UiDialogBase>.setCanExit(status: boolean);
```

## UiDialog

```js
interface Item {
    item: ItemInstance;
    dialog?: UiDialogBase;
}
```

Создаст экземпляр класса
```js
new UiDialog(message: string, description: string = "", x: number = 0, y: number = 0);
```

```js
<UiDialogBase>.openCenter();
```

```js
<UiDialogBase>.setCanExit(status: boolean);
```

```js
<UiDialogBase>.setInput(items: Item[]);
```

```js
<UiDialogBase>.setResult(status: Item[]);
```

```js
<UiDialogBase>.setInventoryCheck(inventontory_check: boolean)
```

### GroupTabElement

Создаст экземпляр класса
```js
new GroupTabElement(id);
```

```js
<GroupTabElement>.addTab(tab: StandartTabElement): GroupTabElement
```