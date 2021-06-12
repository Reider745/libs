LIBRARY({
    name: "DungeonCore",
    version: 1, 
    api: "CoreEngine",
});
var Dungeon = {
    path: "/structure/",
    getId: function(id){
        if(typeof id == "string")
            return BlockID[id];
        else
            return id;
    },
    setPath: function(path){
        this.path = "/"+path;;
    },
    generateIdentifier: function(obj){
        return Dungeon.isBlock(obj.id) + "." + obj.data + "." + obj.x + "." + obj.y + "." + obj.z;
    },
    getIdentifier: function(string){
        return {
            id: (function(id){
                let Block = BlockID[id];
                if(!Block){
                    Block = parseInt(id);
                }
                return Block;
            })(string.split(".")[0]),
            data: parseInt(string.split(".")[1]),
            x: parseInt(string.split(".")[2]),
            y: parseInt(string.split(".")[3]),
            z: parseInt(string.split(".")[4])
        };
    },
    advanced: function(name){
        this.stru = FileTools.ReadJSON(__dir__+Dungeon.path+name+".dc");
        this.prot = {
            isSetBlock: function(x, y, z, id, data, identifier, region, state, packet){return true;},
            before: function (x, y, z, region, packet){},
            setBlock: function(x, y, z, id, data, identifier, region, state, packet){},
            after: function(x, y, z, region, packet){}
        };
        this.setPath = function(name){
            this.stru = FileTools.ReadJSON(__dir__+Dungeon.path+name+".dc");
        }
        this.setStructure = function(x, y, z, region, packet){
            region = region || BlockSource.getCurrentWorldGenRegion();
            packet = packet || {};
            this.prot.after(x, y, z, region, packet);
            for(let i in this.stru){
               if(this.prot.isSetBlock(parseInt(this.stru[i][1].split(".")[1]) + x, parseInt(this.stru[i][1].split(".")[2]) + y, parseInt(this.stru[i][1].split(".")[3]) + z, Dungeon.getId(this.stru[i][0]), parseInt(this.stru[i][1].split(".")[0]), Dungeon.generateIdentifier({
                   id: Dungeon.getId(this.stru[i][0]),
                   data: parseInt(this.stru[i][1].split(".")[0]),
                   x: parseInt(this.stru[i][1].split(".")[1]) + x, 
                   y: parseInt(this.stru[i][1].split(".")[2]) + y, 
                   z: parseInt(this.stru[i][1].split(".")[3]) + z
               }), region, new BlockState(Dungeon.getId(this.stru[i][0]), this.stru[i][2]), packet)){
                   region.setBlock(parseInt(this.stru[i][1].split(".")[1]) + x, parseInt(this.stru[i][1].split(".")[2]) + y, parseInt(this.stru[i][1].split(".")[3]) + z, new BlockState(Dungeon.getId(this.stru[i][0]), this.stru[i][2]));
                   if(this.stru[i][3]) region.setExtraBlock(parseInt(this.stru[i][1].split(".")[1]) + x, parseInt(this.stru[i][1].split(".")[2]) + y, parseInt(this.stru[i][1].split(".")[3]) + z, new BlockState(Dungeon.getId(this.stru[i][3][0]), this.stru[i][3][1]));
               }
               this.prot.setBlock(parseInt(this.stru[i][1].split(".")[1]) + x, parseInt(this.stru[i][1].split(".")[2]) + y, parseInt(this.stru[i][1].split(".")[3]) + z, Dungeon.getId(this.stru[i][0]), parseInt(this.stru[i][1].split(".")[0]), Dungeon.generateIdentifier({
                   id: Dungeon.getId(this.stru[i][0]),
                   data: parseInt(this.stru[i][1].split(".")[0]),
                   x: parseInt(this.stru[i][1].split(".")[1]) + x, 
                   y: parseInt(this.stru[i][1].split(".")[2]) + y, 
                   z: parseInt(this.stru[i][1].split(".")[3]) + z
               }), region, new BlockState(Dungeon.getId(this.stru[i][0]), this.stru[i][2]), packet)
               
            }
            this.prot.before(x, y, z, region, packet);
        }
        this.setPrototype = function(obj){
            if(!obj.isSetBlock){
                obj.isSetBlock = function(x, y, z, id, data, identifier, region, state, packet){
                    return true;
                }
            }
            if(!obj.before){
                obj.before = function (x, y, z, region, packet){};
            }
            if(!obj.setBlock){
                obj.setBlock = function(x, y, z, id, data, identifier, region, state, packet){};
            }
            if(!obj.after){
                obj.after = function(x, y, z, region, packet){}
            }
            this.prot = obj;
        }
    },
    isStructure: function(name, x, y, z, region){
        let stru = FileTools.ReadJSON(__dir__+this.path+name+".dc");
        let arr = [];
        for(var i in stru){
            let b = Dungeon.getIdentifier(stru[i][0]+"."+stru[i][1]);
            if(region.getBlock(b.x + x, b.y + y, b.z + z).id==b.id && region.getBlock(b.x + x, b.y + y, b.z + z).data==b.data){
                arr.push(".");
            }
        }
        return stru.length === arr.length;
    },
    isObj: function(obj1, obj2){
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    },
    isStructureFull: function(name, x, y, z, region){
        let stru = FileTools.ReadJSON(__dir__+this.path+name+".dc");
        let arr = [];
        for(var i in stru){
            let b = Dungeon.getIdentifier(stru[i][0]+"."+stru[i][1]);
            if(region.getBlock(b.x + x, b.y + y, b.z + z).id==b.id && region.getBlock(b.x + x, b.y + y, b.z + z).data==b.data && (Dungeon.isObj(region.getBlock(b.x + x, b.y + y, b.z + z).getNamedStatesScriptable(), stru[i][2]))){
                arr.push(".");
            }
        }
        return stru.length === arr.length;
    },
    getStructure: function(name){
        return FileTools.ReadJSON(__dir__+this.path+name+".dc");
    },
    destroyStructure: function(name, x, y, z, region){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let stru = FileTools.ReadJSON(__dir__+this.path+name+".dc");
        for(let i in stru){
            region.setBlock(parseInt(stru[i][1].split(".")[1]) + x, parseInt(stru[i][1].split(".")[2]) + y, parseInt(stru[i][1].split(".")[3]) + z, 0, 0);
        }
    },
    setStructure: function(name, x, y, z, region){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let stru = FileTools.ReadJSON(__dir__+this.path+name+".dc");
        for(let i in stru){
            region.setBlock(parseInt(stru[i][1].split(".")[1]) + x, parseInt(stru[i][1].split(".")[2]) + y, parseInt(stru[i][1].split(".")[3]) + z, new BlockState(Dungeon.getId(stru[i][0]), stru[i][2]));
            if(stru[i][3]) region.setExtraBlock(parseInt(stru[i][1].split(".")[1]) + x, parseInt(stru[i][1].split(".")[2]) + y, parseInt(stru[i][1].split(".")[3]) + z, new BlockState(Dungeon.getId(stru[i][3][0]), stru[i][3][1]))
        }
    },
    isBlock: function(id){
        let d;
        if(id >= 8000){
           key = Object.keys(BlockID);
           for(let i in key){
               if(BlockID[key[i]]==id){
                   d = key[i];
                   break;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};

//генерация предметов 
var TYPE = {
  helmet: [{e: 0, l: 4}, {e: 1, l: 4}, {e: 3, l: 4}, {e: 4, l: 4}, {e: 5, l: 3}, {e: 6, l: 3}, {e: 8, l: 1}, {e: 17, l: 3}],
  chestplate: [{e: 0, l: 4}, {e: 1, l: 4}, {e: 3, l: 4}, {e: 4, l: 4}, {e: 5, l: 3}, {e: 17, l: 3}],
  leggings: [{e: 0, l: 4}, {e: 1, l: 4}, {e: 3, l: 4}, {e: 4, l: 4}, {e: 5, l: 3}, {e: 17, l: 3}],
  boots: [{e: 0, l: 4}, {e: 1, l: 4}, {e: 2, l: 4}, {e: 3, l: 4}, {e: 4, l: 4}, {e: 5, l: 3}, 7, {e: 17, l: 3}],
  sword: [{e: 9, l: 5}, {e: 10, l: 5}, {e: 11, l: 5}, {e: 12, l: 2}, {e: 13, l: 2}, {e: 14, l: 3}, {e: 17, l: 3}],
  shovel: [{e: 15, l: 5}, {e: 16, l: 1}, {e: 17, l: 3}, {e: 18, l: 3}],
  pickaxe: [{e: 15, l: 5}, {e: 16, l: 1}, {e: 17, l: 3}, {e: 18, l: 3}],
  axe: [{e: 9, l: 5}, {e: 10, l: 5}, {e: 11, l: 5}, {e: 15, l: 5}, {e: 16, l: 1}, {e: 17, l: 3}, {e: 18, l: 3}],
  hoe: [{e: 17, l: 3}],
  bow: [{e: 17, l: 3}, {e: 19, l: 5}, {e: 18, l: 2}, {e: 21, l: 1}, {e: 22, l: 1}],
  fishing: [{e: 17, l: 3}, {e: 23, l: 3}, {e: 24, l: 3}],
  shears: [{e: 15, l: 5}, {e: 17, l: 3}],
};
function ItemGeneration(){
    this.items = []
    this.prot = {
        before: function(pos, region, packet){},
        after: function(pos, region, packet){},
        isGenerate: function(pos, random, slot, item, region, packet){return true},
        generate: function(pos, random, slot, item, region, packet){}
    }
    this.setPrototype = function(obj){
        if(!obj.before) obj.before = function(pos, region, packet){}
        if(!obj.after) obj.after = function(pos, region, packet){}
        if(!obj.isGenerate) obj.isGenerate = function(pos, random, slot, item, region, packet){return true}
        if(!obj.generate) obj.generate = function(pos, random, slot, item, region, packet){}
        this.prot = obj;
    }
    this.addItem = function(id, random, count, data, extra){
        id = id || 0;
        random = random || 1;
        count = count || {};
        count.min = count.min || 1;
        count.max = count.max || 1;
        data = data || 0;
        extra = extra || null
        this.items.push([id, random, count, data, extra]);
    }
    this.fillChest = function(x, y, z, region, packet){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let cont = World.getContainer(x, y, z, region);
        packet = packet || {};
        if(cont){
            this.prot.before({x: x, y: y, z: z}, region, packet)
            for(let i in this.items){
                let slot = Math.floor(Math.random()*cont.getSize());
                let random = Math.random();
                if(random <= this.items[i][1]){
                    let count = Math.floor(Math.random()*(this.items[i][2].max-this.items[i][2].min))+this.items[i][2].min; 
                    let item = {
                        id: this.items[i][0],
                        data: this.items[i][3],
                        extra: this.items[i][4]
                    };
                    if(this.prot.isGenerate({x: x, y: y, z: z}, random, slot, item, region, packet)) cont.setSlot(slot, item.id, count, item.data, item.extra);
                    this.prot.generate({x: x, y: y, z: z}, random, slot, item, region, packet)
                }
            }
            this.prot.after({x: x, y: y, z: z}, region, packet)
        }
    }
    this.fillChestSid = function(x, y, z, random, region, packet){
        region = region || BlockSource.getCurrentWorldGenRegion();
        packet = packet || {};
        random = random || Utility.random();
        let cont = World.getContainer(x, y, z, region);
        if(cont){
            this.prot.before({x: x, y: y, z: z}, region, packet)
            for(let i in this.items){
                let slot = random.nextInt(cont.getSize());
                let rand = 1 / random.nextInt(1000);
                if(rand <= this.items[i][1]){
                    let count;
                    if(this.items[i][2].max-this.items[i][2].min >= 1){
                        count =  random.nextInt(this.items[i][2].max-this.items[i][2].min)+this.items[i][2].min;
                    }else{
                        count =  random.nextInt(this.items[i][2].max);
                    }
                    let item = {
                        id: this.items[i][0],
                        data: this.items[i][3],
                        extra: this.items[i][4]
                    };
                    if(this.prot.isGenerate({x: x, y: y, z: z}, rand, slot, item, region, packet)) cont.setSlot(slot, item.id, count, item.data, item.extra);
                    this.prot.generate({x: x, y: y, z: z}, rand, slot, item, region, packet)
                }
            }
            this.prot.after({x: x, y: y, z: z}, region, packet)
        }
    }
}
function ItemGenerationPro(){
    this.items = []
    this.prot = {
        before: function(pos, region, packet){},
        after: function(pos, region, packet){},
        isGenerate: function(pos, random, slot, item, region, packet){return true},
        generate: function(pos, random, slot, item, region, packet){}
    }
    this.setPrototype = function(obj){
        if(!obj.before) obj.before = function(pos, region, packet){}
        if(!obj.after) obj.after = function(pos, region, packet){}
        if(!obj.isGenerate) obj.isGenerate = function(pos, random, slot, item, region, packet){return true}
        if(!obj.generate) obj.generate = function(pos, random, slot, item, region, packet){}
        this.prot = obj;
    }
    this.addItem = function(id, random, count, data, extra){
        id = id || 0;
        random = random || 1;
        count = count || {};
        count.min = count.min || 1;
        count.max = count.max || 1;
        count.slotMax = count.slotMax || 1;
        count.slotMin = count.slotMin || 1;
        data = data || 0;
        extra = extra || null
        this.items.push([id, random, count, data, extra]);
    }
    this.fillChest = function(x, y, z, region, packet){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let cont = World.getContainer(x, y, z, region);
        packet = packet || {};
        if(cont){
            this.prot.before({x: x, y: y, z: z}, region, packet)
            for(let i in this.items){
                let random = Math.random();
                if(random <= this.items[i][1]){
                    for(let a = 0;a<=Math.floor(Math.random()*(this.items[i][2].slotMax-this.items[i][2].slotMin))+this.items[i][2].slotMin;a++){
                        let slot = Math.floor(Math.random()*cont.getSize());
                        let count = Math.floor(Math.random()*(this.items[i][2].max-this.items[i][2].min))+this.items[i][2].min; 
                        let item = {
                            id: this.items[i][0],
                            data: this.items[i][3],
                            extra: this.items[i][4]
                        };
                        if(this.prot.isGenerate({x: x, y: y, z: z}, random, slot, item, region, packet)) cont.setSlot(slot, item.id, count, item.data, item.extra);
                        this.prot.generate({x: x, y: y, z: z}, random, slot, item, region, packet)
                    }
                }
            }
            this.prot.after({x: x, y: y, z: z}, region, packet)
        }
    }
    this.fillChestSid = function(x, y, z, random, region, packet){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let cont = World.getContainer(x, y, z, region);
        packet = packet || {};
        if(cont){
            this.prot.before({x: x, y: y, z: z}, region, packet)
            for(let i in this.items){
                let rand = 1 / random.nextInt(1000);
                if(rand <= this.items[i][1]){
                    let c;
                    if(this.items[i][2].slotMax-this.items[i][2].slotMin >= 1){
                        c = random.nextInt(this.items[i][2].slotMax-this.items[i][2].slotMin)+this.items[i][2].slotMin;
                    }else{
                        c = random.nextInt(this.items[i][2].slotMax);
                    }
                    for(let a = 0;a<=c;a++){
                        let slot = random.nextInt(cont.getSize());
                        let count;
                        if(this.items[i][2].max-this.items[i][2].min >= 1){
                           count =  random.nextInt(this.items[i][2].max-this.items[i][2].min)+this.items[i][2].min;
                        }else{
                           count =  random.nextInt(this.items[i][2].max);
                        }
                        let item = {
                            id: this.items[i][0],
                            data: this.items[i][3],
                            extra: this.items[i][4]
                        };
                        if(this.prot.isGenerate({x: x, y: y, z: z}, rand, slot, item, region, packet)) cont.setSlot(slot, item.id, count, item.data, item.extra);
                        this.prot.generate({x: x, y: y, z: z}, rand, slot, item, region, packet)
                    }
                }
            }
            this.prot.after({x: x, y: y, z: z}, region, packet)
        }
    }
}
var ItemGenerate = {
    defaults: ItemGeneration,
    advanced: ItemGenerationPro,
    enchantAdd: function (type, count){
        let arr = TYPE[type];
        let extra = new ItemExtraData();
        for(var i=0;i<=count;i++){
            let r = Math.ceil(Math.random()*(arr.length-1));
            let lvl = Math.ceil(Math.random()*(arr[r].l))+1;
            extra.addEnchant(arr[r].e, lvl);
        }
        return extra;
    }
};


//инструменты
var Utility = {
    random: function(){
        return new java.util.Random();
    },
    setStruc: function(name, coords, region){
        region = region || BlockSource.getCurrentWorldGenRegion();
        Dungeon.setStructure(name, coords.x, coords.y, coords.z, region)
    },
    gntId: Dungeon.generateIdentifier,
    setBlockWater: function(x, y, z, id, data, region){
        data = data || 0;
        region = region || BlockSource.getCurrentWorldGenRegion();
        if(region.getBlockId(x, y, z) == 9){
            region.setBlock(x, y, z, id, data);
            region.setExtraBlock(x, y, z, 9, 0);
        }else{
            region.setBlock(x, y, z, id, data);
        }
    },
    fillCoords: function(x1, y1, z1, x2, y2, z2, block, region){
        region = region || blockSource.getCurrentWorldGenRegion();
        for(x = Math.min(x1, x2); x<=Math.max(x1, x2);x++){
		         for(z = Math.min(z1, z2); z<=Math.max(z1, z2);z++){
				          for(y = Math.min(y1, y2); y<=Math.max(y1, y2);y++){
				              if(!block.states)
				                  region.setBlock(x, y, z, block.id, block.data);
				              else
				                  region.setBlock(x, y, z, new BlockState(block.id, block.states));
				          }
				      }
				  }
    },
    saveAtCoords: function(name, pos1, pos2, central, value1, value2, region){
        region = region || BlockSource.getCurrentWorldGenRegion();
        let arr = [];
        for(x = Math.min(pos1.x, pos2.x); x<=Math.max(pos1.x, pos2.x);x++){
		          for(z = Math.min(pos1.z, pos2.z); z<=Math.max(pos1.z, pos2.z);z++){
				          for(y = Math.min(pos1.y, pos2.y); y<=Math.max(pos1.y, pos2.y);y++){
				              let b = region.getBlock(x, y, z);
				              let xi = x - central.x;
				              let yi = y - central.y;
				              let zi = z - central.z;
				              let extraBlock = [];
				              let eb = BlockSource.getCurrentWorldGenRegion().getExtraBlock(x, y, z);
				              if(eb.id != 0){
				                  extraBlock = [Dungeon.isBlock(eb.id), eb.getNamedStatesScriptable()]
				              }
					             let identifier = [Dungeon.isBlock(b.id), b.data + "." + xi + "." + yi + "." + zi, b.getNamedStatesScriptable()];
					             if(extraBlock.length >= 1) identifier.push(extraBlock);
					            if(value1){
					                if(World.getBlock(x,y,z).id!=0)
					                    arr.push(identifier);
					                }else{
					                    arr.push(identifier);
					                }
                }
            }
        } 
        FileTools.WriteJSON(__dir__+Dungeon.path+name+".dc", arr, value2)
    },
    save: function(name, x1, y1, z1, x2, y2, z2, c1, c2, c3, value1, value2, region){
        this.saveAtCoords(name, {x: x1, y: y1, z: z1}, {x: x2, y: y2, z: z2}, {x: c1, y: c2, z: c3}, value1, value2, region)
    }
};

EXPORT("DungeonCore", Dungeon);
EXPORT("ItemGenerate", ItemGenerate);
EXPORT("TypeEnchant", TYPE);
EXPORT("Utility", Utility);
//сохранение структуры
var firstClick = true;
var origin = {x:0, y:0, z:0};
var es = ModAPI.requireGlobal("Entity.isSneaking");
var coordinates=[{},{}];
IDRegistry.genItemID("debugToolsV2"); 
Item.createItem("debugToolsV2", "debug tool", {name: "axe", meta: 0}, {stack: 1, isTech: true});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){ 
    if(item.id == ItemID.debugToolsV2&&es(player)){ 
	      origin = coords;
        Game.message("установлен цент структуры");
    }else if(item.id == ItemID.debugToolsV2&&!es(player)){
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
var blockArray = [];
Callback.addCallback("NativeCommand", function(str){
    let cmd = str.split(" ");
    if(cmd[0] == "/tools"){
        Game.message("§2выдан инструмент");
        let coords = Entity.getPosition(Player.get());
        World.drop(coords.x, coords.y, coords.z, ItemID.debugToolsV2, 1);
        Game.prevent();
    }
    if(cmd[0] == "/structures"){
        if(cmd[1] == "write"){
            Game.prevent();
            for(x = Math.min(coordinates[0].x, coordinates[1].x); x<=Math.max(coordinates[0].x, coordinates[1].x);x++){
		             	for(z = Math.min(coordinates[0].z, coordinates[1].z); z<=Math.max(coordinates[0].z, coordinates[1].z);z++){
				              for(y = Math.min(coordinates[0].y, coordinates[1].y); y<=Math.max(coordinates[0].y, coordinates[1].y);y++){
				                  let b = BlockSource.getCurrentWorldGenRegion().getBlock(x, y, z);
				                  let xi = x - origin.x;
				                  let yi = y - origin.y;
				                  let zi = z - origin.z;
				                  let extraBlock = [];
				                  let eb = BlockSource.getCurrentWorldGenRegion().getExtraBlock(x, y, z);
				                  if(eb.id != 0){
				                      extraBlock = [Dungeon.isBlock(eb.id), eb.getNamedStatesScriptable()]
				                  }
					                 let identifier = [Dungeon.isBlock(b.id), b.data + "." + xi + "." + yi + "." + zi, b.getNamedStatesScriptable()];
					                 if(extraBlock.length >= 1) identifier.push(extraBlock);
					                if(cmd[4] == "false"){
					                if(World.getBlock(x,y,z).id!=0) blockArray.push(identifier);
					                }else{
					                blockArray.push(identifier);
					                }
                    }
                } 
            } 
            if(cmd[3]=="true"){
                FileTools.WriteJSON (__dir__+ Dungeon.path + cmd[2] + ".dc", blockArray, true);
            }else{
                FileTools.WriteJSON (__dir__+ Dungeon.path + cmd[2] + ".dc", blockArray, false);
            }
            
            Game.message("§2структура сохранена");
            blockArray = [];
        }
    }
});