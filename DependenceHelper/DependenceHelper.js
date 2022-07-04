/*
Внимание!
Явное копирование или изменение кода запрещено.
Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
LIBRARY({
	name: "DependenceHelper",
	version: 2,
	shared: true,
	api: "CoreEngine"
});
Translation.addTranslation("Failed to launch mods", {
	ru: "Не удалось запустить моды",
});
Translation.addTranslation("Open list of not installed api", {
	ru: "Открыть список не установленных api",
});
Translation.addTranslation("Failed to launch the mod {name}, mods are required:", {
	ru: "Не удалось запустить мод {name}, требуются моды:",
});
let Information = null;
ModAPI.addAPICallback("ItemInformation", function(api){
	Information = api.ItemInformation;
});
//let Dialog = com.zhekasmirnov.innercore.api.log.DialogHelper;
let Builder = android.app.AlertDialog.Builder;
let Html = android.text.Html;
let UIUtils = com.zhekasmirnov.innercore.utils.UIUtils;
function DialogList(items){
	let builder = new Builder(UIUtils.getContext());
	this.show = function(){
		let keys = Object.keys(items);
		builder.setItems(keys, {
			onClick(dialog, i){
				UI.getContext().startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(items[keys[i]])));
			}
		});
		builder.show();
	}
}
function Dialog(title){
	let builder = new Builder(UIUtils.getContext());
	builder.setTitle(title);
	builder.setNeutralButton(Translation.translate("Open list of not installed api"), {
		onClick(){
			new DialogList(Dependence.urls).show();
		}
	});
	
	let html = "";
	
	this.addLine = function(message){
		if(html != "")
			html += "<br>";
		html += message;
	}
	
	this.getMessage = function(){
		return html;
	}
	
	this.show = function(){
		UIUtils.runOnUiThread({
			run(){
				builder.setMessage(Html.fromHtml(html));
				builder.show();
			}
		});
	}
}
let dependences = [];
function Dependence(name){
	this.mods = [];
	this.launch = function(){};
	this.loaded = {};
	this.unification = {};
	this.isLoader = {};
	this.customMessage = {};
	this.name = name;
	let self = this;
	this.addDependence = function(mod, url, unification, isLoader, customMessage){
		this.mods.push({name: mod, url: url});
		ModAPI.addAPICallback(mod, function(api){
			self.loaded[mod] = api;
			if(self.mods[mod])
				delete self.mods[mod];
		});
		this.unification[mod] = unification || function(input, result){
			let keys = Object.keys(input);
			for(let i in keys)
				result[keys[i]] = input[keys[i]];
		};
		this.isLoader[mod] = isLoader || function(api){
			return true;
		};
		this.customMessage[mod] = customMessage || function(api){
			return "• "+mod;
		};
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
			if(self.loaded[self.mods[i]] === undefined || !self.isLoader[keys[i]](self.loaded[self.mods[i]]))
				mods.push(keys[i]);
		if(mods.length == 0){
			if(Information != null)
				Information.startModLoad(self.name);
			let api = {};
			let keys = Object.keys(self.unification);
			for(let i in keys)
				self.unification[keys[i]](self.loaded[keys[i]], api);
			self.launch(self.loaded, api);
			if(Information != null)
				Information.endModLoad();
		}
		else if(is){
			dependences.push(this);
			is = false;
		}
	});
}
Dependence.urls = {};
Callback.addCallback("PostLoaded", function(){
	let dialog = new Dialog(Translation.translate("Failed to launch mods"));
	for(let i in dependences){
		let self = dependences[i];
		dialog.addLine(Translation.translate("Failed to launch the mod {name}, mods are required:").replace("{name}", self.name));
		let mods = dependences[i].self.mods;
		for(let j in mods){
			dialog.addLine(self.self.customMessage[mods[j].name](self.self.loaded[mods[j].name]));
			if(mods[j].url)
				Dependence.urls[mods[j].name] = mods[j].url;
		}
	}
	if(dialog.getMessage() != "")
		dialog.show();
});
EXPORT("Dependence", Dependence);