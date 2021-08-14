interface ClassData {
    [key: string]: number | string
}
interface CustomParameters {
    [key: string]: ClassData,
    noy: ClassData
}
interface ClassRegister {
    [key: string]: number | string,
    name?: number,
    aspectsNow?: string
}
interface ArmorData {
    [key: string]: number
}
interface TypeMagic {
    isDamage(ent: number, type: string, orgDmg: number, dmg: number, arm: ArmorData, packet: any): boolean;
    damage(ent: number, type: string, orgDmg: number, dmg: number, arm: ArmorData, packet: any);
}
interface Stick {
    id: number,
    time: number,
    bonus?: ClassData,
    scrutiny?: {
        name: string,
        tab?: string,
        window?: string
    }
    texture: {
        name: string,
        meta?: number
    }
    sound?: string
}
interface Icon {
    name: string,
    meta: number,
    id: number
}
interface PacketScroll {
    [key: string]: any,
    sroll: ItemInstance[],
    srollType: number,
    spellI: number,
    type: string,
    item: ItemInstance
}
interface SrollDefault {
    type: "function"
    compatiblility: number[],
    activate?: ClassData,
    time?: number,
    scrutiny?: {
        name: string,
        tab?: string,
        window?: string
    }
    setFunction(packet: PacketScroll);
    installation(player: number, item: ItemInstance)
}
interface SrollEvent {
    type: "event",
    event: string,
    using(packet: PacketScroll)
    installation(player: number, item: ItemInstance)
}
type Sroll = SrollDefault | SrollEvent;
interface ScrollDecor {

}
declare class AncientWonders {
    customParameter: CustomParameters;
    isParametersFunc: {[key: string]:{[key: string]:{is(player:number, data: ClassData, obj: ClassData, bonus: ClassData, i: number, name: string), message(player:number, data: ClassData, obj: ClassData, bonus: ClassData, i: number, name: string)}}}
    registerClass(data: ClassRegister);
    setPlayerClass(player: number, name: string);
    addParameterRegister(nameClass: string, nameParameter: string, min?: number, max?: number, visual?: {min?: number, max?: number});
    addAllClassParameter(nameParameter: string, min?: number, max?: number, visual?: {min?: number, max?: number});
    isParameterFunc();
    isParameters(player: number, obj: ClassData, message?: Boolean, bonus?: ClassData, func?: (name, value: number) => {});
    getDir(): string;
}
declare class MagicCore {
    using: {
        [key: string]: [name: string, value: number];
    }
    armorMagic: {
        [key: number]: {type: string, value: number}
    }
    armorType: {
        [key: string]: TypeMagic
    }
    setArmor(id: number, nameParameter: string, value: number);
    setUsingItem(item: ItemInstance, parameter: string, value: number);
    getAllClass(): {
        [key: string]: ClassData
    }
    getAllPlayerClass(): {
        [key: number]: ClassData
    }
    isClass(player: number): Boolean;
    isExistsClass(): Boolean;
    getValue(player: number): ClassData;
    setParameters(player: number, data: ClassData, boll: Boolean);
    registerArmorMagicType(type: string, obj: TypeMagic);
    setArmorMagic(id: number, type: string, value: number);
    getArmorMagic(ent: number): ArmorData;
    damage(ent: number, type: string, damage: number, packet?: any);
    setPlaceFunc(id: number, data: ClassData);
}
declare class Wands {
    stick: {[key: number]: Stick};
    icon: [Icon];
    addStick(obj: Stick);
    getStick(): Stick;
    addIcon(id: number, name: string, meta: number);
    addIconAll(name: string, meta: number);
    getIconArr(id: number): [Icon];
    addEvent(item: ItemInstance, player: number, name: string, packet: {});
    emitterEntity(entity: number, obj: {
        event: number,
        spells: ItemInstance[],
        packet: {}
    });
    setPrototype(id: number, obj: Sroll);
    getPrototype(id: number): Sroll;
    registerSrollDecoration(id: number): ScrollDecor;
    getSrollDecoration(id: number): ScrollDecor;
    isCompatibility(id1: number, id2: number): Boolean;
    addCompatibility(id1: number, id2: number);
    getArrByExtra(extar: ItemExtraData): ItemInstance[];
    getExtraByArr(arr: ItemInstance[]): ItemExtraData;
    addSpellSet(arr: ItemInstance[], name: string);
    addWandCreative(id: number, event: number, arr: ItemInstance[])
}
interface PacketEffect {
    coords: BlockPosition,
    player: number
}
declare class RitualAPI {
    partsType: {
        [key: string]: {
            func: (packet: PacketEffect) => void,
            time: number
        }
    }
    isRecipe(recipeInput: number[], arr: number[]);
    isRitual(name: string, x: number, y: number, z: number, region: BlockSource);
    addRecipe(RitualName: string, recipeName: string, arr: number[], data?: ClassData, partsType?: string[]);
    getRecipeRitualWorld(name: string, x: number, y: number, z: number, region: BlockSource): number[];
    clear(name: string, x: number, y: number, z: number, region: BlockSource);
    registerEffectType(type: string, func: (packet: PacketEffect) => void, time?: number);
    setRecipeEffect(RitualName: string, recipeName: string, arr: string[]);
    playPartTypes(arr: string[], packet: any): number;
    register(name: string, recipeViewer: {
        content: UI.WindowContent,
        title?: string,
        block?: number
    })
}
declare class BookAPI {
    draws: {[keys: string]: {[keys: string]: (data: ClassData, player: number, i: number, nameParameter: string) => string}}
    drawFunc(ClassName: string, parameterName: string, func: (data: ClassData, player: number, i: number, nameParameter: string) => string)
    getGui(player: number): UI.WindowContent;
    open(player: number);
}
declare class TranslationLoad {
    load(path: string, defaultLang: string)
}
declare class RenderAPI {
    SetAltar(id: number);
    setCauldron(id: number);
    setMagicController(id: number);
    setResearchTable(id: number);
    setSingularityShrinker(id: number);
    setSingularityExtractor(id: number);
    setTransmitter(id: number);
    serEmpty(id: number);
}

declare class APIAW {
    AncientWonders: AncientWonders;
    MagicCore: MagicCore;
    Wands: Wands;
    RitualAPI: RitualAPI;
    BookAPI: BookAPI;
    TranslationLoad: TranslationLoad;
    ItemGenerate: any;
    ItemGenerate2: any;
    Render: RenderAPI;
    ParticlesAPI: any;
    Mp: any;
    PlayerAC: any;
    SoundManager: any;
    EffectAPI: any;
    Bag: any;
    addScrut(window: string, tab: string, name: string, nameItem: string);
    delItem(player: number, item: ItemInstance);
    setTimeout(func: () => void, tick: number);
    requireGlobal(command: string);
    versionAPI: 6;
}