LIBRARY({
	name: "BookHelper",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

let copys = ["number", "string", "boolean", "function"];
function copyArrayLegacy(obj){
	let result = [];
	for(let key in obj){
		let element = obj[key];
		if(copys.indexOf(typeof element) != -1)
			result[key] = element;
		else if(Array.isArray(element))
			result[key] = copyArrayLegacy(element);
		else
			result[key] = copyObjectLegacy(element);
	}
	return result;
}
function copyObjectLegacy(obj){
	let result = {};
	for(let key in obj){
		let element = obj[key];
		if(copys.indexOf(typeof element) != -1)
			result[key] = element;
		else if(Array.isArray(element))
			result[key] = copyArrayLegacy(element);
		else
			result[key] = copyObjectLegacy(element);
	}
	return result;
};

Network.addClientPacket("book_helper.open", function(data){
	Book.get(data.identifier).openClient(data.page);
});

let TextureSource = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.ui.TextureSource').instance;
function StringToBitmap(encodedString){
	try{
		encodeByte = android.util.Base64.decode(encodedString, 0);
		bitmap = android.graphics.BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
		return bitmap;
	}catch(e){
		return null;
	}
}
function loadTexture(name, bitmap){
	TextureSource.put(name, StringToBitmap(bitmap));
}

let PageBuilder = {
	types: {},
	Type(){
		this.mathSize = function(){
		
		} 
		this.endMathSize = function(){
			
		}
		this.build = function(){
			
		}
	},
	getType(name){
		return this.types[name];
	},
	addType(name, func){
		this.types[name] = func;
	}
};

function Book(identifier){
	Book.books[identifier] = this;
	
	let pages = {};
	let defaultPage = "default";
	let ui;
	
	this.setUi = function(ui_){
		ui = ui_;
		return this;
	}
	
	this.getUi = function(){
		return ui;
	}
	
	this.addPage = function(id, page){
		pages[id] = page;
		return this;
	}
	
	this.setDefaultPage = function(page){
		defaultPage = page;
		return this;
	}
	
	this.openClient = function(page){
		page = page || defaultPage;
		if(ui !== undefined && ui.isOpened()){
			pages[page].open(this, ui);
			return this;
		}
		pages[page].open(this);
		return this;
	}
	
	this.open = function(player, page){
		let client = Network.getClientForPlayer(player);
		if(client) client.send("book_helper.open", {identifier: identifier, page: page});
		return this;
	}
	
	this.registerItem = function(id, page){
		let self = this;
		Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
			if(item.id == id)
				self.open(player, page)
		});
	}
}
Book.books = {};
Book.get = function(id){
	return Book.books[id];
}

let LOCATION = new UI.WindowLocation({
	x: 100,
	width: 800
});
let HEIGHT = LOCATION.globalToWindow(UI.getScreenHeight());
let WIDTH = 380;

function Page(){
	let pages = {};
	pages[true] = [];
	pages[false] = [];
	
	let link = {
		next: undefined,
		pre: undefined 
	};
	
	this.setNextLink = function(name){
		link.next = name;
		return this;
	}
	
	this.setPreLink = function(name){
		link.pre = name;
		return this;
	}
	
	this.addElement = function(isLeft, type){
		pages[isLeft].push(type);
		return this;
	}
	
	this.addLeftElement = function(type){
		this.addElement(true, type);
		return this;
	}
	
	this.addRightElement = function(type){
		this.addElement(false, type);
		return this;
	}
	
	this.add = function(isLeft, name) {
		let args = [];
		for(let i = 2;i < arguments.length;i++)
			args.push(arguments[i]);
		let Type = PageBuilder.getType(name);
		let result = {};
		Type.apply(result, args)
		pages[isLeft].push(result);
		return this;
	}
	
	this.addLeft = function(name){
		let args = [true];
		for(let i in arguments)
			args.push(arguments[i]);
		this.add.apply(this, args);
	}
	
	this.addRight = function(name){
		let args = [false];
		for(let i in arguments)
			args.push(arguments[i]);
		this.add.apply(this, args);
	}
	
	function updateUi(book, content, isLeft, self){
		let elements = copyArrayLegacy(pages[isLeft]);
		for(let i in elements)
			if(typeof elements[i] == "function")
				elements[i] = elements[i](book, self);
		let data = {y: 30, x: isLeft ? 50 : 550, height: 0, width: 0};
		for(let i in elements){
			let element = elements[i];
			if(!Array.isArray(element)) element = [element];
			for(let a in element)
				element[a].mathSize(book, self, i, isLeft, data);
		}
		for(let i in elements){
			let element = elements[i];
			if(!Array.isArray(element)) element = [element];
			for(let a in element)
				element[a].endMathSize(book, self, i, isLeft, data);
		}
		data = {y: 30, x: isLeft ? 50 : 550};
		for(let i in elements){
			let element = elements[i];
			if(!Array.isArray(element)) element = [element];
			for(let b in element){
				let value = element[b].build(book, self, i, isLeft, data);
				for(let a in value)
					content.elements[a+"_"+i+"_"+b+"_"+isLeft] = value[a];
			}
		}
	}
	
	this.open = function(book, ui_){
		let content = {
			location: LOCATION.asScriptable(),
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)},
				{type: "bitmap", bitmap: "book_background", width: 1000, height: HEIGHT},
			],
			elements: {
				"close": {type: "close_button", x: 900, y: 0, bitmap: "classic_close_button", scale: 5}
			}
		};
		updateUi(book, content, true, this);
		updateUi(book, content, false, this);
		let self = this;
		if(link.next){
			content.elements["next_button"] = {type: "button", x: 910, y: HEIGHT - 45, bitmap: "next_page", scale: 3, clicker: {
				onClick(){
					self.close(book);
					book.openClient(link.next);
				}
			}}
		}
		if(link.pre){
			content.elements["pre_button"] = {type: "button", x: 50, y: HEIGHT - 45, bitmap: "pre_page", scale: 3, clicker: {
				onClick(){
					self.close(book);
					book.openClient(link.pre);
				}
			}}
		}
		let ui = ui_ || new UI.Window();
		ui.setContent(content);
		ui.setCloseOnBackPressed(true);
		ui.setBlockingBackground(true);
		book.setUi(ui);
		if(ui_)
			ui.forceRefresh();
		else
			ui.open();
		return ui;
	}
	
	this.close = function(book){
		let ui = book.getUi();
		if(ui)
			ui.close();
		book.setUi(undefined)
		return this;
	}
}

