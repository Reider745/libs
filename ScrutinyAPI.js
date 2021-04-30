LIBRARY({
    name: "ScrutinyAPI",//имя библиотеки
    version: 1, 
    api: "CoreEngine",
});
/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода, за исключением имеени библиотеки(которое используется для импорта в мод)
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
    группа - https://vk.com/club186544580
*/
Saver.addSavesScope("Save.lib.ScrutinyAPI."+FileTools.ReadJSON(__dir__+"mod.info").name,
    function read(scope) {
        if(ScrutinyAPI.save) ScrutinyAPI.scrutiny = scope.save || {};
    },
    function save() {
        return {
            save: ScrutinyAPI.scrutiny,
        };
    }
);
Network.addClientPacket("SAPI.open", function(packetData) {
    ScrutinyAPI.getCont(packetData.p, packetData.n).openAs(ScrutinyAPI.getGui(packetData.p, packetData.n));
});

var ScrutinyAPI = {
    data: {},
    scrutiny: {},
    save: true,
    getStr: function(str, count){
        let chars = str.split("");
        let a = 1;
        for(let i in chars){
            if(i >= count * a){
                a++
                let arr = chars.splice(i, chars.length-1);
                chars.push("\n");
                for(let l in arr){
                    chars.push(arr[l]);
                }
            }
        }
        let string = "";
        for(let i in chars){
            string+=chars[i];
        }
        return string;
    },
    getGuiBook: function(obj, cont){
        let elem = {
            "close": {type: "closeButton", x: 930, y: 10, bitmap: "btn_close", scale: 3}
        };
        if(obj.left){
            let y=40;
            for(let i in obj.left){
                obj.left[i].type = obj.left[i].type || "text";
                obj.left[i].size = obj.left[i].size || 20;
                obj.left[i].chars = obj.left[i].chars || Math.floor(310 / (obj.left[i].size / 2));
                if(obj.left[i].type == "text"){
                    elem["textL"+i] = {type: "text", x: 50, y: y, text: ScrutinyAPI.getStr(obj.left[i].text, obj.left[i].chars), multiline: true, font: {size: obj.left[i].size, color: obj.left[i].color || android.graphics.Color.rgb(0, 0, 0), cursive: obj.left[i].cursive || false, bold: obj.left[i].bold || false, underline: obj.left[i].underline || false}};
                    y+=10+(obj.left[i].size*Math.ceil(obj.left[i].text.split("").length / obj.left[i].chars));
                }else if(obj.left[i].type == "slot"){
                    let ys = 0;
                    let x = 0;
                    for(let a in obj.left[i].slots){
                        obj.left[i].slots[a].size =obj.left[i].slots[a].size || 40; 
                        obj.left[i].slots[a].item = obj.left[i].slots[a].item || {};
                        obj.left[i].slots[a].item.id = obj.left[i].slots[a].item.id || 1;
                        obj.left[i].slots[a].item.data = obj.left[i].slots[a].item.data || 1;
                        elem["slotL"+i+a] = {type: "slot", x: 50+x, y: y, bitmap: obj.left[i].slots[a].bitmap||"_default_slot_empty", size: obj.left[i].slots[a].size,visual: true};
                        if(ys <= obj.left[i].slots[a].size) ys = obj.left[i].slots[a].size;
                        cont.setSlot("slotL"+i+a, obj.left[i].slots[a].item.id, 1, obj.left[i].slots[a].item.data, null);
                        x+=obj.left[i].slots[a].size;
                    }
                    y+=10+ys;
                }
            }
        }
        if(obj.right){
            let y=40;
            for(let i in obj.right){
                obj.right[i].type = obj.right[i].type || "text";
                obj.right[i].size = obj.right[i].size || 20;
                obj.right[i].chars = obj.right[i].chars || Math.floor(310 / (obj.right[i].size / 2));
                if(obj.right[i].type == "text"){
                    elem["textR"+i] = {type: "text", x: 550, y: y, text: ScrutinyAPI.getStr(obj.right[i].text, obj.right[i].chars), multiline: true, font: {size: obj.right[i].size, color: obj.right[i].color || android.graphics.Color.rgb(0, 0, 0), cursive: obj.right[i].cursive || false, bold: obj.right[i].bold || false, underline: obj.right[i].underline || false}};
                    y+=10+(obj.right[i].size*Math.ceil(obj.right[i].text.split("").length / obj.right[i].chars));
                }else if(obj.right[i].type == "slot"){
                    let ys = 0;
                    let x = 0;
                    for(let a in obj.right[i].slots){
                        obj.right[i].slots[a].size =obj.right[i].slots[a].size || 40; 
                        obj.right[i].slots[a].item = obj.right[i].slots[a].item || {};
                        obj.right[i].slots[a].item.id = obj.right[i].slots[a].item.id || 1;
                        obj.right[i].slots[a].item.data = obj.right[i].slots[a].item.data || 1;
                        elem["slotR"+i+a] = {type: "slot", x: 550+x, y: y, bitmap: obj.right[i].slots[a].bitmap||"_default_slot_empty", size: obj.right[i].slots[a].size, visual: true};
                        if(ys <= obj.right[i].slots[a].size) ys = obj.right[i].slots[a].size;
                        cont.setSlot("slotR"+i+a, obj.right[i].slots[a].item.id, 1, obj.right[i].slots[a].item.data, null);
                        x+=obj.right[i].slots[a].size;
                    }
                    y+=10+ys;
                }
            }
        }
        return new UI.StandartWindow({
            standart: {
                background: {
                   bitmap: obj.bitmap || "book_background",
                   color: android.graphics.Color.argb(256, 0, 0, 0),
                }
            },
            drawing: [],
            elements: elem
        });
    },
    register: function(name, obj){
        obj = obj || {};
        obj.player = {};
        obj.tab = {};
        this.data[name] = obj;
        this.scrutiny[name] = {};
    },
    addTab: function(window, name, obj){
        obj.drawing = [];
        obj.elements = {};
        obj.scrutiny = {};
        this.scrutiny[window][name] = {
            player: {}
        };
        obj.isVisual = obj.isVisual || function(player, window){
            return true;
        } 
        obj.item = obj.item || {};
        obj.item.id = obj.item.id || 0;
        obj.item.data = obj.item.data || 0;
        this.data[window].tab[name] = obj;
        if(obj.title){
            obj.elements["title"] = {
                type: "text", 
                x: 0, y: 0, 
                text: obj.title, 
                font: {size: 25}
            };
        }
    },
    addScrutiny: function(window, tab, name, obj){
        obj.bitmap = obj.bitmap || "classic_frame_bg_light_border";
        obj.bitmap2 = obj.bitmap2 || "workbench_frame3";
        obj.item.data = obj.item.data || 0;
        obj.item.b = obj.bitmap2;
        obj.size = obj.size || 85;
        obj.x = obj.x || 0;
        obj.y = obj.y+20 || 20;
        this.data[window].tab[tab].scrutiny[name] = obj.item;
        if(!obj.isVisual) obj.isVisual = [];
         this.data[window].tab[tab].elements["slot"+name+tab] = {
             type: "slot",
             bitmap: obj.bitmap,
             x: obj.x, 
             y: obj.y, 
             size: obj.size,
             visual: true,
             isV: obj.isVisual,
             line: obj.line || [],
             isDone: obj.isDone || obj.isVisual,
             clicker: {
                 onClick: function(position, cont, tileEntity, win, canvas, scale){
                     if(ScrutinyAPI.isScrutiny(Player.get(), window, tab, name)){
                         if(obj.bookPost) cont.openAs(ScrutinyAPI.getGuiBook(obj.bookPost, cont));
                     }else{
                         if(obj.bookPre) cont.openAs(ScrutinyAPI.getGuiBook(obj.bookPre, cont));
                     }
                 },
                 onLongClick: function(position, container, tileEntity, win, canvas, scale){
                     alert(name)
                 }
             }
         };
    },
    isScrutiny: function(player, window, tab, name){
        return this.scrutiny[window][tab].player[name];
    },
    giveScrutiny: function(player, window, tab, name, bool){
        bool = bool || false;
        if(!this.scrutiny[window]){
            this.scrutiny[window] = {};
        }
        if(!this.scrutiny[window][tab]){
            this.scrutiny[window][tab] = {
                player: {}
            };
        }
        if(bool){
            let obj = this.data[window].tab[tab].elements["slot"+name+tab];
            let arr = [];
            for(let i in obj.isDone){
                if(typeof obj.isDone[i] == "string"){
                    if(this.isScrutiny(player, window, tab, obj.isDone[i])){
                        arr.push(obj.isDone[i]);
                    }
                }else{
                    if(this.isScrutiny(player, window, obj.isDone[i].tab, obj.isDone[i].name)){
                        arr.push(obj.isDone[i]);
                    }
                }
            }
            if(JSON.stringify(arr) == JSON.stringify(obj.isDone) && !this.isScrutiny(player, window, tab, name)){
                this.scrutiny[window][tab].player[name] = true;
                return true;
            }else{
                return false;
            }
        }else{
            this.scrutiny[window][tab].player[name] = true;
            return true;
        }
    },
    createGui: function(player, name){
        var UITabbed = new UI.TabbedWindow({
            location: {
                width: this.data[name].width || 650,
                height: this.data[name].height || 350,
                x: this.data[name].x || (500 - ((this.data[name].width||650)/2)),
                y: this.data[name].y || 50
            },
            elements:{},
            drawing:[]
        });
        UITabbed.setBlockingBackground(true);
        let key = Object.keys(this.data[name].tab);
        for(let a in key){
            let obj = this.data[name].tab[key[a]];
            let keys = Object.keys(obj.scrutiny);
            let elem = {};
            let draw = [];
            let keysElem = Object.keys(obj.elements);
            for(let i in keysElem){
                let obj2 = obj.elements[keysElem[i]];
                let arr = [];
                for(let e in obj2.isV){
                    if(this.isScrutiny(player, name, key[a], obj2.isV[e])){
                        arr.push(obj2.isV[e]);
                    }
                    if(JSON.stringify(arr)==JSON.stringify(obj2.isV)){
                        elem[keysElem[i]] = obj.elements[keysElem[i]];
                        if(obj2.line){
                            for(let s in obj2.line){
                                let el = obj.elements["slot"+obj2.line[s]+key[a]];
                                draw.push({
                                    type: "line", 
                                    x1: el.x + (el.size / 2), 
                                    y1: el.y + (el.size / 2), 
                                    x2: obj2.x + (obj2.size / 2), 
                                    y2: obj2.y + (obj2.size / 2),
                                    width: 8
                                });
                            }
                        }
                    }
                } 
                if(obj2.isV){
                    if(obj2.isV.length <= 0){
                        elem[keysElem[i]] = obj.elements[keysElem[i]];
                        if(obj2.line){
                            for(let s in obj2.line){
                                let e = obj.elements["slot"+obj2.line[s]+key[a]];
                                draw.push({
                                    type: "line", 
                                    x1: e.x + (e.size / 2), 
                                    y1: e.y + (e.size / 2), 
                                    x2: obj2.x + (obj2.size / 2), 
                                    y2: obj2.y + (obj2.size / 2),
                                    width: 8
                                });
                            }
                        }
                    } 
                }else{
                    elem[keysElem[i]] = obj.elements[keysElem[i]];
                    if(obj2.line){
                        for(let s in obj2.line){
                            let e = obj.elements["slot"+obj2.line[s]+key[a]];
                            draw.push({
                                type: "line", 
                                x1: e.x + (e.size / 2), 
                                y1: e.y + (e.size / 2), 
                                x2: obj2.x + (obj2.size / 2), 
                                y2: obj2.y + (obj2.size / 2),
                                width: 8
                            });
                        }
                    }
                }
            }
            for(let i in keys){
                if(this.isScrutiny(player, name, key[a], keys[i])){
                    obj.elements["slot"+keys[i]+key[a]].bitmap = obj.scrutiny[keys[i]].b;
                }
                this.data[name].player[player].cont.setSlot("slot"+keys[i]+key[a], obj.scrutiny[keys[i]].id, 1, obj.scrutiny[keys[i]].data, null);
            }
            if(obj.isVisual(player, name)){
                UITabbed.setTab(obj.id, {
                    "image": {
                        type: "image", 
                        x: -30, 
                        y: -30, 
                        scale: 4,
                        bitmap: obj.imageTab || "_default_slot_empty"
                    }
                }, {
                    location: {
                        width: 0,
                        height: 0,
                        x: 150,
                        y: 50,
                        scrollY: obj.width || 250,
                        scrollX: obj.height || 500
                    },
                    drawing: draw,
                    elements: elem
                }, obj.isAlwaysSelected || false);
            }
        }
        return UITabbed;
    },
    getCont: function(player, name){
        if(!this.data[name].player[player]){
            this.data[name].player[player] = {};
            this.data[name].player[player].cont = new UI.Container();
            this.data[name].player[player].scrutiny = [];
            this.data[name].player[player].gui = this.createGui(player, name);
        }
        return this.data[name].player[player].cont;
    },
    getGui: function(player, name){
        if(!this.data[name].player[player]){
            this.data[name].player[player] = {};
            this.data[name].player[player].cont = new UI.Container();
            this.data[name].player[player].scrutiny = [];
        }
        this.data[name].player[player].gui = this.createGui(player, name);
        return this.data[name].player[player].gui;
    },
    open: function(player, name){
        let client = Network.getClientForPlayer(player);
        if(client){
            client.send("SAPI.open", {
                p: player,
                n: name
            }); 
        }
    },
    openClient: function(name){
        ScrutinyAPI.getCont(Player.get()).openAs(ScrutinyAPI.getGui(Player.get(), name));
    }
};
EXPORT("ScrutinyAPI", ScrutinyAPI);