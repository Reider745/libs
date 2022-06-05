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
	name: "RenderUtil",
	version: 4,
	shared: true,
	api: "CoreEngine"
});
let RenderAPI = {
	models: {},
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
			return this;
		}
		this.getBoxes = function(){
			return boxes;
		}
		this.setBoxes = function(arr){
			boxes = arr;
			return this;
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
				if(boxes[keys[i]].id !== 0)
					entry.addBox(boxes[keys[i]].x1, boxes[keys[i]].y1, boxes[keys[i]].z1, boxes[keys[i]].x2, boxes[keys[i]].y2, boxes[keys[i]].z2);
			return model;
		}
		this.getICRenderModel = function(){
			let render = new ICRender.Model(); 
			render.addEntry(this.getBlockRender());
			return render;
		}
		this.setBlockModel = function(id, data){
			RenderAPI.models[id+":"+data] = this.copy();
			data = data || -1
			BlockRenderer.setStaticICRender(id, data, this.getICRenderModel());
			BlockRenderer.setCustomCollisionAndRaycastShape(id, data, this.getCollisionShape())
			return this; 
		}
		this.copy = function(){
			let model = new RenderAPI.Model();
			model.setBoxes(JSON.parse(JSON.stringify(boxes)));
			return model;
		}
		this.getRenderMesh = function(){
			return RenderAPI.convertModel(this.getBlockRender());
		}
	},
	ModelAnimation(){
		let time = 40;
		let frame = 0;
		let start = new RenderAPI.Model();
		let end = new RenderAPI.Model();
		let update = {};
		let handler = {
			start(){},
			update(frame){},
			end(){}
		};
		
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
			handler.start();
			Updatable.addUpdatable({
				tick: 0,
				update(){
					BlockRenderer.mapAtCoords(x, y, z, _this.getModelByFrame(this.tick).getICRenderModel());
					handler.update(tick);
					this.tick++;
					if(this.tick >= time){
						if(infinite){
							this.tick = 0;
							_this.replaceModel();
							handler.end();
						}else{
							handler.end();
							this.remove = true
						}
					}
				}
			})
		}
		this.updateModel = function(x, y, z, infinite){
			if(frame == 0)
				handler.start();
			BlockRenderer.mapAtCoords(x, y, z, this.getModelByFrame(frame).getICRenderModel());
			handler.update(frame);
			frame++;
			if(frame >= time){
				frame = 0;
				handler.end();
				if(infinite)
					this.replaceModel();
			}
		}
		this.setHandler = function(obj){
			handler = {
				start: obj.start || function(){},
				update: update.end || function(frame){},
				end: obj.end || function(){},
			}
		}
	},
	Animation(model, obj){
		let keys = Object.keys(obj);
		for(let i in keys)
			keys[i] = parseInt(keys[i]);
		let arr = keys.sort(function(a, b){
			return a - b;
		});
		
		let time = 80;
		let tick = 0;
		let handler = {
			start(){},
			update(frame){},
			end(){}
		};
		
		this.setTime = function(time_anim){
			time = time_anim;
			tick = 0;
		}
		this.getTime = function(){
			return {
				time: time,
				frame: frame
			}
		}
		this.setAnimation = function(model2, obj){
			model = model2;
			let keys = Object.keys(obj);
			for(let i in keys)
				keys[i] = parseInt(keys[i]);
			arr = keys.sort(function(a, b){
				return a - b;
			});
		}
		this.getModels = function(tick){
			let t_p = 0;
			for(let i in arr){
				let t = arr[i];
				if(tick < t && tick >= t_p)
					return {
						pre: t_p == 0 ? model : obj[t_p],
						post: obj[t] || obj[t_p],
						time: t - t_p
					};
				else
					t_p = t;
			}
			return {
				pre: obj[arr[arr.length-1]],
				post: obj[arr[arr.length-1]],
				time: 1
			};
		}
		let animation = new RenderAPI.ModelAnimation();
		this.updateModel = function(x, y, z){
			if(tick == 0){
				let models = this.getModels(0);
				animation.setModel(model, models.post);
				animation.setTime(models.time);
				handler.start();
				let _this = this;
				animation.setHandler({
					end(){
						let models = _this.getModels(tick+1);
						animation.setModel(models.pre, models.post);
						animation.setTime(models.time);
					}
				})
			}
			animation.updateModel(x, y, z, false);
			handler.update(tick);
			tick++;
			let t = animation.getTime();
			if(tick >= time){
				handler.end();
				tick = 0
			}
		}
		this.play = function(x, y, z){
			let animation = new RenderAPI.ModelAnimation();
			let models = this.getModels(0);
			animation.setModel(model, models.post);
			animation.setTime(models.time);
			handler.start();
			let frame = 0;
			let _this = this;
			animation.setHandler({
				end(){
					let models = _this.getModels(frame+1);
					animation.setModel(models.pre, models.post);
					animation.setTime(models.time);
				}
			});
			Updatable.addUpdatable({
				update(){
					animation.updateModel(x, y, z, false);
					frame++;
					handler.update(frame);
					if(frame >= time){
						handler.end();
						this.remove = true;
					}
				}
			});
		}
		this.setHandler = function(obj){
			handler = {
				start: obj.start || function(){},
				update: update.end || function(frame){},
				end: obj.end || function(){},
			}
		}
	},
	getModelById(id, data){
		return this.models[id+":"+data];
	},
	isClick(x, y, z, box){
		if((x >= box.x1 && y >= box.y1 && z >= box.z1) && (x <= box.x2 && y <= box.y2 && z <= box.z2))
            return true;
        return false;
	},
	isClickBox(x, y, z, model, box_name){
		return this.isClick(x, y, z, model.getBoxes()[box_name]);
	},
	convertModel(model){
		return ItemModel.newStandalone().setModel(model).getItemRenderMesh(1, false);
	},
	meshCopy(org, mesh){
		mesh = mesh || new RenderMesh();
		let arr = org.getReadOnlyVertexData().vertices;
		uvs = org.getReadOnlyVertexData().uvs;
		size = (arr.length / 3);
		for(let i = 0;i < size;i++){
			mesh.addVertex(arr[i*3], arr[(i*3)+1], arr[(i*3)+2], uvs[(i*2)], uvs[(i*2)+1]);
			mesh.setNormal(arr[i*3], arr[(i*3)+1], arr[(i*3)+2])
		}
		return mesh;
	}
};
/*BlockRenderer.enableCoordMapping(98, -1, new RenderAPI.Model().addBoxByBlock(null, 0, 0, 0, .5, .5, .5).getICRenderModel())
let animation = new RenderAPI.Animation(new RenderAPI.Model().addBoxByBlock(null, 0, 0, 0, .5, .5, .5), {
	"25": new RenderAPI.Model().addBoxByBlock(null, 0, 0, .5, .5, .5, 1),
	"50": new RenderAPI.Model().addBoxByBlock(null, .5, 0, .5, 1, .5, 1),
	"75": new RenderAPI.Model().addBoxByBlock(null, .5, 0, 0, 1, .5, .5),
	"100": new RenderAPI.Model().addBoxByBlock(null, 0, 0, 0, .5, .5, .5)
});
animation.setTime(100);
Callback.addCallback("ItemUse", function(coords){
	animation.play(coords.x,coords.y,coords.z);
});*/
EXPORT("RenderUtil", RenderAPI);