let OFFSET = 75;

function Text(){
	this.cursive = false;
	this.color = [0, 0, 0];
	this.bold = false;
	this.underline = false;
	this.size = 1;
	this.alignment = undefined;
	this.link = undefined;
	
	this.setCursive = function(cursive){
		this.cursive = cursive;
		return this;
	}
	this.setColor = function(){
		this.color = arguments;
		return this;
	}
	this.setBold = function(bold){
		this.bold = bold;
		return this;
	}
	this.setUnderline = function(underline){
		this.underline = underline;
		return this;
	}
	this.setSize = function(size){
		this.size = size;
		return this;
	}
	this.setAlignment = function(alignment){
		this.alignment = alignment;
		return this;
	}
	this.setLink = function(link){
		this.link = link;
		return this;
	}
	this.onClick = function(){};
	this.onLongClick = function(){};
	
	this.setOnClick = function(func){
		this.onClick = func;
		return this;
	}
	
	this.setOnLongClick = function(func){
		this.onLongClick = func;
		return this;
	}
}

function TextTypeElement(text, obj){
	const SIZE = (HEIGHT - OFFSET) / 34;
	let relSize;
	
	text = Translation.translate(text);
	obj = obj || new Text();
	obj.color = obj.color || [0, 0, 0];
	let color = android.graphics.Color.rgb(obj.color[0], obj.color[1], obj.color[2]);
	let size = obj.size || 1;
	
	PageBuilder.Type.call(this);
	
	function getWidth(size, text){
		return com.zhekasmirnov.innercore.api.mod.ui.types.Font({size:size}).getTextWidth(text, 1);
	}
	
	function getStr(str, size){
		let lines = str.split("\n");
		let result = "";
		let line = 0;
		for(let a in lines){
			if(a != "0")
				result += "\n";
			let chars = lines[a].split(" ");
			let subString = "";
			line++;
			for(let i in chars){
				let char = chars[i];
				if(getWidth(size, subString+char) <= WIDTH){
					if(subString != "" && subString != char){
						subString += " ";
						result += " ";
					}
					subString += char;
					result += char;
					continue;
				}
				subString = char;
				result += "\n"+char;
				line++;
			}
		}
		return {result: result, lines: line};
	}
	
	this.mathSize = function(book, page, i, isLeft, data){
		let text_ = getStr(text, SIZE*size);
		data.height += SIZE*size*1.1*text_.lines;
	} 
	
	this.endMathSize = function(book, page, i, isLeft, data){
		let result = (HEIGHT - OFFSET) / data.height;
		if(result < 1)
			relSize = SIZE * result;
		else 
			relSize = SIZE;
	}
	
	this.build = function(book, page, i, isLeft, data){
		let text_ = getStr(text, relSize*size);
		let result = [{type: "text", text: text_.result, x: data.x, y: data.y, multiline: true, font: {color: color, size: relSize*size, underline: obj.underline, cursive: obj.cursive, bold: obj.bold, alignment: obj.alignment}, clicker: {
			onClick(){
				if(obj.link){
					page.close(book);
					book.openClient(obj.link);
				}
				obj.onClick.apply(this, arguments);
			},
			onLongClick(){
				obj.onLongClick.apply(this, arguments);
			}
		}}];
		data.y += relSize*size*1.1*text_.lines;
		return result
	}
}

