LIBRARY({
  name: "ScrutinyAPI",
  version: 3,
  shared: true,
  api: "CoreEngine"
});
/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода, за исключением имеени библиотеки(которое используется для импорта в мод)
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
    группа - https://vk.com/club186544580
*/
Saver.addSavesScope("Save.lib.ScrutinyAPI",
    function read(scope) {
        if(ScrutinyAPI.save) ScrutinyAPI_V2.scrutiny = scope.save || {};
    },
    function save() {
        return {
            save: ScrutinyAPI_V2.scrutiny,
        };
    }
);
let setTimeout = function(func, ticks, obj) {
  obj = obj || {}
  var upd = {
    ticks: 0,
    update: function() {
      this.ticks++
      if (this.ticks >= ticks) {
        func(obj);
        this.remove = true
      }
    }
  };
  Updatable.addUpdatable(upd);
}
let TranslationLoad = {
  create(key) {
    return {
      text: Translation.translate(key),
      set(name, value) {
        this.text = this.text.replace("{" + name + "}", value)
      },
      get() {
        return this.text;
      }
    }
  },
  get(key, arr) {
    let str = this.create(key);
    for (let i in arr)
      str.set(arr[i][0], arr[i][1]);
    return str.get();
  },
};

Callback.addCallback("LevelLeft", function () {
	ScrutinyAPI_V2.scrutiny = {};
});
Network.addClientPacket("SC.API.open", function(packetData) {
	ScrutinyAPI_V2.open(packetData.player, packetData.name, packetData.id)
});
Network.addClientPacket("SC.API.give", function(packetData) {
	if(packetData.server != Player.get())
		ScrutinyAPI_V2.scrutiny = packetData.value;
});
let sh = UI.getScreenHeight();
let ScrutinyWindow = {
	left: sh * 0.3,
	right: sh * 0.3,
	top: sh * 0.05,
	bottom: sh * 0.1,
	size_y: sh - (this.top + this.bottom),
	height: 540
};
let ScrutinyAPI_V2 = {
	windows: {},
	scrutiny: {},
	players: {},
	register(name, obj){
		obj = obj || {};
		this.windows[name] = {
			tabs:{},
			scale: obj.scale||3,
			frame: obj.frame||"default_frame_bg_dark",
			default_tab: obj.default_tab||"",
			default_bitmap: obj.default_bitmap||"classic_frame_bg_light_border",
			default_bitmap_click:obj.default_bitmap_click||"workbench_frame3"
		};
	},
	setTab(window, tab, obj){
		obj.title = obj.title || "",
		obj.id = obj.id || 0;
		obj.icon = obj.icon || 0;
		obj.width = obj.width || 0;
		obj.height = obj.height || 0;
		obj.isVisual = obj.isVisual||function(){return true};
		obj.scrutinys = {};
		obj.name=tab;
		if(!this.windows[window])
			this.register(window)
		this.windows[window].tabs[tab]=obj;
	},
	setScrutiny(window, tab, scrutiny, obj){
		obj=obj||{};
		obj.name=obj.name||scrutiny;
		obj.scrutiny=scrutiny;
		obj.size=obj.size||100;
		obj.cellX=obj.cellX||0;
		obj.cellY=obj.cellY||0;
		obj.x=obj.x||((obj.size+10)*obj.cellX)-obj.size+10;
		obj.y=obj.y||((obj.size+10)*obj.cellY)-obj.size+10;
		obj.icon=obj.icon||{};
		obj.icon.id=obj.icon.id||0;
		obj.icon.data=obj.icon.data||0;
		obj.lines=obj.lines||[];
		obj.isVisual=obj.isVisual||[];
		obj.isDone=obj.isDone||[];
		obj.bitmap=obj.bitmap||this.windows[window].default_bitmap;
		obj.bitmap_click=obj.bitmap_click||this.windows[window].default_bitmap_click;
		if(this.windows[window].tabs[tab].auto_size){
			if(this.windows[window].tabs[tab].height < obj.y / 2 + obj.size + 20)
				this.windows[window].tabs[tab].height = obj.y / 2 + obj.size + 20;
			
			if(this.windows[window].tabs[tab].width < obj.x / 2 + obj.size + 20)
				this.windows[window].tabs[tab].width = obj.x / 2 + obj.size + 20;
		}
		this.windows[window].tabs[tab].scrutinys[scrutiny]=obj;
		Callback.invokeCallback("AddScrutiny", window, tab, scrutiny);
	},
	isScrutiny(player, window, tab, name){
		if(!this.scrutiny[window])
			this.scrutiny[window] = {};
		if(!this.scrutiny[window][tab])
			this.scrutiny[window][tab] = {
				player: {}
			};
		if(!this.scrutiny[window][tab].player[player])
			this.scrutiny[window][tab].player[player] = {};
		return this.scrutiny[window][tab].player[player][name];
	},
	isVisual(window_name, arr, player){
		let tab = this.windows[window_name].tabs;
		for(let i in arr){
			if(!!!tab[arr[i][0]].scrutinys[arr[i][1]].full_check)
				for(let ii in tab[arr[i][0]].scrutinys[arr[i][1]].lines){
					let scrutiny_name = tab[arr[i][0]].scrutinys[arr[i][1]].lines[ii];
					if(!this.isScrutiny(player, window_name, arr[i][0], scrutiny_name) && this.isVisual(window_name, tab[arr[i][0]].scrutinys[scrutiny_name].isVisual, player))
						return false;
				}
			if(!!!tab[arr[i][0]].scrutinys[arr[i][1]].full_check)
				for(let ii in tab[arr[i][0]].scrutinys[arr[i][1]].isVisual){
					let scrutiny_name = tab[arr[i][0]].scrutinys[arr[i][1]].isVisual[ii][1];
					let tab_name = tab[arr[i][0]].scrutinys[arr[i][1]].isVisual[ii][0];
					if(!this.isScrutiny(player, window_name, tab_name, scrutiny_name) && !this.isVisual(window_name, tab[tab_name].scrutinys[scrutiny_name].isVisual, player))
						return false;
				}
			if(!this.isScrutiny(player, window_name, arr[i][0], arr[i][1]) && this.isVisual(window_name, tab[arr[i][0]].scrutinys[arr[i][1]].isVisual, player))
				return false;
		}
		return true;
	},
	give(player, window, tab, name, bool){
		bool = bool || false;
		if(!this.scrutiny[window]){
			this.scrutiny[window] = {};
		}
		if(!this.scrutiny[window][tab]){
			this.scrutiny[window][tab] = {
				player: {}
			};
		}
		if(!this.scrutiny[window][tab].player[player]){
			this.scrutiny[window][tab].player[player] = {};
		}
		let arr = this.windows[window].tabs[tab].scrutinys[name].isDone;
		if(bool){
			if(this.isScrutiny(player, window, tab, name))
				return false;
			for(let i in arr){
				if(!(this.isScrutiny(player, window, arr[i][0], arr[i][1])&&this.isVisual(window, this.windows[window].tabs[arr[i][0]].scrutinys[arr[i][1]].isVisual, player)))
					return false;
			}
		}
		this.scrutiny[window][tab].player[player][name] = true;
		Callback.invokeCallback("Scrutiny_give", window, tab, name, player);
		Network.sendToAllClients("SC.API.give", {
			value: ScrutinyAPI_V2.scrutiny,
			server: parseInt(""+Player.get())
		});
		return true;
	},
	getStr(str, count){
		let chars = str.split("");
		let a = 1;
		for(let i in chars){
			if(i >= count * a){
				a++
				let arr = chars.splice(i, chars.length-1);
				chars.push("\n");
				for(let l in arr)
					chars.push(arr[l]);
			}
		}
		let string = "";
		for(let i in chars)
			string+=chars[i];
		return string;
	},
	elements: {},
	registerDrawingElement(name, func){
		this.elements[name] = func;
	},
	useDrawingElement(name, obj, x, y, container, i, pos){
		return this.elements[name](obj, x, y, container, i, pos);
	},
	getGuiBook(name, player, content, group, container, id, obj){
		let elements = {
			"close": {type: "button", x: 900, y: 0, bitmap: "classic_close_button", scale: 5, clicker: {
				onClick(){
					ScrutinyAPI_V2.open(player, name, id)
				}
			}}
		}
		let books = Object.keys(obj);
		let y_max = 380;
		for(let a in books){
			let start_x = {left: 35, right: 550}[books[a]]
			let elems = obj[books[a]]
			let y = 25;
			for(let i in elems){
				let data = elems[i];
				let obj = ScrutinyAPI_V2.useDrawingElement(data.type||"text", data, start_x, y, container, i, books[a]);
				y+=obj.y;
				for(let ii in obj.elem)
					elements["elem"+i+books[a]+ii] = obj.elem[ii];
			}
			if(y_max < y)
				y_max = y;
		}
		group.addWindowInstance("book", new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom-10,
					top: ScrutinyWindow.top-10,
					right: ScrutinyWindow.right-10,
					left: ScrutinyWindow.left-10
				},
				//scrollY: y_max,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)},
				{type: "bitmap", bitmap: "book_background", within: 1000, height: y_max},
			],
			elements: elements
		}))
	},
	client_open_tab: "",
	updateIcon(obj){
		if(ScrutinyAPI_V2.client_open_tab == obj.tab.name){
			obj.i++;
			if(obj.i >= obj.icon.ids.length)
				obj.i = 0;
			obj.container.setSlot(obj.name_slot, obj.icon.ids[obj.i][0], 1, obj.icon.ids[obj.i][1]);
			setTimeout(ScrutinyAPI_V2.updateIcon, obj.icon.time||10, obj);
		}
	},
	getGuiTab(name, player, content, tab, group, container){
		content.elements = {};
		content.drawing = [
			{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
		];
		let scrutinys = Object.keys(tab.scrutinys);
		for(let i in scrutinys){
			let scrutiny = tab.scrutinys[scrutinys[i]];
			if(!this.isVisual(name,scrutiny.isVisual,player))
				continue;
			content.elements["scrutiny_"+scrutiny.scrutiny+tab.name] = {type: "slot", x: scrutiny.x, y: scrutiny.y, visual: true, bitmap: this.isScrutiny(player, name, tab.name, scrutiny.scrutiny) ? scrutiny.bitmap_click : scrutiny.bitmap, size: scrutiny.size, clicker: {
				onClick(){
					if(ScrutinyAPI_V2.isScrutiny(player, name, tab.name, scrutiny.scrutiny) && scrutiny.book_post){
						ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_post)
					}else if(scrutiny.book_pre){
						ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_pre)
					}
				},
				onLongClick(){
					alert(Translation.translate(scrutiny.name));
				}
			}}
			let icon = scrutiny.icon;
			let name_slot = "scrutiny_"+scrutiny.scrutiny+tab.name;
			if(icon.ids){
				container.setSlot(name_slot, icon.ids[0][0], 1, icon.ids[0][1]);
				let i = 0;
				setTimeout(ScrutinyAPI_V2.updateIcon, icon.time||10, {
					tab: tab,
					icon: icon,
					name_slot: name_slot,
					i: i,
					container: container
				});
			}else
				container.setSlot(name_slot, icon.id, 1, icon.data);
			for(let i in scrutiny.lines){
				let _scrutiny = this.windows[name].tabs[tab.name].scrutinys[scrutiny.lines[i]]
				if(!this.isVisual(name,_scrutiny.isVisual,player))
					continue;
				content.drawing.push({type: "line", width: 10, x1: _scrutiny.x+(_scrutiny.size/2), y1: _scrutiny.y+(_scrutiny.size/2), x2: scrutiny.x+(scrutiny.size/2), y2: scrutiny.y+(scrutiny.size/2), color: scrutiny.line_color || android.graphics.Color.rgb(0, 0, 0)})
			}
		}
		return content;
	},
	getGuiClient(window_name, player, container, id){
		let group = new UI.WindowGroup();
		let window = new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom,
					top: ScrutinyWindow.top,
					right: ScrutinyWindow.right,
					left: ScrutinyWindow.left
				}
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
			],
			elements: {
				"close": {type: "close_button", x: 850, y: -25, bitmap: ScrutinyAPI_V2.windows[window_name].close_bitmap||"classic_close_button", scale: 5}
			}
		});
		let tabs = Object.keys(this.windows[window_name].tabs);
		let window_tab = new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom+20,
					top: ScrutinyWindow.top+30,
					right: ScrutinyWindow.right+70,
					left: ScrutinyWindow.left+70
				},
				scrollY: 100,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
			],
			elements: {
			}
		});
		let content = window.getContent();
		let index = content.drawing.length;
		content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 75, y: -2, z: -1, scale: this.windows[window_name].scale, width: 0, height: 50});
		//content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 855, y: -2, z: -1, scale: this.windows[window_name].scale, width: 60, height: 50});
		for(let i in tabs){
			let tab = this.windows[window_name].tabs[tabs[i]];
			if(!tab.isVisual(player, window_name))
				continue;
			let clicker = {
				onClick(){
					let content = window.getContent();
					window_tab.getLocation().setScroll(tab.width, tab.height);
					window_tab.updateScrollDimensions();
					window_tab.setContent(ScrutinyAPI_V2.getGuiTab(window_name, player, window_tab.getContent(), tab, group, container))
					content.drawing[index].width = (tab.title.split("").length*15)+25;
					content.elements["tab_title"] = {type: "text", x: 90, y: 8, text: Translation.translate(tab.title), font: {color: tab.title_color || android.graphics.Color.rgb(1, 1, 1)}}
					window.setContent(content);
					ScrutinyAPI_V2.client_open_tab = tab.name;
				}
			}
			if(this.windows[window_name].default_tab == tabs[i] || id == tabs[i])
				clicker.onClick();
			if(tab.id < 6){
				content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 0, y: 30+(tab.id*(ScrutinyWindow.height/6)), scale: this.windows[window_name].scale, width: Math.floor(ScrutinyWindow.height/6), height: Math.floor(ScrutinyWindow.height/6)})
				content.elements["tab_"+tabs[i]]={type: "slot", x: 0, y: 30+(tab.id*(ScrutinyWindow.height/6)), bitmap:"_default_slot_empty",size:90,visual: true, clicker: clicker};
			}else{
				content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 910, y: 30+(tab.id*(ScrutinyWindow.height/6))-ScrutinyWindow.height, scale: this.windows[window_name].scale, width: Math.floor(ScrutinyWindow.height/6), height: Math.floor(ScrutinyWindow.height/6)})
				content.elements["tab_"+tabs[i]]={type: "slot", x: 910, y: 30+(tab.id*(ScrutinyWindow.height/6))-ScrutinyWindow.height, bitmap:"_default_slot_empty",size:90,visual: true, clicker: clicker};
			}
			container.setSlot("tab_"+tabs[i], tab.icon, 1, 0)
		}
		content.drawing.push({type: "frame", x: 80, y: 30, width: 840, height: ScrutinyWindow.height, bitmap: this.windows[window_name].frame, scale: this.windows[window_name].scale})
		window.setContent(content);
		group.addWindowInstance("bitmap", window);
		group.addWindowInstance("tab", window_tab);
		group.addWindowInstance("book", new UI.Window({
			location: {
				padding: {
					bottom:10000,
					top:1000,
					right:1000,
					left:1000
				},
				scrollY: 100,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)},
				{type: "bitmap", bitmap: "book_background", within: 1000, height: 500},
			],
			elements: {
				"close": {type: "button", x: 900, y: 0, bitmap: "classic_close_button", scale: 5, clicker: {
					onClick(position, container, tileEntity, window){
						window.getLocation().setPadding(10000, 10000, 10000, 10000)
						group.getWindow("book").updateWindowPositionAndSize();
					}
				}},
			}
		}))
		return group;
	},
	getContainer(player){
		if(!this.players[player])
			this.players[player] = new UI.Container();
		return this.players[player];
	},
	open(player, name, id){
		let container = this.getContainer(player);
		container.openAs(this.getGuiClient(name, player, container, id))
	},
	openServer(player, name, id){
		let client = Network.getClientForPlayer(player)
		if(client)
			client.send("SC.API.open", {name:name,player:player,id:id})
	}
};
ScrutinyAPI_V2.registerDrawingElement("text", function(obj, x, y){
	let text = Translation.translate(obj.text||"");
	return {
		y: 10+((obj.size||25)*Math.ceil(text.split("").length / (obj.chars||Math.floor(310 / (obj.size / 2))))),
		elem: [{type:"text", text: ScrutinyAPI_V2.getStr(text, obj.chars || Math.floor(310 / (obj.size / 2)))||"", size: obj.size||25, x: x, y: y, multiline: true}]
	};
});
ScrutinyAPI_V2.registerDrawingElement("slots", function(obj, x, y, container, i, pos){
	let slots = []
	if(obj.slots)
		obj.items = [];
	for(let ii in obj.slots){
		obj.size = obj.slots[ii].size;
		obj.items.push(obj.slots[ii].item)
	}
	for(let ii in obj.items){
		slots.push({type: "slot", bitmap: obj.bitmap||"_default_slot_empty", x: x+((obj.size||30)*ii), y: y, size: obj.size||30, visual: true});
		container.setSlot("elem"+i+pos+((parseInt(ii)||0)+(obj.i||0)), obj.items[ii].id || 0, 1, obj.items[ii].data || 0);
	}
	return {
		y: obj.size||30,
		elem: slots
	};
});
ScrutinyAPI_V2.registerDrawingElement("slot", function(obj, x, y, container, i, pos){
	return ScrutinyAPI_V2.useDrawingElement("slots", obj, x, y, container, i, pos);
});
ScrutinyAPI_V2.registerDrawingElement("custom", function(obj, x, y, container, i, pos){
	return obj.getElemet(x, y, container, i, pos);
});
ScrutinyAPI_V2.registerDrawingElement("dynamic", function(obj, x, y, container, i, pos){
	let elems = [];
	let max = 0;
	let arr = obj.getElemet(x, y, container, i, pos);
	for(let ii in arr){
		obj.i = elems.length;
		let data = ScrutinyAPI_V2.useDrawingElement(arr[ii].type||"text", arr[ii], x, y+max, container, i, pos);
		max += data.y;
		for(let a in data.elem)
			elems.push(data.elem[a]);
	}
	return {
		y: max,
		elem: elems
	};
});

