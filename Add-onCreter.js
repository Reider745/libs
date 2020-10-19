LIBRARY({
    name: "add-onCreter",
    version: 1, 
    api: "CoreEngine",
});
/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
let DB = __dir__+"/add-on/beh_pack/";
let DR = __dir__+"/add-on/res_pack/";
function addFile(path){
    if(!FileTools.isExists(path))
            FileTools.mkdir(path);
}

var Addons = {
    register: function(name){
        let name = name;
        if(!FileTools.isExists(__dir__+"/add-on"))
            FileTools.mkdir(__dir__+"/add-on");
        
        if(!FileTools.isExists(__dir__+"/add-on/beh_pack"))
            FileTools.mkdir(__dir__+"/add-on/beh_pack");
        
        if(!FileTools.isExists(__dir__+"/add-on/res_pack"))
            FileTools.mkdir(__dir__+"/add-on/res_pack");
        //создание аддона
        this.registerAddon = function(obj1, obj2){
            addFile(DB+name);
            addFile(DR+name);
            if(!FileTools.isExists(DB+name+"/pack_icon.png")){
                 FileTools.WriteImage(DB+name+"/pack_icon.png", FileTools.ReadImage(__dir__+"/mod_icon.png"));
            } 
            if(!FileTools.isExists(DR+name+"/pack_icon.png")){
                 FileTools.WriteImage(DR+name+"/pack_icon.png", FileTools.ReadImage(__dir__+"/mod_icon.png"));
            }
            let BM = {
                "format_version": 1,
                "header": {
                    "name": obj1.name || name,
                    "description": obj1.description||name,
                    "uuid": obj1.uuid1 || uuid(), 
                    "version": obj1.version || [0,0,1]
                }, 
                "modules": [
                    {
                        "description": obj1.name || name, 
                        "type": "data", 
                        "uuid": obj1.uuid2 || uuid(), 
                        "version": obj1.version || [0,0,1], 
                    }
                ], 
                 "dependencies": [
                     {
                         "uuid": obj1.uuid3 || uuid(), 
                         "version": obj1.version || [0,0,1]
                     }
                 ]
            };
            if(!FileTools.isExists(DB+name+"/manifest.json"))
                FileTools.WriteJSON(DB+name+"/manifest.json", BM, true);
             
            let RM = {
                "format_version": 1,
                "header": {
                    "name": obj2.name || name,
                    "description": obj2.description||name,
                    "uuid": obj2.uuid1 || uuid(), 
                    "version": obj2.version || [0,0,1]
                }, 
                "modules": [
                    {
                        "description": obj2.name || name, 
                        "type": "resources", 
                        "uuid": obj2.uuid2 || uuid(), 
                        "version": obj1.version || [0,0,1], 
                    }
                ], 
            };
            if(!FileTools.isExists(DR+name+"/manifest.json"))
                FileTools.WriteJSON(DR+name+"/manifest.json", RM, true);
        }
       
        //создание нового моба
        this.registerEntity = function(typ, obj){
            let BE = {};
            if(typ == "kind"){
            BE = {
                "format_version": "1.8.0",
                "minecraft:entity": {
                "description": {
                    "identifier": name+":"+obj.name,
                    "is_spawnable": obj.spawn||false,
                    "is_summonable": obj.summonable||true,
                    "is_experimental": false
                },
                "components": {
                    "minecraft:type_family": {
                       "family": obj.family||["armor_stand", "inanimate"]
                    },
                    "minecraft:collision_box": {
                        "width": obj.box.w || 1,
                        "height": obj.box.h || 1
                    },
                    "minecraft:health": {
                        "value": obj.health.value||obj.health.max,
                        "max": obj.health.max||20
                     },
                    "minecraft:loot": {
                        "table": "loot_tables/entities/"+obj.loot||"noy.json"
                    },
                   "minecraft:nameable": {
                    },
                     "minecraft:movement.basic": {

      },

      "minecraft:jump.static": {

      },
      "minecraft:movement": {

				"value": obj.speed||1

			}, "minecraft:behavior.random_stroll": {

        "priority": 1, 
        "speed_multiplier": obj.speed || 1
      },
       "minecraft:navigation.walk": {
        "is_amphibious": true, 
        "can_path_over_water": true, 
        "can_pass_doors": true, 
        "can_open_doors": false, 
        "avoid_damage_blocks": false 
     },
                   "minecraft:physics": {
                    }
                },
                "events": {
                }
                }
            };
            } 
            if(typ == "villager"){
                addFile(DR+name+"/trading");
            BE = {
                "format_version": "1.8.0",
                "minecraft:entity": {
                "description": {
                    "identifier": name+":"+obj.name,
                    "is_spawnable": obj.spawn||false,
                    "is_summonable": obj.summonable||true,
                    "is_experimental": false
                },
                "components": {
                    "minecraft:type_family": {
                       "family": obj.family||["armor_stand", "inanimate"]
                    },
                    "minecraft:collision_box": {
                        "width": obj.box.w || 1,
                        "height": obj.box.h || 1
                    },
                    "minecraft:health": {
                        "value": obj.health.value||obj.health.max,
                        "max": obj.health.max||20
                     },
                    "minecraft:loot": {
                        "table": "loot_tables/entities/"+obj.loot||"noy.json"
                    },
                   "minecraft:nameable": {
                    },
                     "minecraft:movement.basic": {

      },
      "minecraft:trade_table": {
          "display_name": obj.trade.name,
          "table": "trading/"+obj.trade.name+".json", 
          "convert_trades_economy": true
      }, 
      "minecraft:jump.static": {

      },
      "minecraft:movement": {

				"value": obj.speed||1

			}, "minecraft:behavior.random_stroll": {

        "priority": 1, 
        "speed_multiplier": obj.speed || 1
      },
       "minecraft:navigation.walk": {
        "is_amphibious": true, 
        "can_path_over_water": true, 
        "can_pass_doors": true, 
        "can_open_doors": false, 
        "avoid_damage_blocks": false 
     },
                   "minecraft:physics": {
                    }
                },
                "events": {
                }
                }
            };
            } 
            if(typ == "aggressive"){
            BE = {
                "format_version": "1.8.0",
                "minecraft:entity": {
                "description": {
                    "identifier": name+":"+obj.name,
                    "is_spawnable": obj.spawn||false,
                    "is_summonable": obj.summonable||true,
                    "is_experimental": false
                },
                "components": {
                    "minecraft:type_family": {
                       "family": obj.family||["armor_stand", "inanimate"]
                    },
                    "minecraft:collision_box": {
                        "width": obj.box.w || 1,
                        "height": obj.box.h || 1
                    },
                    "minecraft:silverfish_angry": {
                        "minecraft:angry": {
                            "duration": -1, 
                            "broadcastAnger": true,
                            "broadcastRange": obj.angry.range,
                            "calm_event": {
                           "event": "minecraft:on_calm",
                              "target": "self"
                            }
                           } 
                          },
                          "minecraft:behavior.random_stroll": {

        "priority": 1, 
        "speed_multiplier": obj.speed || 1
      },
       "minecraft:navigation.walk": {
        "is_amphibious": true, 
        "can_path_over_water": true, 
        "can_pass_doors": true, 
        "can_open_doors": false, 
        "avoid_damage_blocks": false 
     },
                    "minecraft:behavior.melee_attack": {
				                    "priority": 1,
				                    "speed_multiplier": obj.angry.speed,
				                    "track_target": true
			                    },
			               "minecraft:attack": {

			                   	"damage": obj.angry.damage

			               },
                    "minecraft:health": {
                        "value": obj.health.value||obj.health.max,
                        "max": obj.health.max||20
                     },
                    "minecraft:loot": {
                        "table": "loot_tables/entities/"+obj.loot||"noy.json"
                    },
                   "minecraft:nameable": {
                    },
                   "minecraft:behavior.random_stroll": {

        "priority": 1, 
        "speed_multiplier": obj.speed || 1
      },
      "minecraft:movement.basic": {

      },

      "minecraft:jump.static": {

      },
      "minecraft:movement": {

				"value": obj.speed||1

			},
       "minecraft:behavior.nearest_attackable_target": {
        "priority": 2,
        "entity_types": [
          {
            "filters": {  
                "any_of": obj.angry.attackable||[
                  { "test" :  "is_family", "subject" : "other", "value" :  "player"},

                  { "test" :  "is_family", "subject" : "other", "value" :  "snowgolem"},

                  { "test" :  "is_family", "subject" : "other", "value" :  "irongolem"}
                ]  
            },
            "max_dist": 8,
            "attack_interval": 10
          }
        ]
      },
                   "minecraft:physics": {
                    }
                  
                },
                "events": {
                }
                }
            };
            }
            addFile(DB+name+"/entities");
            FileTools.WriteJSON(DB+name+"/entities/"+obj.name+".entity.json", BE, true);
            
            addFile(DR+name+"/entity");
            addFile(DR+name+"/textures");
            addFile(DR+name+"/textures/entity");
            addFile(DR+name+"/materials");
            addFile(DR+name+"/animations");
            addFile(DR+name+"/models");
            addFile(DR+name+"/render_controllers");
            let RE1 = {
                "materials": {
                    "version": "1.0.0",

                }
            };
            if(!FileTools.isExists(DR+name+"/materials/entity.material"))
                 FileTools.WriteJSON(DR+name+"/materials/entity.material", RE1, true);
                 
            RE1 = FileTools.ReadJSON(DR+name+"/materials/entity.material");
            RE1.materials[obj.name+":entity_alphatest"] = {};
            FileTools.WriteJSON(DR+name+"/materials/entity.material", RE1, true);
            
            let RE2 = {
                "format_version": "1.8.0",
                "minecraft:client_entity": {
                "description": {
                  "identifier": name+":"+obj.name,
                  "materials": {
                    "default": obj.name,
                  },
                  "textures": {
                    "default": "textures/entity/"+obj.skin
                  },
                  "animations": obj.animation, 
                  "animation_controllers": obj.controller_animation, 
                  "geometry": {
                    "default": obj.geometry
                  },
                  "render_controllers": obj.renderControllers||["controller.render.default"],
                  "enable_attachables": true
                }
              }
            };
            FileTools.WriteJSON(DR+name+"/entity/"+obj.name+".entity.json", RE2, true);
            
            let RE3 = {
                "format_version": "1.8.0",
                "render_controllers": {
                  "controller.render.default": {
                    "geometry": "Geometry.default",
                    "materials": [
                      {
                        "*": "Material.default"
                      }
                    ],
                    "textures": [ "Texture.default"]
                  }
                }
            };
            if(!FileTools.isExists(DR+name+"/render_controllers/"+obj.name+".render_controllers.json"))
                FileTools.WriteJSON(DR+name+"/render_controllers/"+obj.name+".render_controllers.json", RE3, true);
            
        }
    }
};
EXPORT("Addons", Addons);