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
    /** 
     * все классы и их параметы
    */
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
/**
 * java класс
 */
declare class BlockPos {
    x: number;
    y: number;
    z: number;
}
declare class SingularityAPI {
    /**
     * 
     * @param name тип блока
     * @param x кордината блока
     * @param y кордината блока
     * @param z кордината блока
     * @param radius радиус поиска
     * @param region регион
     * @param noyBlock список блоков которые не будут находится, "x.y.z"
     */
    getOutputBlock(name: string, x: number, y: number, z: number, radius: number, region: BlockSource, noyBlock: string[])
    /**
     * 
     * @param name тип блока
     * @param x кордината блока
     * @param y кордината блока
     * @param z кордината блока
     * @param radius радиус поиска
     * @param region регион
     * @param noyBlock список блоков которые не будут находится, "x.y.z"
     */
    getInputBlock(name: string, x: number, y: number, z: number, radius: number, region: BlockSource, noyBlock: string[])
    /**
     * @param id id блока
     * @param name тип блока
     * @param value 
     */
    setBlockOutputName(id: number, name: string, value: Boolean)
    /**
     * @param id id блока
     * @param name тип блока
     * @param value 
     */
    setBlockInputName(id: number, name: string, value: Boolean)
    transfersBlock(tileEntity, tileEntity2, value: number, func: () => void)
    transfers(tileEntity, tileEntity2: any[], value: number, func: () => void)
}
interface ItemGenerateProt {
    isGenerate(slot, x, y, z, random, id, data, count, packet);
    setFunction(slot, x, y, z, random, id, data, count, packet);
    beforeGenerating(x, y, z, random, id, data, count, packet);
    afterGenerating(x, y, z, random, id, data, count, packet);
}
declare class ItemGenerate {
    generation: any[];
    Prototype: ItemGenerateProt;
    setPrototype(obj:ItemGenerateProt);
    addItem(id: number, random: number, count?: {min?: number, max?: number}, data?: number);
    fillChest(x: number, y: number, z: number, dimension: number, packet: any);
    fillChestSit(x: number, y: number, z: number, dimension: number, packet: any);
    setItems(arr: any[]);

}
declare class Mp {
    spawnParticle(type: number, x: number, y: number, z: number, vx?: number, vy?: number, vz?: number, ax?: number, ay?: number, az?: number)
}
declare class PlayerAC {
    message(player: number, text: string);
    setFly(player: number, value: boolean);
}
interface RegEffect {
    id: number;
    tick(ent: number, time: number, level: number);
    over(ent: number, level: number);
}
declare class EffectAPI {
    register(obj: RegEffect)
    clear(ent: number, id: string | number)
    add(ent: number, id: string, time: number, level: number)
    clearAll(ent: number)
    getEntity(ent: number)
}
declare class PotionAPI {

}
declare class ParticlesAPI {
    
}
interface BookScrutintext {
    type: "text",
    text: string,
    size: number
}
interface BookScrutinSlot {
    type: "slot",
    slots: {size: number, item: ItemInstance}[]
}
type BookScrutinyElements = BookScrutintext | BookScrutinSlot;
interface BookScrutiny {
    left: BookScrutinyElements[]
    right: BookScrutinyElements[]
}
declare class ScrutinyAPI {
    register(name: string, obj?: any);
    addTab(window: string, name: string, obj: {
        title: string,
        isVisual(player: number, window: string): Boolean;
        imageTab: string;
    });
    addScrutiny(window: string, tab: string, name: string, obj: {
        x: number,
        y: number,
        size: number,
        item: ItemInstance,
        line: string[],
        isDone: string[],
        isVisual: string[],
        bookPre: BookScrutiny,
        bookPost: BookScrutiny
    })
}
interface EntityPrototype {
    tick(ent: number);
    damage(attacker: number, ent: number, damageValue: number, damageType: number, someBool1: Boolean, someBool2: Boolean);
}
declare class EntityReg {
    setPrototype(id: string, obj: EntityPrototype);
    getPrototype(id: string): EntityPrototype;
}

declare class APIAW {
    AncientWonders: AncientWonders;
    MagicCore: MagicCore;
    Wands: Wands;
    RitualAPI: RitualAPI;
    BookAPI: BookAPI;
    TranslationLoad: TranslationLoad;
    SingularityAPI: SingularityAPI;
    PotionAPI: PotionAPI;
    ItemGenerate: ItemGenerate;
    ItemGenerate2: ItemGenerate;
    Render: RenderAPI;
    ParticlesAPI: ParticlesAPI;
    ScrutinyAPI: ScrutinyAPI;
    Mp: Mp;
    PlayerAC: PlayerAC;
    SoundManager: any;
    EffectAPI: EffectAPI;
    Bag: any;
    EntityReg: EntityReg;
    addScrut(window: string, tab: string, name: string, nameItem: string);
    delItem(player: number, item: ItemInstance);
    setTimeout(func: () => void, tick: number);
    requireGlobal(command: string);
    AW: {
        typeDamage: {
            magic: "magic",
            dead: "dead"
        },
        srollEvent: {
            useBlock: number,
            usePlayer: number,
            useMob: number
        },
        creativeGroup: {
            rune: "rune",
            wand: "wand",
            eventSroll: "events",
            srolls: "sroll",
            decorSroll: "decor"
        }
    }
    versionAPI: 7;
}