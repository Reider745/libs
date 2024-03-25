function getNativeBlock(region, x, y, z){
	let injector = new Injector(region.getPointer()).setArgsType(["ptr"]);
	let pos = new BlockPos(x, y, z);
	let block = injector.getPointerResult("_ZNK11BlockSource8getBlockERK8BlockPos", [
		Parameter.getPointer(pos) 
	]);
	injector.free();
	pos.free();
	return block;
}

function getNativeEntity(region, x, y, z){
	let injector = new Injector(region.getPointer()).setArgsType(["int", "int", "int"])
	let actor = injector.getPointerResult("_ZN11BlockSource14getBlockEntityEiii", [
		Parameter.getInt(x),
		Parameter.getInt(y),
		Parameter.getInt(z) 
	]); 
	injector.free();
	return actor;
}

function _randomTick(block, x, y, z, region){
	let injector = new Injector(block).setArgsType(["ptr", "ptr", "ptr"]);
	let pos = new BlockPos(x, y, z);
	injector.call("_ZNK5Block10randomTickER11BlockSourceRK8BlockPosR6Random", [
		Parameter.getPointer(region.getPointer()),
		Parameter.getPointer(pos), 
		Parameter.getPointer(GlobalContext.getServerLevel().getRandom()) 
	]);
	pos.free();
	injector.free();
}

function randomTick(region, x, y, z){
	_randomTick(getNativeBlock(region, x, y, z), x, y, z, region);
}

function tick(actor, region){
	let injector = new Injector(actor).setArgsType(["ptr"]); 
	injector.call("_ZN10BlockActor4tickER11BlockSource", [ 
		Parameter.getPointer(region.getPointer()) 
	], "_ZTV10BlockActor"); 
	injector.free();
}


Game.isDedicatedServer = Game.isDedicatedServer || function(){
	return false;
};

//Для ZoteCoreLoader
if(Game.isDedicatedServer()){
	const Level = cn.nukkit.level.Level;
	
	getNativeEntity = function(region, x, y, z){
		return region.getPointer()
			.getBlock(x, y, z);
	}
	
	randomTick = function(region, x, y, z){
		region.getPointer()
			.getBlock(x, y, z)
			.onUpdate(Level.BLOCK_UPDATE_RANDOM);
	}
	
	tick = function(block, region){
		block.onUpdate(Level.BLOCK_UPDATE_NORMAL);
	}
}

function boost(region, pos, count, chance){
	count = count || 20;
	chance = chance || .2;
	
	Math.random() < chance && randomTick(region, pos.x, pos.y, pos.z);
	
	let actor = getNativeEntity(region, pos.x, pos.y, pos.z);
	if(actor != 0)
		for(let i = 0;i < count;i++)
			tick(actor, region);
		
	let tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, region);
	if(tile && tile.tick)
		for(let i = 0;i < count;i++)
			tile.tick();
}

EXPORT("boost", boost);