var JAVA_ANIMATOR = android.animation.ValueAnimator;
var JAVA_HANDLER = android.os.Handler;
var LOOPER_THREAD = android.os.Looper;
var JAVA_HANDLER_THREAD = new JAVA_HANDLER(LOOPER_THREAD.getMainLooper());

function createAnimation(_duration, _updateFunc){
	let animation = JAVA_ANIMATOR.ofFloat([0,1]);
	animation.setDuration(_duration);
	if(_updateFunc)
		animation.addUpdateListener({
			onAnimationUpdate(updatedAnim){
				_updateFunc(updatedAnim.getAnimatedValue(), updatedAnim);
			}
		});
	JAVA_HANDLER_THREAD.post({
		run(){
			animation.start();
		}
	})
	return animation;
}
function AchievementAPI(){
	let container = new UI.Container();
	let window = new UI.Window({
		location: {
			x: 650,
			width: 350,
			y: 0,
			height: 150
		},
		drawing: [{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}],
		elements: {}
	});
	window.setDynamic(true);
	window.setAsGameOverlay(true);
	window.setTouchable(false);
	
	
	let time = 1000;
	let y_max = 15;
	let y_default = 0;
	let expectation = 60;
	
	this.setTime = function(time, expectation){
		this.time = time;
		this.expectation = expectation;
	}
	this.getGui = function(title, description, item){
		item = item || {};
		y_default = -600;
		let content = window.getContent();
		content.elements.background = {type: "image", bitmap: "achievement_background", x: 0, y:y_default, scale: 1.5}
		content.elements.slot = {type: "slot", bitmap: "_default_slot_empty", x: 13, y: y_default-5, size: 160};
		content.elements.title = {type: "text", text: title, x: 170, y: y_default+45, font: {color: android.graphics.Color.argb(1, 1, 1, 1), size: 55}}
		content.elements.description = {type: "text", text: description, x: 20, y: y_default+250, font: {color: android.graphics.Color.argb(1, 0, 1, 0), size: 50}}
		container.setSlot("slot", item.id||0, 1, item.data||0)
	}
	this.give = function(title, description, item){
		try{
		let content = window.getContent();
		this.getGui(title, description, item);
		container.openAs(window);
		let animation = createAnimation(time, function(value){
			content.elements.background.y = y_default+((y_max-y_default) * value);
			content.elements.title.y = (y_default+((y_max-y_default) * value))+20;
			content.elements.slot.y = (y_default+((y_max-y_default) * value));
			content.elements.description.y = (y_default+((y_max-y_default) * value))+170;
			window.forceRefresh();
		});
		animation.addListener({
			onAnimationEnd(){
				setTimeout(function(){
					let anim = createAnimation(time, function(value){
						let keys = Object.keys(content.elements);
						for(let i in keys)
							content.elements.background.y = y_default+((y_max-y_default) * (1-value));
							content.elements.title.y = (y_default+((y_max-y_default) * (1-value)))+20;
							content.elements.slot.y = (y_default+((y_max-y_default) * (1-value)));
							content.elements.description.y = (y_default+((y_max-y_default) * (1-value)))+170;
						window.forceRefresh();
					});
					animation.addListener({
						onAnimationEnd(){
							container.close();
						}
					});
				}, expectation);
			}
		});
		}catch(e){
			
		}
	}
}
let Achievement = new AchievementAPI();
Network.addClientPacket("aw.achievement.give", function(data){
  let scrutiny = ScrutinyAPI_V2.windows[data.window].tabs[data.tab].scrutinys[data.name];
	Achievement.give(scrutiny.name, TranslationLoad.get("aw.message.scrutiny", [["name", scrutiny.name]]), scrutiny.icon)
});
let ScrutinyAPI = {
	save: true,
	register(name, obj){
		ScrutinyAPI_V2.register(name, obj);
	},
	addTab(window, name, obj){
		ScrutinyAPI_V2.setTab(window, name, obj);
	},
	isScrutiny(player, window, tab, name){
		return ScrutinyAPI_V2.isScrutiny(player, window, tab, name)
	},
	giveScrutiny(player, window, tab, name, bool){
		let value = ScrutinyAPI_V2.give(player, window, tab, name, bool);
		if(value){
			let client = Network.getClientForPlayer(player);
			if(client)
				client.send("aw.achievement.give",  {
				   window: window,
				   tab: tab,
				   name: name
				 })
		}
		return value;
	},
	addScrutiny(window, tab, name, obj){
		ScrutinyAPI_V2.setScrutiny(window, tab, name, {
			name: obj.name,
			x: obj.x,
			y: obj.y,
			cellX: obj.cellX,
			cellY: obj.cellY,
			size: obj.size,
			icon: obj.item,
			lines: obj.line,
			line_color: obj.line_color,
			isDone: (function(arr2){
				let arr = [];
				for(let i in arr2){
					if(typeof(arr2[i])=="string")
						arr.push([tab, arr2[i]]);
					else
						arr.push([arr2[i].tab, arr2[i].name]);
				}
				return arr;
			})(obj.isDone || obj.isVisual),
			isVisual: (function(arr2){
				let arr = [];
				for(let i in arr2){
					if(typeof(arr2[i])=="string")
						arr.push([tab, arr2[i]]);
					else
						arr.push([arr2[i].tab, arr2[i].name]);
				}
				return arr;
			})(obj.isVisual),
			book_post: obj.bookPost,
			book_pre: obj.bookPre
		})
	},
	open(player, name){
		ScrutinyAPI_V2.open(player, name)
	}
};

