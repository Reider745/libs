*ScrutinyAPI

ScrutinyAPI - библиотека для создания квестов/изучения 
Открытый пример Sky block
ScrutinyAPI также используется в моде Ancient Wonders 

**Использование библиотеки 
***P.S будет идти речь про ScrutinyAPI_v2
Базовые функции библиотеки

сделает новое окно
# ScrutinyAPI.register(name, obj)
*Параметры 
  *name - имя окна
  *obj - объект описания окна
    *scale?: 3, 
    *frame?: имя рамки, 
    *default_tab?: имя вкладки по умолчанию,
    *default_bitmap?: имя рамки изучения,
    *default_bitmap_click?: имя изученного изучения 
  
добавит новую вкладку 
# ScrutinyAPI.setTab(window, tab, obj)
*Параметры 
  *window - имя окна
  *tab - имя вкладки
  *obj - объект описания 
    *title?: заголовок окна,
		*id?: местоположение окна,
		*icon: id предмета, иконка вкладки,
		*width?: размер вкладки,
		*height?: размер вкладки,
		*isVisual?: function(){return true};
		
добавить новое изучение 
# ScrutinyAPI.setScrutiny(window, tab, scrutiny, obj)
*Параметры 
  *window - имя окна
  *tab - имя вкладки 
  *scrutiny - имя изучения 
  *obj - объект описания
    *name - имя отображаемое имя
    *icon - {id: id предмета} 
    *cellX - положение в сетке по x
    *cellY - положение в сетки по y
    *size - размер иконки
    *x - положение по x
    *y - положение по y
    *lines - массив имён изучений, будут проведены линии от этих изучений к этому
    *isVisual - массив имён изучений, изучение не будет показываться пока не изучены изучения из массива 
    *bitmap - текстура
    *bitmap_click - текстура, когда изучено 
    *book_post - объект описание книги после изучения 
    *book_pre - объект описание книги до изучения 
    *объект описания книги 
      *left - массив с элементами книги 
      *right - массив с элементами книги 
      *объект описания текста
        *text - текст
        *size
      *объект описание слотов
        *type - "slot"
        *slots - массив с объектами описание слотов
        *объект описание слотов
          *size - размер
          *item - {id: 1, data: 0}

выдать новое изучение, рекомендую использовать модуль ScrutinyAPI_V1
# ScrutinyAPI_V1.giveScrutiny(player, window, tab, name, bool)
# ScrutinyAPI.give(player, window, tab, name, bool)
*Параметры 
  *player - индефикатор игрока
  *window - имя окна
  *tab - имя вкладки
  *name - имя изучения 
  *bool - проверка можетли быть выдано изучение 
  
открыть окно изучений 
# ScrutinyAPI.open(player, name)
*Параметры 
  *player - индефикатор игрока 
  *name - имя окна