PageBuilder.addType("Text", TextTypeElement);
PageBuilder.addType("text", TextTypeElement);

function Slot(item){
	this.size = 1;
	this.texture = "_default_slot_empty";
	if(typeof item == "number") item = {id: item};
	item.id = item.id || 0;
	item.count = item.count === undefined ? 1 : item.count;
	item.data = item.data === undefined ? 0 : item.data; 
	this.item = item;
	
	this.setSize = function(size){
		this.size = size;
		return this;
	}
	this.setTexture = function(name){
		this.texture = name;
		return this;
	}
	
	this.onClick = function(){};
	this.onLongClick = function(){};
	
	this.setOnClick = function(func){
		this.onClick = func;
		return this;
	}
	
	this.setLink = function(link){
		this.link = link;
		return this;
	}
	
	this.setOnLongClick = function(func){
		this.onLongClick = func;
		return this;
	}
}

function SlotsTypeElement(slots){
	const SIZE = (HEIGHT - 100) / 9;
	let relSize;
	
	PageBuilder.Type.call(this);
	
	this.mathSize = function(book, page, i, isLeft, data){
		let size_max = 1;
		let width = 0;
		for(let i in slots){
			size_max = Math.max(size_max, slots[i].size);
			width += slots[i].size;
		}
		data.height += SIZE*size_max*1.1*Math.ceil(width/WIDTH);
	}
	
	this.endMathSize = function(book, page, i, isLeft, data){
		let result = (HEIGHT - OFFSET) / data.height;
		if(result < 1)
			relSize = SIZE * result;
		else 
			relSize = SIZE;
	}
	
	this.build = function(book, page, i, isLeft, data){
		let arr = [];
		let x = data.x;
		let y = data.y;
		let size_max = 0;
		for(let i in slots){
			let slot = slots[i];
			let size = Math.floor(relSize*slot.size);
			size_max = Math.max(size_max, size);
			arr.push({type: "slot", bitmap: slot.texture, x: x, y: y, size: size, visual: true, source: slot.item, clicker: {
				onClick(){
					if(slot.link){
						page.close(book);
						book.openClient(slot.link);
					}
					slot.onClick.apply(this, arguments);
				},
				onLongClick(){
					slot.onLongClick.apply(this, arguments);
				}
			}});
			x+=size;
			if(data.x+WIDTH < x || Number(i) == slots.length-1){
				x = data.x;
				y += size_max * 1.1;
				size_max = 0;
			}
		}
		data.y = y;
		return arr;
	}
}

PageBuilder.addType("Slot", SlotsTypeElement);
PageBuilder.addType("slot", SlotsTypeElement);

EXPORT("Book", Book);
EXPORT("Page", Page);
EXPORT("TypeBuilder", PageBuilder);
EXPORT("BookElements", {
	Style: {
		Text: Text,
		Slot: Slot
	},
	Text: TextTypeElement,
	Slot: SlotsTypeElement
});

loadTexture("next_page", "iVBORw0KGgoAAAANSUhEUgAAABIAAAAKCAYAAAC5Sw6hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAACVSURBVHjanJKxDYAwDAS9iMUmlEggT8EQhBmYA9aho3RJgZQdTGUrBBMQxVX2nyJ/YFtm+AoTyhOfJWsFsk+9y03EhPJHdhHp0puMCWWfeoljJ3HsriKVHKEtylRyhNYwkUpiaAwd5uR76a69iAklDrXh3UJnTCiacW+UyzxUkmbWCuTWSumvpJI0sy0zuBWXeGrzHADH/p+QhL7HOwAAAABJRU5ErkJggg==");

loadTexture("pre_page", "iVBORw0KGgoAAAANSUhEUgAAABIAAAAKCAYAAAC5Sw6hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAACcSURBVHjapJGxDcQgDEW9CGITypMuYooMQTJD5oB16CgpU5zkHXyVfT4rkJOueI3xfxgDPToa0UqGX4EeHZ3Hekn1QH+L7iR2YhHhvhDuC53HevsszujLpPjansJMpvu17DPR9viCZRbbyzIR9eioeqAeHWEKhClc7o7PMAXJtJIBOMwFKxuhM61kAA7rPbBshs0Mf6Z6oBm2/z0A6vyfkJJHalgAAAAASUVORK5CYII=");

loadTexture("book_background", "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");