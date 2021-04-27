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
    getGuiBook: function(obj){
        let elem = {
            "close": {type: "closeButton", x: 930, y: 10, bitmap: "btn_close", scale: 3}
        };
        if(obj.left){
            let y=40;
            for(let i in obj.left){
                obj.left[i].size = obj.left[i].size || 20;
                obj.left[i].chars = obj.left[i].chars || Math.floor(310 / (obj.left[i].size / 2));
                elem["textL"+i] = {type: "text", x: 50, y: y, text: ScrutinyAPI.getStr(obj.left[i].text, obj.left[i].chars), multiline: true, font: {size: obj.left[i].size}};
                 y+=10+(obj.left[i].size*Math.ceil(obj.left[i].text.split("").length / obj.left[i].chars));
            }
        }
        if(obj.right){
            let y=40;
            for(let i in obj.right){
                obj.right[i].size = obj.right[i].size || 20;
                obj.right[i].chars = obj.right[i].chars || Math.floor(300 / (obj.right[i].size / 2));
                elem["textR"+i] = {type: "text", x: 550, y: y, text: ScrutinyAPI.getStr(obj.right[i].text, obj.right[i].chars), multiline: true, font: {size: obj.right[i].size}};
                 y+=10+(obj.right[i].size*Math.ceil(obj.right[i].text.split("").length / obj.right[i].chars));
            }
        }
        return new UI.StandartWindow({
            standart: {
                background: {
                   bitmap: "book_background",
                   color: android.graphics.Color.argb(256, 0, 0, 0),
                }
            },
            drawing: [],
            elements: elem
        });
    },
    register: function(name){
        this.data[name] = {
            player: {},
            tab: {},
        }
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
             clicker: {
                 onClick: function(position, container, tileEntity, win, canvas, scale){
                     if(ScrutinyAPI.isScrutiny(Player.get(), window, tab, name)){
                         if(obj.bookPost) container.openAs(ScrutinyAPI.getGuiBook(obj.bookPost));
                     }else{
                         if(obj.bookPre) container.openAs(ScrutinyAPI.getGuiBook(obj.bookPre));
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
    giveScrutiny: function(player, window, tab, name){
        if(!this.scrutiny[window]){
            this.scrutiny[window] = {};
        }
        if(!this.scrutiny[window][tab]){
            this.scrutiny[window][tab] = {
                player: {}
            };
        }
        this.scrutiny[window][tab].player[name] = true;
    },
    createGui: function(player, name){
        var UITabbed = new UI.TabbedWindow({
            location: {
                width: 650,
                height: 350,
                x: 150,
                y: 50,
            },
            elements:{},
            drawing:[]
        });
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
                        scale: 4.0,
                        bitmap: obj.imageTab
                    }
                }, {
                    drawing: draw,
                    elements: elem
                });
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