/*ScrutinyAPI_V2.register("test", {
	scale: 2.5,
	default_tab: "test0",
	frame: "frame"
});
ScrutinyAPI_V2.setTab("test", "test0", {
	id: 0,
	width: 700,
	title: "test 0",
	icon: 1
})
ScrutinyAPI_V2.setTab("test", "test2", {
	id: 2,
	width: 700,
	title: "test 2",
	icon: 5,
	isVisual(player, window_name){
		return ScrutinyAPI_V2.isScrutiny(player, window_name, "test0", "test");
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test2", "test", {
	name: "test scrutiny",
	size: 100,
	x: 100,
	y: 100,
	icon: {
		id: 5,
		data: 1
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test", {
	name: "test scrutiny",
	size: 100,
	x: 100,
	y: 100,
	icon: {
		id: 265
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test2", {
	name: "test scrutiny",
	size: 100,
	x: 300,
	y: 100,
	icon: {
		id: 263
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test3", {
	name: "test scrutiny",
	size: 100,
	x: 150,
	y: 300,
	lines: ["test", "test2"],
	isDone: [["test0", "test2"], ["test0", "test"]],
	isVisual: [["test0", "test2"]],
	icon: {
		id: 264
	},
	book_pre: {
		left: [
			{type: "text", text: "Жопа", size: 40}
		],
		right: [
			{type: "text", text: "Жопа 2", size: 40},
			{type: "slots", items: [{id:263},{id:264}], size: 40}
		]
	},
	book_post: {
		left: [
			{type: "text", text: "Уже не жопа", size: 30},
			{type: "text", text: "Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст.", size: 25},
			{type: "text", text: "Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст.", size: 25},
			{type: "text", text: "тест", size: 30},
			{type: "slots", items: [{id:263},{id:264}]}
		],
		right: [
			{type: "text", text: "уже не жопа 2", size: 30}
		]
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test4", {
	name: "test scrutiny",
	size: 100,
	x: 350,
	y: 300,
	lines: ["test3"],
	isDone: [["test0", "test3"]],
	icon: {
		id: 264
	}
})
Callback.addCallback("ItemUse", function(coords,item,block,isExter,player){
	if(item.id==264){
		ScrutinyAPI_V2.open(player, "test");
	}else if(item.id == 263){
		ScrutinyAPI_V2.give(player, "test", "test0", "test3")
		ScrutinyAPI_V2.give(player, "test", "test0", "test")
		ScrutinyAPI_V2.give(player, "test", "test0", "test2")
	}
});*/
EXPORT("AchievementAPI", AchievementAPI);
EXPORT("ScrutinyAPI_V1", ScrutinyAPI);
EXPORT("ScrutinyAPI", ScrutinyAPI_V2);
