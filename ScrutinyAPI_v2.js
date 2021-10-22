/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода, за исключением имеени библиотеки(которое используется для импорта в мод)
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
    группа - https://vk.com/club186544580
*/
LIBRARY({
	name: "ScrutinyAPI",
	version: 2,
	shared: true,
	api: "CoreEngine"
});
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
		this.windows[window].tabs[tab].scrutinys[scrutiny]=obj;
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
				let data = elems[i]
				if((data.type||"text")=="text"){
					elements["elem"+i+books[a]]={type:"text", text:ScrutinyAPI_V2.getStr(data.text||"",data.chars||Math.floor(310 / (data.size / 2)))||"", size: data.size||25, x: start_x, y: y, multiline: true}
					y+=10+((data.size||25)*Math.ceil(data.text.split("").length / (data.chars||Math.floor(310 / (data.size / 2)))))
				}else if((data.type||"")=="slots"||(data.type||"")=="slot"){
					if(data.slots);
						data.items = []
					for(let ii in data.slots){
						data.size = data.slots[ii].size;
						data.items.push(data.slots[ii].item)
					}
					for(let ii in data.items){
						elements["elem"+i+books[a]+ii] = {type:"slot", bitmap:data.bitmap||"_default_slot_empty", x: start_x+((data.size||30)*ii), y: y, size: data.size||30}
						container.setSlot("elem"+i+books[a]+ii, data.items[ii].id || 0, 1, data.items[ii].data || 0);
					}
					y+=data.size||30;
				}
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
					if(ScrutinyAPI_V2.isScrutiny(player, name, tab.name, scrutiny.scrutiny)){
						if(scrutiny.book_post)
							ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_post)
					}else{
						if(scrutiny.book_pre)
							ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_pre)
					}
				},
				onLongClick(){
					alert(scrutiny.name);
				}
			}}
			container.setSlot("scrutiny_"+scrutiny.scrutiny+tab.name, scrutiny.icon.id, 1, scrutiny.icon.data)
			for(let i in scrutiny.lines){
				let _scrutiny = this.windows[name].tabs[tab.name].scrutinys[scrutiny.lines[i]]
				if(!this.isVisual(name,_scrutiny.isVisual,player))
					continue;
				content.drawing.push({type: "line", width: 10, x1: _scrutiny.x+(_scrutiny.size/2), y1: _scrutiny.y+(_scrutiny.size/2), x2: scrutiny.x+(scrutiny.size/2), y2: scrutiny.y+(scrutiny.size/2)})
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
				"close": {type: "close_button", x: 850, y: -25, bitmap: "classic_close_button", scale: 5}
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
					content.elements["tab_title"] = {type: "text", x: 90, y: 0, text: tab.title}
					window.setContent(content)
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
Network.addClientPacket("aw.achievement.give", function(scrutiny){
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
				client.send("aw.achievement.give", ScrutinyAPI_V2.windows[window].tabs[tab].scrutinys[name])
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
EXPORT("AchievementAPI", AchievementAPI);
EXPORT("ScrutinyAPI_V1", ScrutinyAPI);
EXPORT("ScrutinyAPI", ScrutinyAPI_V2);
