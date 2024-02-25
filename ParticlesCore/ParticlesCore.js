/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода
    4.Явное копирование правил 

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
LIBRARY({
	name: "ParticlesCore",
	version: 4,
	shared: true,
	api: "CoreEngine"
});

let radius_visable = 50; 

function uptPos(self, start, end, value){
	self.setPos(self.coords.x, start+((end-start)*value), self.coords.z);
	if(self.coords.y == end) self.restart = !self.restart;
}
let AnimationType = {
	VANILLA(obj){
		obj = obj || {};
		let time = obj.time || 130;
		let pos = obj.pos || .05;
		let funcs = [function(){
			this._tick_ = (this._tick_||0)+1;
			if(this._tick_ > time)
				this._tick_ = 0;
		}];
		if(obj.isRotation === undefined || obj.isRotation)
			funcs.push(function(){
				this.setItemRotation(0, (Math.PI * (360*(this._tick_ / time))) / 180, 0); 
			});
		if((obj.isPosition === undefined || obj.isPosition) && pos != 0)
			funcs.push(function(){
				this.start = this.start || this.coords.y-pos;
				this.end = this.end || this.coords.y+pos;
				let value = (this._tick_/2) / (time/2);
				if(this.restart)
					uptPos(this, this.end, this.start, value);
				else
					uptPos(this, this.start, this.end, value);
			});
		obj.tick = obj.tick || function(){};
		
		return function(){
			if(Entity.getDistanceBetweenCoords(this.coords, Player.getPosition()) > radius_visable)
				return;
			
			obj.tick.call(this);
			for(let i in funcs)
				funcs[i].call(this);
			this.refresh();
		};
	}
};

Callback.addCallback("LevelDisplayed", function(){
	Network.addClientPacket("api.particle", function(data){
		//if(Entity.getDimension(Player.get()) != data.d) return;
		Particles.addParticle(ParticlesStorage.get(data.p), data.x, data.y, data.z, data.vx||0, data.vy||0, data.vz||0);
	});
	Network.addClientPacket("api.particle_array", function(packet){
		//if(Entity.getDimension(Player.get()) != packet.d) return;
		for(let i in packet.arr){
			let data = packet.arr[i];
			Particles.addParticle(ParticlesStorage.get(data.type), data.x, data.y, data.z, data.vx||0, data.vy||0, data.vz||0);
		}
	});
});

Callback.addCallback("LevelLeft", function(){
	Network.addClientPacket("api.particle", function(data){});
	Network.addClientPacket("api.particle_array", function(packet){});
});

let ParticlesStorage = {
	ids: {},
	group: null,
	groups: {},
	add(textId, id){
		this.ids[textId] = id;
		if(this.group !== null) this.groups[this.group][textId] = id;
		return this;
	},
	get(textId){
		return this.ids[textId];
	},
	addToGroup(group, textId, id){
		this.setGroup(group);
		this.add(textId, id);
		this.setGroup(null);
		return this;
	},
	getToGroup(group, textId){
		return (this.groups[this.group]||{})[textId];
	},
	getAll(group){
		return Object.keys(this.groups[group]||{});
	},
	setGroup(name){
		this.groups[name] = {};
		this.group = name;
		return this;
	}
};

(function(){
	for(let key in Native.ParticleType)
		ParticlesStorage.add(key, Native.ParticleType[key]);
})();

function getVisibalePlayers(reg, x, y, z, r){
	return reg.fetchEntitiesInAABB(x - r, y - r, z - r, x + r, y + r, z + r, EEntityType.PLAYER, false)
}

function forEachClientVP(d, x, y, z, r, func){
	let players = getVisibalePlayers(d, x, y, z, r);
	for(let i in players){
		let client = Network.getClientForPlayer(players[i]);
		if(client)
			func(client)
	}
}

function min(x, y){
	if(y) return Math.min(x, y);
	return x;
}

function max(x, y){
	if(y) return Math.max(x, y);
	return x;
}

let abs = Math.abs;

