LIBRARY({
	name: "Scales",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

let ScalesJava = WRAP_JAVA("com.reider.scales.Scales");

Network.addClientPacket("scalees.setValue", function(data){
	ScalesJava.getScaleByPlayer(Player.get(), data.name).setValue(data.v);
}); 

Callback.addCallback("EntityDeath", function(entity){
	if(Network.getConnectedPlayers().indexOf(entity) != -1){
		let scales = ScalesJava.getScales();
		for(let i in scales){
			let name = scales[i];
			if(ScalesJava.getScaleByName(name).isReset)
				ScalesJava.getScaleByPlayer(entity, name).reset();
		}
	}
});

function PlayerScale(javaClass, player, name){
	this.getValue = function(){
		return javaClass.getValue();
	}
	this.setValue = function(v){
		let client = Network.getClientForPlayer(player);
		if(client)
			client.send("scalees.setValue", {
				name: name,
				v: v
			});
		return javaClass.setValue(v);
	}
	this.addValue = function(v){
		this.setValue(this.getValue()+v);
	}
	this.reset = function(){
		javaClass.reset();
	}
	this.getType = function(){
		return javaClass.getType();
	}
}

let Scales = {
	register(obj){
		ScalesJava.register(obj);
	},
	getScaleByPlayer(player, name){
		return new PlayerScale(ScalesJava.getScaleByPlayer(player, name), player, name);
	},
	isCreative(player, name){
		return new PlayerActor(player).getGameMode() == 0;
	}
};

Saver.addSavesScope("lib.scales",
    function read(scope){
        let players = Object.keys(scope.players);
		for(let i in players){
			let player = players[i];
			let scales = Object.keys(scope.players[player]);
			for(let j in scales){
				let scale = scales[j];
				ScalesJava.getScaleByPlayer(player, scale).setValue(scope.players[player][scale]);
			}
		}
    },
    function save(){
		let obj = {};
		let players = ScalesJava.getPlayers();
		for(let i in players){
			let player = players[i];
			let scales = ScalesJava.getScales();
			obj[player] = {};
			for(let j in scales){
				let scale = scales[j];
				obj[player][scale] = ScalesJava.getScaleByPlayer(player, scale).getValue();
			}
		}
        return {
            players: obj,
        }
    }
);

EXPORT("Scales", Scales);
