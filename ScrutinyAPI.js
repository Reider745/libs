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
Saver.addSavesScope("Save.lib.ScrutinyAPI",
    function read(scope) {
        //ScrutinyAPI.scrutiny = scope.save || {};
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
    getGuiBook: function(obj){
        let elem = {
            "close": {type: "closeButton", x: 930, y: 10, bitmap: "btn_close", scale: 3}
        };
        if(obj.left){
        let arr = obj.left;
        let y = 40;
        for(let a in arr){
            arr[a].size = arr[a].size || 20;
            arr[a].chars = arr[a].chars || 25;
            let chars = arr[a].text.split("");
            let textLeft = "";
            for(let i = 0, c = 1;i < chars.length;i++){
                textLeft+=chars[i];
                if(i>=arr[a].chars*c){
                    c++;
                    elem["textC"+c+a] = {type: "text", x: 50, y: y, text: textLeft, font: {size: arr[a].size}};
                    y+=arr[a].size;
                    textLeft = "";
                }else if(i == chars.length){
                    elem["textC"+c+a] = {type: "text", x: 50, y: y, text: textLeft, font: {size: arr[a].size}};
                }
            }
            if(chars.length <= arr[a].chars){
                elem["text"+a] = {type: "text", x: 50, y: y, text: arr[a].text, font: {size: arr[a].size}};
            }
            y+=20+arr[a].size;
        }
        }
        if(obj.right){
        let arr = obj.right;
        let y = 40;
        for(let a in arr){
            arr[a].size = arr[a].size || 20;
            arr[a].chars = arr[a].chars || 25;
            let chars = arr[a].text.split("");
            let textLeft = "";
            for(let i = 0, c = 1;i < chars.length;i++){
                textLeft+=chars[i];
                if(i>=arr[a].chars*c){
                    c++;
                    elem["textRC"+c+a] = {type: "text", x: 550, y: y, text: textLeft, font: {size: arr[a].size}};
                    y+=arr[a].size;
                    textLeft = "";
                }else if(i == chars.length){
                    elem["textC"+c+a] = {type: "text", x: 550, y: y, text: textLeft, font: {size: arr[a].size}};
                }
            }
            if(chars.length <= arr[a].chars){
                    elem["textR"+a] = {type: "text", x: 550, y: y, text: arr[a].text, font: {size: arr[a].size}};
                }
            y+=20+arr[a].size;
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
        }
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
         this.data[window].tab[tab].elements["slot"+name+tab] = {
             type: "slot",
             bitmap: obj.bitmap,
             x: obj.x, 
             y: obj.y, 
             size: obj.size,
             visual: true,
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
         if(obj.line){
             for(let i in obj.line){
                 let elem = this.data[window].tab[tab].elements["slot"+obj.line[i]+tab];
                  this.data[window].tab[tab].drawing.push({
                     type: "line", 
                     x1: elem.x + (elem.size / 2), 
                     y1: elem.y + (elem.size / 2), 
                     x2: obj.x + (obj.size / 2), 
                     y2: obj.y + (obj.size / 2),
                     width: 8
                 });
             }
         }
    },
    isScrutiny: function(player, window, tab, name){
        return this.scrutiny[window][tab].player[name];
    },
    giveScrutiny: function(player, window, tab, name){
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
                    drawing: obj.drawing,
                    elements: obj.elements
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