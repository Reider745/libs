let swells = {};

Callback.addCallback("CreeperTick", function(ctr, creeper){
	let time = swells[NativeAPI.getActorID(creeper)];
	if(time)
		new Injector(creeper)
			.setArgsType(["int"])
			.call("_ZN7Creeper9_setSwellEi", [
				Parameter.getInt(time)
			])
			.free();
});

Callback.addCallback("EntityRemoved", function(ent){
	if(swells[ent])
		delete swells[ent];
});

function setSwell(ent, time){
	swells[ent] = time;
}

function creeper_animation_client(creeper, time, max, func){
	let step = max / time;
	Updatable.addLocalUpdatable({
		tick: 0,
		update(){
			this.tick++;
			
			if(this.tick > time || !Entity.isExist(creeper)){
				this.remove = true;
				return func();
			} 
			
			setSwell(creeper, this.tick * step);
		}
	});
}

Network.addClientPacket("ce.creeper_animation", function(p){
	creeper_animation_client(p.ent, p.time, p.max, function(){
		
	});
});

Network.addClientPacket("ce.setSwell", function(p){
	setSwell(p.mob, p.time);
});


EXPORT("creeper_setSwell", function(mob, time){
	try{
		Network.sendToAllClients("ce.setSwell", {
			mob: mob,
			time: time
		});
	}catch(e){
		setSwell(mob, time);
	}
});
EXPORT("creeper_animation", function(ent, time, max, func){
	try{
		Network.sendToAllClients("ce.creeper_animation", {
			ent: ent,
			time: time,
			max: max
		});
	
		if(func)
			Updatable.addUpdatable({
				tick: 0,
				update(){
					this.tick++;
					if(this.tick > time){
						this.remove = true;
						func();
					}
				}
			});
	}catch(e){
		creeper_animation_client(ent, time, max, func||function(){});
	}
	
});