let ParticlesCore = {
	getVector(pos1, pos2){
		return {
			x: pos2.x - pos1.x,
			y: pos2.y - pos1.y,
			z: pos2.z - pos1.z
		};
	},
	spawnParticle(region, type, x, y, z, vx, vy, vz){
		forEachClientVP(typeof region == "number" ? BlockSource.getDefaultForDimension(region) : region, x, y, z, radius_visable, function(client){
			client.send("api.particle", {
				p: type, 
				x: x, y: y, z: z,
				vx: vx, vy: vy, vz: vz
			})
		});
	},
	spawnParticles(region, arr, x, y, z, r){
		forEachClientVP(typeof region == "number" ? BlockSource.getDefaultForDimension(region) : region, x, y, z, r, function(client){
			client.send("api.particle_array", {
				arr: arr
			})
		});
	},
	spawnCoords(region, part, x1, y1, z1, x2, y2, z2, time){
		let vec = this.getVector({x: x1, y: y1, z: z1}, {x: x2, y: y2, z: z2});
		this.spawnParticle(region, part, x1, y1, z1, vec.x/time, vec.y/time, vec.z/time);
	},
	Group(){
		let particles = [];
		
		let maxX, minX;
		let maxY, minY;
		let maxZ, minZ;
		
		this.add = function(type, x, y, z, vx, vy, vz){
			minX = min(x, minX);
			maxX = max(x, maxX);
			
			minY = min(y, minY);
			maxY = max(y, maxY);
			
			minZ = min(z, minZ);
			maxZ = max(z, maxZ);
			
			particles.push({type: type, x: x, y: y, z: z, vx: vx, vy: vy, vz: vz});
			return this;
		}
		this.send = function(region){
			ParticlesCore.spawnParticles(region, particles, (maxX + minX) / 2, (maxY + minY) / 2, (maxZ + minZ) / 2, Math.max(abs(maxX) - abs(minX), maxY - minY, abs(maxZ) - abs(minZ)) / 2 + radius_visable);
		}
	},
	spawnLine(region, type, x1, y1, z1, x2, y2, z2, count){
		let group = new ParticlesCore.Group();
		for(let i = 0;i<=count;i++)
			group.add(type, x1 + (x2-x1) * (i / count), y1 + (y2-y1) * (i / count), z1 + (z2-z1) * (i / count));
    group.send(region);
	},
	GroupLine(){
		let particles = [];
		let pre;
		
		let maxX = 0, minX = 0;
		let maxY = 0, minY = 0;
		let maxZ = 0, minZ = 0;
		
		this.addPoint = function(x, y, z){
			minX = min(x, minX);
			maxX = max(x, maxX);
			
			minY = min(y, minY);
			maxY = max(y, maxY);
			
			minZ = min(z, minZ);
			maxZ = max(z, maxZ);
			
			pre = [x, y, z];
			return this;
		}
		this.add = function(type, count, x, y, z, vx, vy, vz){
			if(pre == undefined)
				return this;
			
			minX = Math.min(x);
			maxX = Math.max(x);
			
			minY = Math.min(y);
			maxY = Math.max(y);
			
			minZ = Math.min(z);
			maxZ = Math.max(z);
			
			for(let i = 0;i<=count;i++)
				particles.push({type: type, x: pre[0] + (x-pre[0]) * (i / count), y: pre[1] + (y-pre[1]) * (i / count), z: pre[2] + (z-pre[2]) * (i / count), vx: vx, vy: vy, vz: vz});
			pre = undefined;
			return this
		}
		this.addLine = function(type, count, x, y, z, vx, vy, vz){
			this.add.apply(this, arguments);
			this.addPoint.apply(this, [x, y, z]);
			return this;
		}
		this.send = function(region){
			ParticlesCore.spawnParticles(region, particles, (maxX + minX) / 2, (maxY + minY) / 2, (maxZ + minZ) / 2, Math.max(abs(maxX) - abs(minX), maxY - minY, abs(maxZ) - abs(minZ)) / 2 + radius_visable);
		}
	}
};

EXPORT("AnimationType", AnimationType);
EXPORT("ParticlesCore", ParticlesCore);
EXPORT("ParticlesStorage", ParticlesStorage);
EXPORT("getVisibalePlayers", getVisibalePlayers);