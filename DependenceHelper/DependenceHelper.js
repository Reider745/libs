/*
Внимание!
Явное копирование или изменение кода запрещено.
Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
LIBRARY({
	name: "DependenceHelper",
	version: 1,
	shared: true,
	api: "CoreEngine"
});
Translation.addTranslation("Failed to launch mods", {
	ru: "Не удалось запустить моды",
});
Translation.addTranslation("Failed to launch the mod {name}, mods are required:", {
	ru: "Не удалось запустить мод {name}, требуются моды:",
});
let Dialog = com.zhekasmirnov.innercore.api.log.DialogHelper;
let dependences = [];
function Dependence(name){
	this.mods = [];
	this.launch = function(){};
	this.loaded = {};
	this.name = name;
	let self = this;
	this.addDependence = function(mod){
		this.mods.push(mod);
		ModAPI.addAPICallback(mod, function(api){
			self.loaded[mod] = api;
		});
		return this;
	}
	this.setLaunch = function(func){
		this.launch = func;
		return this;
	}
	let is = true;
	Callback.addCallback("ModsLoaded", function(){
		let keys = Object.keys(self.loaded);
		let mods = [];
		for(let i in self.mods)
			if(self.loaded[self.mods[i]] === undefined)
				mods.push(keys[i]);
		if(mods.length == 0)
			self.launch(self.loaded);
		else if(is){
			dependences.push(this);
			is = false;
		}
	});
}
Callback.addCallback("PostLoaded", function(){
	let message = "";
	for(let i in dependences){
		let self = dependences[i];
		message+=Translation.translate("Failed to launch the mod {name}, mods are required:").replace("{name}", self.name)+"\n";
		for(let j in self.self.mods)
			message+=self.self.mods[j]+"\n";
	}
	if(message != "")
		Dialog.openFormattedDialog(message, Translation.translate("Failed to launch mods"));
});
EXPORT("Dependence", Dependence);