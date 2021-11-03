/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
LIBRARY({
	name: "RenderAPI",
	version: 1,
	shared: true,
	api: "CoreEngine"
});
let RenderAPI = {
	Model(){
		let boxes = {};
		this.addBoxByBlock = function(name, x1, y1, z1, x2, y2, z2, id, data){
			boxes[name || Object.keys(boxes).length] = {
				x1: x1,
				y1: y1,
				z1: z1,
				x2: x2 || x1,
				y2: y2 || y1,
				z2: z2 || z1,
				id: id || 1,
				data: data || 0
			};
		}
		this.getBoxes = function(){
			return boxes;
		}
		this.setBoxes = function(arr){
			boxes = arr;
		}
		this.getAllName = function(){
			return Object.keys(boxes);
		}
		this.getBlockRender = function(){
			let model = BlockRenderer.createModel(); 
			let keys = Object.keys(boxes);
			for(let i in keys)
				model.addBox(boxes[keys[i]].x1, boxes[keys[i]].y1, boxes[keys[i]].z1, boxes[keys[i]].x2, boxes[keys[i]].y2, boxes[keys[i]].z2, boxes[keys[i]].id, boxes[keys[i]].data);
			return model;
		}
		this.getCollisionShape = function(){
			let model = new ICRender.CollisionShape(); 
			let entry = model.addEntry();
			let keys = Object.keys(boxes);
			for(let i in keys)
				entry.addBox(boxes[keys[i]].x1, boxes[keys[i]].y1, boxes[keys[i]].z1, boxes[keys[i]].x2, boxes[keys[i]].y2, boxes[keys[i]].z2);
			return model;
		}
		this.getICRenderModel = function(){
			let render = new ICRender.Model(); 
			render.addEntry(this.getBlockRender());
			return render;
		}
		this.setBlockModel = function(id, data){
			data = data || -1
			BlockRenderer.setStaticICRender(id, data, this.getICRenderModel());
			BlockRenderer.setCustomCollisionAndRaycastShape(id, data, this.getCollisionShape())
		}
		this.copy = function(){
			let model = new RenderAPI.Model();
			model.setBoxes(JSON.parse(JSON.stringify(boxes)));
			return model;
		}
	},
	ModelAnimation(){
		let time = 40;
		let frame = 0;
		let start = new RenderAPI.Model();
		let end = new RenderAPI.Model();
		let update = {};
		
		this.setTime = function(tick){
			time = tick;
			frame = 0;
			update = this.getTransferFrame();
		}
		this.getTime = function(){
			return {
				time: time,
				frame: frame
			}
		}
		this.setModel = function(start_model, end_model){
			start = start_model;
			end = end_model || start_model;
			update = this.getTransferFrame();
		}
		this.replaceModel = function(){
			let model = end;
			end = start;
			start = model;
			update = this.getTransferFrame();
		}
		this.getTransferFrame = function(){
			let boxes = {};
			let names_start = start.getAllName();
			let names_end = end.getAllName();
			let start_boxes = start.getBoxes();
			let end_boxes = end.getBoxes();
			for(let i in names_end){
				let name = names_end[i];
				if(!start_boxes[name])
					continue;
				let box_start = start_boxes[name];
				let box_end = end_boxes[name];
				
				let arr = ["x1", "y1", "z1", "x2", "y2", "z2"];
				boxes[name] = {id: box_start.id, data: box_start.data};
				for(let ii in arr){
					let p = arr[ii];
					boxes[name][p] = (box_end[p] - box_start[p])/time;
				}
			}
			return boxes;
		}
		this.getModelByFrame = function(frame){
			let model = new RenderAPI.Model();
			let keys = Object.keys(update);
			for(let i in keys){
				let obj = update[keys[i]];
				let start_obj = start.getBoxes()[keys[i]];
				model.addBoxByBlock(keys[i], start_obj.x1 + (obj.x1*frame), start_obj.y1 + (obj.y1*frame), start_obj.z1 + (obj.z1*frame), start_obj.x2 + (obj.x2*frame), start_obj.y2 + (obj.y2*frame), start_obj.z2 + (obj.z2*frame), obj.id, obj.data);
			}
			return model;
		}
		this.play = function(x, y, z, infinite){
			let _this = this;
			Updatable.addUpdatable({
				tick: 0,
				update(){
					BlockRenderer.mapAtCoords(x, y, z, _this.getModelByFrame(this.tick).getICRenderModel());
					this.tick++;
					if(this.tick >= time){
						if(infinite){
							this.tick = 0;
							_this.replaceModel()
						}else{
							this.remove = true
						}
					}
				}
			})
		}
		this.updateModel = function(x, y, z, infinite){
			BlockRenderer.mapAtCoords(x, y, z, this.getModelByFrame(frame).getICRenderModel());
			frame++;
			if(frame >= time){
				frame = 0;
				if(infinite)
					this.replaceModel();
			}
		}
	}
};
EXPORT("RenderAPI", RenderAPI);
