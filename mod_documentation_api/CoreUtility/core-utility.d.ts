/// <reference path="./core-engine.d.ts"/>

declare interface IToolTip {
    /**
     * add tool tip item
     * @param id - id item
     * @param data - data item
     * @param name - add Tool tip
     */
    addToolTip(id: number, data: number, name: string): void;
    /**
     * add dynamic tool tip
     * @param id - id item
     * @param data - data item
     */
    addDynamicPre(id: number, data: number, func: (item: ItemInstance) => void): void;
    /**
     * add dynamic tool tip
     * @param id - id item
     * @param data - data item
     */
    addDynamicPost(id: number, data: number, func: (item: ItemInstance) => void): void;
    /**
     * add tool tips item
     * @param id - id item
     * @param data - data item
     * @param names - add Tool tips
     */
    addToolTips(id: number, data: number, names: string[]): void;
    /**
     * delete tool tip item
     * @param id - id item
     * @param data - data item
     * @param name - delete tool tip
     */
    deletToolTip(id: number, data: number, name: string): void;
    /**
     * will delete all tool tip items
     * @param id - id item
     * @param data - data item
     */
    clearToolTip(id: number, data: number): void;
    /**
     * will return all tool tip of the item
     * @param id - id item
     * @param data - data item
     */
    getToolTips(id: number, data: number): string[];
    /**
     * clear all tool tip
     */
    clearToolTips(): void;
}
declare var ToolTip: IToolTip;

/**
 * types of id conversion
 */
declare interface IConversionType {
    ITEM: number
    BLOCK: number
}
declare var ConversionType: IConversionType;

declare interface INativeAPI {
    /**
     * convert dynamic to static
     * @param id - dynamic id
     * @param type = type conversion
     */
    dynamicToStatic(id: number, type?: number): number;  
    /**
     * convert static to dynamic
     * @param id - dynamic id
     * @param type = type conversion
     */         
    staticToDynamic(id: number, type?: number): number;  
    /**
     * returns a unique identifier
     * @param ptr - pointer Actor
     */  
    getActorID(ptr: number): number;
    /**
     * returns Actor to unique identifier
     * @param ent - unique identifier
     */
    getActorById(ent: number): number;
}
declare var NativeAPI: INativeAPI;

declare class PointerClass {
    constructor(ptr: number);
    getPointer(): number;
}

declare class BlockPos extends PointerClass {
    constructor(ptr: number);
    constructor(x: number, y: number, z: number);
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
    free(): void;
}

declare class Vec3 extends PointerClass {
    constructor(ptr: number);
    constructor(x: number, y: number, z: number);
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
    free(): void;
}

declare class Vec2 extends PointerClass {
    constructor(ptr: number);
    constructor(x: number, y: number, z: number);
    getX(): number;
    getY(): number;
    setX(x: number): void;
    setY(y: number): void;
    free(): void;
}

declare class ChunkPos extends PointerClass {
    constructor(ptr: number);
    constructor(x: number, z: number);
    getX(): number;
    getZ(): number;
    setX(x: number): void;
    setZ(z: number): void;
    free(): void;
}

declare class Parameter {
    static getInt(value: number): Parameter;
    static getFloat(value: number): Parameter;
    static getBool(value: Boolean): Parameter;
    static getPointer(value: number): Parameter;
    static getPointer(value: PointerClass): Parameter;
}

declare class Offset {
    getInt(offset?: number): number;
    getPointer(offset?: number): number;
    getBool(offset?: number): number;
    getString(offset?: number): number;
    getFloat(offset?: number): number;
    setOffset(offset: number): void;
    free(): void;
}

declare class Injector {
    /**
     * create Injector
     * @param ptr - pointer c++ class
     */
    constructor();
    constructor(ptr: number);
    constructor(ptr: PointerClass);
    /**
     * get offset
     */
    setLib(name: String): Injector;
    /**
     * get offset
     */
    getOffset(): Offset;
    /**
     * get offset
     */
    getOffset(offset: number): Offset;
    /**
     * call c++ methot
     * @param symbol - methot symbol
     */
    call(symbol: string, args?: Parameter[], table?: string): Injector;
    /**
     * return Java Injector
     */
    getInjector(): any;
    /**
     * call c++ methot, return result int
     * @param symbol - methot symbol
     */
    getIntResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * call c++ methot, return result float
     * @param symbol - methot symbol
     */
    getFloatResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * call c++ methot, return result bool
     * @param symbol - methot symbol
     */
    getBoolResult(symbol: string, args?: Parameter[], table?: string): Boolean;
    /**
     * call c++ methot, return result string
     * @param symbol - methot symbol
     */
    getStringResult(symbol: string, args?: Parameter[], table?: string): string;
    /**
     * call c++ methot, return result pointer to class
     * @param symbol - methot symbol
     */
    getPointerResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * replaces a method in a class with another one
     * @param table - table methot
     * @param methot = replacement method
     * @param symbol - method to be replaced
     */
    replace(table: string, methot: string, symbol: string): void;
    /**
     * clears from memory
     */
    free(): void;
}

