LIBRARY({
    name: "DungeonAPI",
    version: 5, 
    api: "CoreEngine",
});
/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
alert("https://vk.com/club186544580");
function random(max){
    return Math.floor(Math.random()*max);
}
let StructureDir = "structure";
var Dungeon = {
    removeBlockStructure: function (name, identifier){
         let path = __dir__ + "/"+ StructureDir +"/" + name;
         let arr = FileTools.ReadJSON(path);
         for(i in arr){
             if(arr[i] == identifier){
                 arr.splice(i, i);
             }
         }
         FileTools.WriteJSON(path, arr, true);
    }, 
    removeBlockParameter: function (structure, parameter, value){
        let path = __dir__ + "/"+ StructureDir +"/" + structure;
         let arr = FileTools.ReadJSON(path);
         for(i in arr){
             let obj = this.getIdentifier(arr[i]);
             if(obj[parameter] == value){
                 arr.splice(i, i);
             }
         }
         FileTools.WriteJSON(path, arr, true);
    },
    addBlockStructure: function (name, identifier){
        let path = __dir__ + "/"+ StructureDir +"/" + name;
        let arr = FileTools.ReadJSON(path);
        blockArray.push(identifier);
        FileTools.WriteJSON(path, arr, true);
    }, 
    setStructure: function (name, xx, yy, zz, rotation, dimension){
        dimension = dimension || Player.getDimension();
        let blockSource = BlockSource.getDefaultForDimension(dimension);
        blockSource = BlockSource.getCurrentWorldGenRegion();
        let path = __dir__ + "/"+ StructureDir +"/" + name;
        let arr = FileTools.ReadJSON(path);
        let rot = rotation || 0;
        for(i in arr){
            let arr3 = arr[i].split(".");
            let id = this.getBlockID(arr3[0]);
            let data = arr3[1];
            data = parseInt(data);
            arr3[2] = parseInt(arr3[2]);
            arr3[3] = parseInt(arr3[3]);
            arr3[4] = parseInt(arr3[4]);
            switch(rot){
		            	case 0:
			            	var x1 = arr3[2];
			          		var y1 = arr3[3];
			          		var z1 = arr3[4];
		          			break;
		          		case 1:
			            	var x1 = arr3[4];
			          		var y1 = arr3[3];
		          			var z1 = arr3[2];
		          			break;
	          			case 2:
			          		var x1 = -arr3[2];
		          			var y1 = arr3[3];
			          		var z1 = arr3[4];
				          	break;
		          		case 3:
			          		var x1 = -arr3[4];
			          		var y1 = arr3[3];
	          				var z1 = arr3[2];
			          		break;
	          		}
            let x = xx + x1;
            let y = yy + y1;
            let z = zz + z1;
            blockSource.setBlock(x, y, z, id, data);
        }
    }, 
    getStructure: function (name){
        let path = __dir__ + "/"+ StructureDir +"/" + name;
        let arr = FileTools.ReadJSON(path);
        return arr;
    }, 
    generateionIdentifier: function (obj){
        let identifier = obj.id + "." + obj.data + "." + obj.x + "." + obj.y + "." + obj.z;
        return identifier;
    }, 
    setDir: function (path){
        StructureDir = path;
    }, 
    transferStructureAPI: function(name1, name2, t){
        let path1 = __dir__ + "/"+ StructureDir +"/" + name1;
        let arr = FileTools.ReadJSON(path1);
        let path2 = __dir__ + "/"+ StructureDir +"/" + name2;
        let arr3 = [];
        for(i in arr){
            let id = this.getIdentifier(arr[i]);
            arr3.push({x: id.x, y: id.y, z: id.z, id: id.id, data: id.data});
        }
        FileTools.WriteJSON(path2, arr3, t);
    }, 
    transferDungeonAPI: function (name1, name2, t){
        let path1 = __dir__ + "/"+ StructureDir +"/" + name1;
        let arr = FileTools.ReadJSON(path1);
        let path2 = __dir__ + "/"+ StructureDir +"/" + name2;
        let arr3 = [];
        for(i in arr){
            let arr2 = arr[i]
            let id = this.generateionIdentifier(arr2);
            arr3.push(id);
        }
        FileTools.WriteJSON(path2, arr3, t);
    }, 
    getIdentifier: function (identifier){
        let ide = identifier;
        let arr3 = ide.split(".");
        arr3[0] = this.getBlockID(arr3[0]);
        arr3[1] = parseInt(arr3[1]);
        arr3[2] = parseInt(arr3[2]);
        arr3[3] = parseInt(arr3[3]);
        arr3[4] = parseInt(arr3[4]);
        let identifie = {
            id: arr3[0],
            data: arr3[1],
            x: arr3[2],
            y: arr3[3],
            z: arr3[4]
        };
        return identifie;
    }, 
    copy: function (file, file2, t){
        let path = __dir__ + "/"+ StructureDir +"/" + file;
        let path2 = __dir__ + "/"+ StructureDir +"/" + file2;
        let arr = FileTools.ReadJSON(path);
        FileTools.WriteJSON(path2, arr, t);
    }, 
    destroyStructure: function (name, xx, yy, zz, rotation){
        dimension = dimension || Player.getDimension();
        let blockSource = BlockSource.getDefaultForDimension(dimension);
        blockSource = BlockSource.getCurrentWorldGenRegion();
        let path = __dir__ + "/"+ StructureDir +"/" + name;
        let arr = FileTools.ReadJSON(path);
        let rot = rotation || 0;
        for(i in arr){
            let arr3 = arr[i].split(".");
            arr3[2] = parseInt(arr3[2]);
            arr3[3] = parseInt(arr3[3]);
            arr3[4] = parseInt(arr3[4]);
            switch(rot){
		            	case 0:
			            	var x1 = arr3[2];
			          		var y1 = arr3[3];
			          		var z1 = arr3[4];
		          			break;
		          		case 1:
			            	var x1 = arr3[4];
			          		var y1 = arr3[3];
		          			var z1 = arr3[2];
		          			break;
	          			case 2:
			          		var x1 = -arr3[2];
		          			var y1 = arr3[3];
			          		var z1 = arr3[4];
				          	break;
		          		case 3:
			          		var x1 = -arr3[4];
			          		var y1 = arr3[3];
	          				var z1 = arr3[2];
			          		break;
	          		}
            let x = xx + x1;
            let y = yy + y1;
            let z = zz + z1;
            blockSource.setBlock(x, y, z, 0, 0);
        }
    }, 
    ReadStructure: function (name, rotation){
        let path = __dir__ + "/"+ StructureDir +"/" + name;
        let arr = FileTools.ReadJSON(path);
        let rot = rotation || 0;
        let ar = [];
        for(i in arr){
            let arr3 = arr[i].split(".");
            arr3[0] = this.getBlockID(arr3[0]);
            arr3[1] = parseInt(arr3[1]);
            arr3[2] = parseInt(arr3[2]);
            arr3[3] = parseInt(arr3[3]);
            arr3[4] = parseInt(arr3[4]);
            switch(rot){
		            	case 0:
			            	var x1 = arr3[2];
			          		var y1 = arr3[3];
			          		var z1 = arr3[4];
		          			break;
		          		case 1:
			            	var x1 = arr3[4];
			          		var y1 = arr3[3];
		          			var z1 = arr3[2];
		          			break;
	          			case 2:
			          		var x1 = -arr3[2];
		          			var y1 = arr3[3];
			          		var z1 = arr3[4];
				          	break;
		          		case 3:
			          		var x1 = -arr3[4];
			          		var y1 = arr3[3];
	          				var z1 = arr3[2];
			          		break;
	          		}
            ar.push({id: arr3[0], data: arr3[1], x: x1, y: y1, z: z1});
        }
        return ar;
    }, 
    getBlockID: function(id){
        let ids = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        let Block = ids.id.blocks[id];
        if(!Block){
            Block = parseInt(id);
        }
        return Block;
    },
    isBlock: function(id){
        let blocks = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        blocks = blocks.id.blocks;
        let d;
        if(id >= 8000){
           key = Object.keys(blocks);
           for(i in key){
               let k = key[i];
               if(blocks[k]==id){
                   d = k;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};
function DungeonAPI (path){
    let code = {
        isSetBlock: function(x, y, z, id, data, identifier, packet){
            return true;
        }
    };
    var pathJson = __dir__+ "/" + StructureDir + "/" + path;
    let rota;
    this.setPrototype = function (obj){
        code = obj;
    }
    this.setPath = function (path){
        var pathJson = __dir__ + "/"+ StructureDir +"/" + path;
    }
    this.setStructure = function (xx, yy, zz, rotation, dimension, packet){
        dimension = dimension || Player.getDimension();
        let blockSource = BlockSource.getDefaultForDimension(dimension);
        blockSource = BlockSource.getCurrentWorldGenRegion();
        packet = packet || {};
        let arr = FileTools.ReadJSON(pathJson);
        let rot = rotation || 0;
        if(code.before)
            code.before(xx, yy, zz, rot, packet);
        
        for(i in arr){
            let arr3 = arr[i].split(".");
            let id = Dungeon.getBlockID(arr3[0]);
            let data = arr3[1];
            data = parseInt(data);
            arr3[2] = parseInt(arr3[2]);
            arr3[3] = parseInt(arr3[3]);
            arr3[4] = parseInt(arr3[4]);
            switch(rot){
		            	case 0:
			            	var x1 = arr3[2];
			          		var y1 = arr3[3];
			          		var z1 = arr3[4];
		          			break;
		          		case 1:
			            	var x1 = arr3[4];
			          		var y1 = arr3[3];
		          			var z1 = arr3[2];
		          			break;
	          			case 2:
			          		var x1 = -arr3[2];
		          			var y1 = arr3[3];
			          		var z1 = arr3[4];
				          	break;
		          		case 3:
			          		var x1 = -arr3[4];
			          		var y1 = arr3[3];
	          				var z1 = arr3[2];
			          		break;
	          		}
            let x = xx + x1;
            let y = yy + y1;
            let z = zz + z1;
            if(code.isSetBlock(x, y, z, id, data, arr[i], packet)){
                    blockSource.setBlock(x, y, z, id, data);
            }
            if(code.setStructure)
                code.setStructure(x, y, z, id, data, arr[i], packet);
        }
        if(code.after)
            code.after(xx, yy, zz, rot, packet);
        
    }
    this.setStructurePro = function (xx, yy, zz, func, rotation, dimension){
        dimension = dimension || Player.getDimension();
        let blockSource = BlockSource.getDefaultForDimension(dimension);
        blockSource = BlockSource.getCurrentWorldGenRegion();
        let arr = FileTools.ReadJSON(pathJson);
        let rot = rotation || 0;
        if(func.before)
            func.before(xx, yy, zz, rot);
        
        for(i in arr){
            let arr3 = arr[i].split(".");
            let id = Dungeon.getBlockID(arr3[0]);
            let data = arr3[1];
            data = parseInt(data);
            arr3[2] = parseInt(arr3[2]);
            arr3[3] = parseInt(arr3[3]);
            arr3[4] = parseInt(arr3[4]);
            switch(rot){
		            	case 0:
			            	var x1 = arr3[2];
			          		var y1 = arr3[3];
			          		var z1 = arr3[4];
		          			break;
		          		case 1:
			            	var x1 = arr3[4];
			          		var y1 = arr3[3];
		          			var z1 = arr3[2];
		          			break;
	          			case 2:
			          		var x1 = -arr3[2];
		          			var y1 = arr3[3];
			          		var z1 = arr3[4];
				          	break;
		          		case 3:
			          		var x1 = -arr3[4];
			          		var y1 = arr3[3];
	          				var z1 = arr3[2];
			          		break;
	          		}
            let x = xx + x1;
            let y = yy + y1;
            let z = zz + z1;
            if(func.isSetBlock(x, y, z, id, data, arr[i])){
                    blockSource.setBlock(x, y, z, id, data);
            }
            if(func.setStructure)
                func.setStructure(x, y, z, id, data, arr[i]);
        }
        if(func.after)
            func.after(xx, yy, zz, rot);
        
    }
    this.getStructure = function (){
        let arr = FileTools.ReadJSON(pathJson);
        return arr;
    }
    this.getPrototype = function (){
        return code;
    }
};
var blockArray = [];
Callback.addCallback("NativeCommand", function(str){
    let cmd = str.split(" ");
    if(cmd[0] == "/tool"){
        Game.message("§2выдан инструмент");
        let coords = Entity.getPosition(Player.get());
        World.drop(coords.x, coords.y, coords.z, ItemID.debugTools, 1);
        Game.prevent();
    }
    if(cmd[0] == "/structure"){
        if(cmd[1] == "write"){
            Game.prevent();
            for(x = Math.min(coordinates[0].x, coordinates[1].x); x<=Math.max(coordinates[0].x, coordinates[1].x);x++){
		             	for(z = Math.min(coordinates[0].z, coordinates[1].z); z<=Math.max(coordinates[0].z, coordinates[1].z);z++){
				              for(y = Math.min(coordinates[0].y, coordinates[1].y); y<=Math.max(coordinates[0].y, coordinates[1].y);y++){
				                  let b = World.getBlock(x, y, z);
				                  let xi = x - origin.x;
				                  let yi = y - origin.y;
				                  let zi = z - origin.z;
					                let identifier = Dungeon.isBlock(b.id) + "." + b.data + "." + xi + "." + yi + "." + zi;
					                if(cmd[4] == "false"){
					                if(World.getBlock(x,y,z).id!=0)
					                blockArray.push(identifier);
					                }else{
					                blockArray.push(identifier);
					                }
                    }
                } 
            } 
            if(cmd[3]=="true"){
                FileTools.WriteJSON (__dir__+"/"+ StructureDir +"/" + cmd[2], blockArray, true);
            }else{
                FileTools.WriteJSON (__dir__+"/"+ StructureDir +"/" + cmd[2], blockArray, false);
            }
            
            Game.message("§2структура сохранена");
            blockArray = [];
        }
        if(cmd[1]=="set"){
            let coords = Entity.getPosition(Player.get());
            Dungeon.setStructure(cmd[2], coords.x, coords.y, coords.z, 0);
            Game.prevent();
            Game.message("§2структура установлена");
        }
    }
});
var firstClick = true;
var es = ModAPI.requireGlobal("Entity.isSneaking");
var origin = {x:0, y:0, z:0};
var coordinates=[{},{}];
IDRegistry.genItemID("debugTools"); 
Item.createItem("debugTools", "debug tool", {name: "axe", meta: 0}, {stack: 1, isTech: true});
Callback.addCallback("ItemUse", function(coords, item){ 
    if(item.id == ItemID.debugTools&&es(Player.get())){ 
	      origin = coords;
        Game.message("установлен цент структуры");
    }else if(item.id == ItemID.debugTools&&!es(Player.get())){
	      if(!firstClick){
	          coordinates[1] = coords;
	          Game.message("second click");
	      }else{
	          Game.message("first click");
	          coordinates[0]=coords;
	          
	      }
	      firstClick = firstClick?false:true;
}
});
let dir = "ItemGenerate";
let ItemGenerateAPI = {
    deb: false, 
    setDir: function (path){
        dir = path;
    }, 
    debug: function(value){
        this.deb = value
    }
};
function is (container, slot, id, data, count){
    if(container){
        if(slot >= 0){
            if(id){
                if(data >= 0){
                    if(count){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }else{
        return false;
    }
}
function ItemGenerate (){
    this.generateion = []
    this.Prototype = {
        isGenerate: function(slot, x, y, z, random, id, data, count){
            return true;
        }
    }
    this.importJson = function (file, value){
        this.generateion = FileTools.ReadJSON(__dir__+"/"+dir+"/"+file);
    }
    this.exportJson = function (file){
        FileTools.WriteJSON(__dir__+"/"+dir+"/"+file, this.generateion, value);
    }
    this.addItem = function (id, random, count, data){
        random = random||1;
        count = count||{};
        count.min = count.min||1;
        count.max = count.max||1;
        data = data||0;
        this.generateion.push({id:id, data:data, random:random, count:count});
    }
    this.setPrototype = function (obj){
        this.Prototype = obj;
    }
    this.fillChest = function (x, y, z, packet){
        packet = packet || {}
        let container = World.getContainer(x, y, z);
        if(container){
            let random = Math.random();
            let slot = Math.random()*27;
            for(i in this.generateion){
                let item = {
                    id: this.generateion[i].id, 
                    data: this.generateion[i].data, 
                    count: this.generateion[i].count 
                };
                if(this.Prototype.beforeGenerating){
                    this.Prototype.beforeGenerating(x, y, z, random, slot, item.id, item.data, packet);
                }
                if(random<this.generateion[i].random){
                    let count = Math.floor(Math.random()*(item.count.min))+item.count.min; 
                    if(this.Prototype.isGenerate(slot, x, y, z, random, item.id, item.data, count, packet)){
                        if(is(container, slot, item.id, item.data, count)){
                            container.setSlot(slot, item.id, count, item.data);
                        }
                    }
                    if(this.Prototype.setFunction)
                        this.Prototype.setFunction(slot, x, y, z, random, item.id, item.data, count, packet)
                    slot = Math.random()*27;
                }
                if(this.Prototype.afterGenerating){
                    this.Prototype.afterGenerating(x, y, z, random, slot, item.id, item.data, packet);
                } 
            }
        }else if(ItemGenerateAPI.deb == true){
            Game.tipMessage("noy chest")
        }
    }
    this.fillChestPro = function (x, y, z, pro){
        let container = World.getContainer(x, y, z);
        if(container){
            let random = Math.random();
            let slot = Math.random()*27;
            for(i in this.generateion){
                let item = {
                    id: this.generateion[i].id, 
                    data: this.generateion[i].data, 
                    count: this.generateion[i].count 
                };
                if(this.Prototype.beforeGenerating){
                    this.Prototype.beforeGenerating(x, y, z, random, slot, item.id, item.data);
                }
                if(random<this.generateion[i].random){
                    let count = Math.floor(Math.random()*(item.count.min))+item.count.min; 
                    if(pro.isGenerate(slot, x, y, z, random, item.id, item.data, count)){
                        if(is(container, slot, item.id, item.data, count)){
                            container.setSlot(slot, item.id, count, item.data);
                        }
                    }
                    if(pro.setFunction)
                        pro.setFunction(slot, x, y, z, random, item.id, item.data, count)
                    slot = Math.random()*27;
                }
                if(pro.afterGenerating){
                    pro.afterGenerating(x, y, z, random, slot, item.id, item.data);
                } 
            }
        }else if(ItemGenerateAPI.deb == true){
            Game.tipMessage("noy chest")
        }
    }
    this.fillChestSit = function (x, y, z, sid){
        let container = World.getContainer(x, y, z);
        if(container){
            let random = sid.nextInt(100);
            let slot = sid.nextInt(27);
            for(i in this.generateion){
                let item = {
                    id: this.generateion[i].id, 
                    data: this.generateion[i].data, 
                    count: this.generateion[i].count 
                };
                if(this.Prototype.beforeGenerating){
                    this.Prototype.beforeGenerating(x, y, z, random, slot, item.id, item.data);
                }
                if(random<this.generateion[i].random){
                    let count = Math.floor(Math.random()*(item.count.min))+item.count.min; 
                    if(this.Prototype.isGenerate(slot, x, y, z, random, item.id, item.data, count)){
                        if(is(container, slot, item.id, item.data, count)){
                            container.setSlot(slot, item.id, count, item.data);
                        }
                    }
                    if(this.Prototype.setFunction)
                        this.Prototype.setFunction(slot, x, y, z, random, item.id, item.data, count)
                    slot = sid.nextInt(27);
                }
                if(this.Prototype.afterGenerating){
                    this.Prototype.afterGenerating(x, y, z, random, slot, item.id, item.data);
                } 
            }
        }else if(ItemGenerateAPI.deb == true){
            Game.tipMessage("noy chest")
        }
    }
    this.setItems = function (arr){
        this.generateion = arr;
    }
}
var File = {
    update1: function(file, value){
        let path = __dir__ + "/"+ StructureDir +"/" + file;
        let structure = Dungeon.getStructure(file);
        let arr = [];
        for(i in structure){
            if(structure[i].identifier){
                arr[i] = structure[i].identifier;
            }
        }
        if(structure[0].identifier){
            FileTools.WriteJSON(path, arr, value);
        }
    }, 
    update2: function(file, value){
        let stru = Dungeon.getStructure(file);
        let Structure = [];
        let identifier;
        for(i in stru){
            identifier = Dungeon.getIdentifier(stru[i]);
            identifier.id = Dungeon.isBlock(identifier.id);
             Structure.push(Dungeon.generateionIdentifier(identifier));
        }
        
        FileTools.WriteJSON(__dir__ + "/"+ StructureDir +"/" + file, Structure, value)
    }
};
var TYPE = {
  helmet: [0, 1, 3, 4, 5, 6, 8, 17],
  chestplate: [0, 1, 3, 4, 5, 17],
  leggings: [0, 1, 3, 4, 5, 17],
  boots: [0, 1, 2, 3, 4, 5, 7, 17],
  sword: [9, 10, 11, 12, 13, 14, 17],
  shovel: [15, 16, 17, 18],
  pickaxe: [15, 16, 17, 18],
  axe: [9, 10, 11, 15, 16, 17, 18],
  hoe: [17],
  bow: [17, 19, 20, 21, 22],
  fishing: [17, 23, 24],
  shears: [15, 17],
};
function enchantAdd (random, typ, ech){
    for(i = 0;i <= ech;i++){
        let extra = new ItemExtraData();
        if(Math.random()*1<=random){
            let enc = 0;
            let ty = TYPE[typ]
            for(i in ty){
                enc++;
            }
            let ran2 = Math.floor(Math.random()*enc);
            let ran3 = Math.floor(Math.random()*2 + 1);
            let ench = ty[ran2];
            extra.addEnchant(ench, ran3);
        }
    }
    return extra;
}
EXPORT("DungeonAPI", DungeonAPI);
EXPORT("Dungeon", Dungeon);
EXPORT("ItemGenerate", ItemGenerate);
EXPORT("ItemGenerateAPI", ItemGenerateAPI);
EXPORT("enchantAdd", enchantAdd);
EXPORT("File", File);
