(function(){
	let size = 16;
	let name_model = "model";
	let texture_model = 1;
	let texture_data = 0;
	let RenderAPI = new Codec("codec-inner-core-model", {
		name: 'InnerCore Model',
		extension: 'js',
		remember: false,
		compile(options){
			let file = "//create Reider ___ size - "+size+"\nlet "+name_model+" = (function(obj, texture_default, data_default){\n\tobj = obj || {};\n\tconst texture = texture_default || "+texture_model+", data = data_default || "+texture_data+";\n\tlet model = new RenderUtil.Model();\n";
			let count = 0;
			let names = {};
			Outliner.root.forEach(obj => {
				if(obj.type == 'cube'){
					names[obj.name] = (names[obj.name]||0) + 1;
					const name = names[obj.name] == 1 ? obj.name : obj.name+"_"+names[obj.name];
					const org = obj.from;
					const scale = obj.to;
					file += "\tmodel.addBoxByBlock(\""+name+"\", "+del(org[0], size)+", "+del(org[1], size)+", "+del(org[2], size)+", "+del(scale[0], size)+", "+del(scale[1], size)+", "+del(scale[2], size)+", obj[\""+name+"\"] ? obj[\""+name+"\"].texture : texture, obj[\""+name+"\"] ? obj[\""+name+"\"].data : data);\n"
					count++;
				}else if(obj.type == "group"){
					file+="\n";
					file+="\t//group - "+obj.name+"\n";
					let group = getCubesByGroup(obj, names, count);
					file+=group.file;
					count+=group.count;
					file+="\n";
				}
			});
			file += "\treturn model;\n});//boxes - " + count;
			return file;
		}
	});

	function getCubesByGroup(obj, names, count){
		let file = "";
		if(obj.children.length > 0)
			obj.children.forEach(groupObj => {
				if(groupObj.type == 'cube'){
					names[groupObj.name] = (names[groupObj.name]||0) + 1;
					const name = names[groupObj.name] == 1 ? groupObj.name : groupObj.name+"_"+names[groupObj.name];
					const org = groupObj.from;
					const scale = groupObj.to;
					file += "\tmodel.addBoxByBlock(\""+name+"\", "+del(org[0], size)+", "+del(org[1], size)+", "+del(org[2], size)+", "+del(scale[0], size)+", "+del(scale[1], size)+", "+del(scale[2], size)+", obj[\""+name+"\"] ? obj[\""+name+"\"].texture : texture, obj[\""+name+"\"] ? obj[\""+name+"\"].data : data);\n"
					count++;
				}else if(groupObj.type == "group"){
					file+="\n";
					file+="\t//group - "+groupObj.name+"\n";
					let group = getCubesByGroup(groupObj, names, count, size);
					file+=group.file;
					count+=group.count;
					file+="\n";
				}
			});
		return {
			file: file,
			count: count
		};
	}

	function del(x1, x2){
		const x = x1/x2;
		if(x === Infinity || isNaN(x))
			return 0;
		return x;
	}

	let inner_format = new ModelFormat({
		id: "inner-core-model",
		name: "Inner Core Model",
		icon: 'accessibility',
		description: "inner core model",
		show_on_start_screen: true,
		rotate_cubes: false,
		display_mode: false,
		codec: RenderAPI
	});

	let save_dialog = new Dialog("save_dialog", {
		title: "Save",
		form: {
			size: {
				type: "input",
				label: "size",
				min: 16,
				placeholder: 16,
				value: 16
			},
			name: {
				type: "input",
				label: "model name",
				placeholder: "model",
				value: "model"
			},
			texture: {
				type: "input",
				label: "texture",
				placeholder: 1,
				value: 1
			},
			data: {
				type: "input",
				label: "data",
				placeholder: "0",
				value: "0"
			}
		},
		confirmEnabled: true,
		cancelEnabled: true,
		onConfirm(data){
			size = parseInt(data.size);
			name_model = data.name;
			texture_model = parseInt(data.texture) ? parseInt(data.texture) : "\""+data.texture+"\"";
			texture_data = parseInt(data.data);
			RenderAPI.export();
		} 
	});

	let save_model = new Action({
		id: 'inner-core-model',
		name: 'Save inner core model',
		icon: 'accessibility',
		description: '',
		category: 'filter',
		condition: () => Format.id == inner_format.id,
		click(ev){
			save_dialog.show();
		}
	});

	function load(){
		MenuBar.addAction(save_model, 'filter');
	}
	function unload(){
		save_model.delete();
	}
	function restart(){
		unload();
		load();
	}
	Plugin.register('inner-core-model', {
		title: 'Inner core model',  
		icon: 'accessibility',
		author: 'Reider ___',
	    description: '',
	    version: '1.0',
	    min_version: '3.7.5',
	    variant: 'both',
	    onload(){
			load();
	    },
	    onunload() {
	    	unload();
	    }
	});
})();