declare interface IItemsUtil {
    /**
     * return pointer Item
     * @param id - item id
     */
    getItemById(id: number): PointerClass;

    /**
     * replaces the name of an item
     * @param id - id item
     * @param data - data item
     * @param name - new name item
     */
    overrideName(id: number, data: number, name: string): void;
    overrideArmorValue(id: number, value: number): void;
}
declare var ItemsUtil: IItemsUtil;

declare class FileUtils {
    static deleteDirectory(path: string): void;
    static deleteDirectoryContents(path: string): void;
    static deleteEmptyDirectory(dir: string): void;
    static deleteFile(file: string): void;
    static renameDirectory(old_name: string, new_name: string): void;
    static renameFile(old_name: string, new_name: string): void;
    static copyDirectory(from: string, to: string): void; 
    static fileExists(file: string): boolean;
    static directoryExists(dir: string): boolean;    
    static isValidPath(path: string): boolean;
    static isRelativePath(path: string): boolean;
    static isExists(path_or_file: string): boolean;
    static createDirectory(path: string): void;
    static createDirectoryForFile(path: string): void;
}

export namespace World {
    function addWorldToCache(path: string);
    function updateWorlds();
    function getWorldsCount(path: string): number;
}

declare interface IEntityRegister {
    /**
     * add handler tick entity
     * @param name - string id entity (minecraft:zombie<>)
     * @param func 
     */
    setHandlerTick(name: string, func: (entity: number) => void);
}
declare var EntityRegister: IEntityRegister;

declare interface IGui {
    /**
     * plays block breaking animation
     * @param x - x coords
     * @param y - y coords
     * @param z - z coords
     */
    animationDestroy(x: number, y: number, z: number);
}
declare var Gui: IGui;

declare interface ITickingAreasManager {
    hasActiveAreas(): boolean;
    addArea(dimension: number, name: string, x: number, y: number, z: number, range: number): void;
    addAreaPostions(dimension: number, name: string, x: number, y: number, z: number, xx: number, yy: number, zz: number): void;
    addEntityArea(dimension: number, ent: number): void;
    countStandaloneTickingAreas(): number;
    countPendingAreas(dimension: number): number;
}
declare var TickingAreasManager: ITickingAreasManager;

declare class Random extends PointerClass {
    nextInt(max: number): number;
}
declare class NativeLevel extends PointerClass {
    getRandom(): Random;
}
declare class Dimension extends PointerClass {}
declare class Player extends PointerClass {}
declare class LocalPlayer extends Player {}
declare class ServerPlayer extends Player {}
declare class Options extends PointerClass {
    /**
     * returns the interface type
     */
    getUiProfile(): number;
}
declare class GuiData extends PointerClass {
    setTitle(text: string): void;
    setSubtitle(text: string): void;
    setActionMessage(text: string): void;
}
declare class ClientInstance extends PointerClass {
    setCameraEntity(entity: number): void;
    getOptions(): Options;
    getGuiData(): GuiData;
}

declare interface IGlobalContext {
    getClientInstance(): ClientInstance;
    getServerLevel(): NativeLevel;
    getLevel(): NativeLevel;
    getLocalPlayer(): LocalPlayer;
    getServerPlayer(): ServerPlayer;
    getDimension: Dimension;
}
declare var GlobalContext: IGlobalContext;
declare class IBlockLegacy extends PointerClass {

}
declare interface IBlockUtils {
    getBlockById(id: number): IBlockLegacy;
    getBlockStateForIdData(id: number, data: number): PointerClass;
}
declare var BlockUtils: IBlockUtils;

declare interface CoreUtilityAPI {
    BlockUtils: IBlockUtils,
    NativeAPI: INativeAPI,
    ConversionType: IConversionType,
    ToolTip: IToolTip,
    Injector: Injector,
    ItemsUtil: IItemsUtil,
    EntityRegister: IEntityRegister,
    Gui: IGui,
    TickingAreasManager: ITickingAreasManager,
    GlobalContext: IGlobalContext,
    Parameter: Parameter,
    BlockPos: BlockPos,
    Vec3: Vec3,
    Vec2: Vec2,
    ChuckPos: ChunkPos,
    FileUtils: FileUtils
    requireGlobal(cmd: string): any;
}

declare namespace ModAPI {
    export function addAPICallback(name: "CoreUtility", func: (api: CoreUtilityAPI) => void): void;
}