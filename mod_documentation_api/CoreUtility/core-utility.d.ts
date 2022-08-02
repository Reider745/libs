/// <reference path="./core-engine.d.ts"/>

declare interface IToolTip {
    /**
     * Adding a tooltip to item (this also includes blocks, upon registration, an item is also created for them).
     * @param id Item ID
     * @param data Item Data/Meta
     * @param name Tooltip to add
     */
    addToolTip(id: number, data: number, name: string): void;
    /**
     * Adding a dynamic tooltip (before vanilla text).
     * @param id Item ID
     * @param data Item Data/Meta
     */
    addDynamicPre(id: number, data: number, func: (item: ItemInstance) => void): void;
    /**
     * Adding a dynamic tooltip (after vanilla text).
     * @param id Item ID
     * @param data Item Data/Meta
     */
    addDynamicPost(id: number, data: number, func: (item: ItemInstance) => void): void;
    /**
     * Adding a few tooltips to item (this also includes blocks, upon registration, an item is also created for them).
     * @param id Item ID
     * @param data Item Data/Meta
     * @param names Array of tooltips to add
     */
    addToolTips(id: number, data: number, names: string[]): void;
    /**
     * Remove specified item tooltip.
     * @param id Item ID
     * @param data Item Data/Meta
     * @param name Tooltip
     */
    deletToolTip(id: number, data: number, name: string): void;
    /**
     * Remove all item tooltips.
     * @param id Item ID
     * @param data Item Data/Meta
     */
    clearToolTip(id: number, data: number): void;
    /**
     * Get every added to item tooltips.
     * @param id Item ID
     * @param data Item Data/Meta
     * @returns Array of tooltips
     */
    getToolTips(id: number, data: number): string[];
    /**
     * Clears __ALL__ added to items tooltips.
     */
    clearToolTips(): void;
}
/**
 * Additional data that displayed below item name, such as amount of energy or it category.
 */
declare var ToolTip: IToolTip;

declare interface IConversionType {
    ITEM: number
    BLOCK: number
}
/**
 * Conversion between runtime and static ids.
 */
declare var ConversionType: IConversionType;

declare interface INativeAPI {
    /**
     * @param id Dynamic Item ID
     * @param type Specified `ConversionType`
     * @returns Static Item ID
     */
    dynamicToStatic(id: number, type?: number): number;  
    /**
     * @param id Static Item ID
     * @param type Specified `ConversionType`
     * @returns Dynamic Item ID
     */         
    staticToDynamic(id: number, type?: number): number;  
    /**
     * @param ptr Actor pointer
     * @returns Unique identifier
     */  
    getActorID(ptr: number): number;
    /**
     * @param ent Unique identifier
     * @returns Actor pointer
     */
    getActorById(ent: number): number;
}
/**
 * Helper class for calling main methods for converting identifiers between runtime environment (runtime values) and script.
 */
declare var NativeAPI: INativeAPI;

declare class PointerClass {
    constructor(ptr: number);
    /**
     * Pointer to current class, see [short article of pointers](https://docs.microsoft.com/en-us/cpp/cpp/pointers-cpp) for details.
     */
    getPointer(): number;
}

declare class BlockPos extends PointerClass {
    constructor(...args: [ptr: number] | [x: number, y: number, z: number]);
    /**
     * Absolute X coordinate of block in world.
     * @returns Absolute X
     */
    getX(): number;
    /**
     * Absolute Y coordinate of block in world.
     * @returns Absolute Y
     */
    getY(): number;
    /**
     * Absolute Z coordinate of block in world.
     * @returns Absolute Z
     */
    getZ(): number;
    /**
     * Changes block X coordinate in world, don't forget to apply on block instance.
     * @param x Absolute X
     */
    setX(x: number): void;
    /**
     * Changes block Y coordinate in world, don't forget to apply on block instance.
     * @param y Absolute Y
     */
    setY(y: number): void;
     /**
     * Changes block Z coordinate in world, don't forget to apply on block instance.
     * @param z Absolute Z
     */
    setZ(z: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
     free(): void;
}

declare class Vec3 extends PointerClass {
    constructor(...args: [ptr: number] | [x: number, y: number, z: number]);
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
     free(): void;
}

declare class Vec2 extends PointerClass {
    constructor(...args: [ptr: number] | [x: number, y: number, z: number]);
    getX(): number;
    getY(): number;
    setX(x: number): void;
    setY(y: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
     free(): void;
}

declare class ChunkPos extends PointerClass {
    constructor(...args: [ptr: number] | [x: number, z: number]);
    getX(): number;
    getZ(): number;
    setX(x: number): void;
    setZ(z: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
     free(): void;
}

declare class Parameter {
    static getInt(value: number): Parameter;
    static getFloat(value: number): Parameter;
    static getBool(value: Boolean): Parameter;
    static getPointer(value: number): Parameter;
    static getPointer(value: PointerClass): Parameter;
}

/**
 * Obtaining class fields by offset, see [stackoverflow](https://stackoverflow.com/questions/47598427/how-can-i-access-field-value-by-its-offset-in-c-sharp) for details.
 */
declare class Offset {
    /**
     * Get an integer field by offset.
     * @returns Required field
     */
    getInt(offset?: number): number;
    /**
     * Get an pointer/ptr field by offset.
     * @returns Required field
     */
    getPointer(offset?: number): number;
    /**
     * Get an boolean field by offset.
     * @returns Required field
     */
    getBool(offset?: number): boolean;
    /**
     * Get an stl::string field by offset.
     * @returns Required field
     */
    getString(offset?: number): string;
    /**
     * Get an float field by offset.
     * @returns Required field
     */
    getFloat(offset?: number): number;
    /**
     * @param offset To be changed
     */
    setOffset(offset: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
    free(): void;
}

declare class Injector {
    /**
     * Injector designed to work with vanilla classes, it allows you to call methods and get values from them.
     * It is recommended to clean if subsequent use is not intended.
     * > Where can I find method symbol?\
     * [IDA Pro – Hex Rays](https://hex-rays.com/IDA-pro/) - Windows, Linux, macOS\
     * [Ghidra Software Reverse Engineering Framework](https://github.com/NationalSecurityAgency/ghidra) - Windows, Linux, macOS\
     * [Disassembler - Viewer, Dumper](https://play.google.com/store/apps/details?id=com.mcal.disassembler) - Android
     * @param args Instance pointer
     */
    constructor(...args: [] | [ptr: number] | [ptr: PointerClass]);
    /**
     * Sets name of vanilla library where method is called from.
     */
    setLib(name: String): Injector;
    /**
     * Offset of a class in a library, useful, for example, to find necessary disassembled code.
     * @param args Class offset if required
     * @returns Represent class
     */
    getOffset(...args: [] | [offset: number]): Offset;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     */
    call(symbol: string, args?: Parameter[], table?: string): Injector;
    /**
     * @returns Injector Java class
     */
    getInjector(): any;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     * @returns Integer result
     */
    getIntResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     * @returns Float result
     */
    getFloatResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     * @returns Boolean result
     */
    getBoolResult(symbol: string, args?: Parameter[], table?: string): Boolean;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     * @returns String result
     */
    getStringResult(symbol: string, args?: Parameter[], table?: string): string;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     * @returns Pointer/ptr result
     */
    getPointerResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Replaces a method in a class with another one.
     * @param vtable Method in vtable
     * @param method To replacement
     * @param symbol To be replaced with
     */
    replace(vtable: string, method: string, symbol: string): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
    free(): void;
}

declare interface IItemsUtil {
    /**
     * Returns Item instance to required ID.
     * @param id Item ID
     * @returns Class represent pointer
     */
    getItemById(id: number): PointerClass;
    /**
     * Replaces item or block name to required one.
     * @param id Item ID
     * @param data Item Data/Meta
     * @param name To replacement
     */
    overrideName(id: number, data: number, name: string): void;
    /**
     * Replaces armor protection amount.
     * @param id Item ID
     * @param value To replacement
     */
    overrideArmorValue(id: number, value: number): void;
}
declare var ItemsUtil: IItemsUtil;

/**
 * Native module for working with files, it simplifies working with a large number of content.
 */
declare class FileUtils {
    /**
     * Deletes entire folder with all contents.
     * @param path Directory path
     */
    static deleteDirectory(path: string): void;
    /**
     * Deletes only contents, leaving directory.
     * @param path Directory path
     */
    static deleteDirectoryContents(path: string): void;
    /**
     * Deletes directory if it empty.
     * @param dir Directory path
     */
    static deleteEmptyDirectory(dir: string): void;
    /**
     * Deletes a specified file.
     * @param file File path
     */
    static deleteFile(file: string): void;
    /**
     * Renames directory.
     * @param oldName Rename from
     * @param newName Rename to
     */
    static renameDirectory(oldName: string, newName: string): void;
    /**
     * Renames file.
     * @param oldName Rename from
     * @param newName Rename to
     */
    static renameFile(oldName: string, newName: string): void;
    /**
     * Copies entire folder, including files in it.
     * @param from Input directory
     * @param to Output directory
     */
    static copyDirectory(from: string, to: string): void;
    /**
     * Checks if a file exists.
     * @param dir File path
     * @returns Yeah or nope
     */
    static fileExists(file: string): boolean;
    /**
     * Checks if a folder exists.
     * @param dir Directory path
     * @returns Yeah or nope
     */
    static directoryExists(dir: string): boolean; 
    /**
     * Checks if path can contain a file or folder.
     * @param path Path to file or directory
     * @returns Yeah or nope
     */   
    static isValidPath(path: string): boolean;
    /**
     * Checks if path is relative to game folder.
     * @param path Path to file or directory
     * @returns Relative or not
     */
    static isRelativePath(path: string): boolean;
    /**
     * @param pathOrFile Path to file or directory
     * @returns Does anything exist?
     */
    static isExists(pathOrFile: string): boolean;
    /**
     * Mkdirs required directory.
     * @param path Directory path
     */
    static createDirectory(path: string): void;
    /**
     * Creates a directory where file that was in this path before is placed.
     * @param path Path to file or directory
     */
    static createDirectoryForFile(path: string): void;
}

/**
 * Manage world list, any path not provided by game itself can be added, such as worlds for a specific modpack.
 */
export namespace World {
    /**
     * Adds a path to world list.
     * @param path World path
     */
    function addWorldToCache(path: string);
    /**
     * Refreshes world list, use for visual update if game is already loaded.
     */
    function updateWorlds();
    /**
     * Returns number of worlds in list, only valid ones are taken into account, i.e. if world is damaged, it will not be included in this amount.
     * @param path World path
     * @returns Encounted worlds
     */
    function getWorldsCount(path: string): number;
}

declare interface IEntityRegister {
    /**
     * Adds a tick handler to mob, where <> is additional data for mob age, etc.
     * @param name Entity Namespaced ID (e.g. minecraft:zombie<>)
     * @param func Handler
     */
    setHandlerTick(name: string, func: (entity: number) => void);
}
declare var EntityRegister: IEntityRegister;

declare interface IGui {
    /**
     * Plays block breaking animation/particles at specified location.
     * @param x Block X
     * @param y Block Y
     * @param z Block Z
     * @param speed Speed
     */
    animationDestroy(x: number, y: number, z: number, speed: number): void;
}
declare var Gui: IGui;

declare interface ITickingAreasManager {
    /**
     * Checks if any ticking areas exist nor it availabled.
     * @returns Yeah or nope
     */
    hasActiveAreas(): boolean;
    /**
     * Adds a spherical ticking area with a specific radius around coordinates.
     * @param dimension Dimension ID
     * @param name To get by command
     * @param x Absolute X
     * @param y Absolute Y
     * @param z Absolute Z
     * @param range Radius around point
     */
    addArea(dimension: number, name: string, x: number, y: number, z: number, range: number): void;
    /**
     * Adds a box ticking area between coordinates.
     * @param dimension Dimension ID
     * @param name To get by command
     * @param x Point 1 Absolute X
     * @param y Point 1 Absolute Y
     * @param z Point 1 Absolute Z
     * @param xx Point 2 Absolute X
     * @param yy Point 2 Absolute Y
     * @param zz Point 2 Absolute Z
     */
    addAreaPostions(dimension: number, name: string, x: number, y: number, z: number, xx: number, yy: number, zz: number): void;
    /**
     * Adds an ticking area for a mob from a dimension, this means that mob will load area around itself, for example, this is how Ender Pearls work.
     * @param dimension Dimension ID
     * @param ent Actor identifier
     */
    addEntityArea(dimension: number, ent: number): void;
    /**
     * Returns number of ticking areas for whole world, they are added using commands, limited to 10.
     * @returns Encounted areas
     */
    countStandaloneTickingAreas(): number;
    /**
     * Returns number of pending ticking areas in a specific dimension.
     * @param dimension Dimension ID
     * @returns Encounted areas
     */
    countPendingAreas(dimension: number): number;
}
/**
 * [Ticking area](https://minecraft.fandom.com/wiki/Ticking_area) is a player-specified group of chunks that continues to be updated even when there is no player nearby. Because chunks remain active, processes such as growth, decay, spawning, movement, and redstone operations aren't suspended in them when no players are present, provided at least one player remains somewhere in dimension.
 * Used to manage predefined areas and create new ones.
 */
declare var TickingAreasManager: ITickingAreasManager;

declare class Random extends PointerClass {
    /**
     * See [`rand()`](https://cplusplus.com/reference/cstdlib/rand/) for details.
     * @param max Random max
     */
    nextInt(max: number): number;
}
declare class NativeLevel extends PointerClass {
    /**
     * Random number generator based on world seed.
     * @returns Random Instance
     */
    getRandom(): Random;
}
declare class Dimension extends PointerClass {}
declare class Player extends PointerClass {}
declare class LocalPlayer extends Player {}
declare class ServerPlayer extends Player {}
declare class Options extends PointerClass {
    /**
     * @returns Interface type (0 for pocket, 1 for standard)
     */
    getUiProfile(): number;
}
declare class GuiData extends PointerClass {
    /**
     * Displays a title message (equivalent `/title <actorUid> title`).
     * @param text Text
     */
    setTitle(text: string): void;
    /**
     * Displays a subtitle message (equivalent `/title <actorUid> subtitle`).
     * @param text Text
     */
    setSubtitle(text: string): void;
    /**
     * Displays an actionbar message (equivalent `/title <actorUid> actionbar`).
     * @param text Text
     */
    setActionMessage(text: string): void;
}
declare class ClientInstance extends PointerClass {
    /**
     * Setting player's camera on a specific mob is identical to calling `Player.setCameraEntity(ent)`.
     * @param entity To set local player camera
     */
    setCameraEntity(entity: number): void;
    /**
     * Access to user settings and change them. Remember to save them in case of interaction.
     */
    getOptions(): Options;
    /**
     * Currently, access to /title command data.
     */
    getGuiData(): GuiData;
}

declare interface IGlobalContext {
    /**
     * Client instance contains most of methods for handling user data.
     */
    getClientInstance(): ClientInstance;
    /**
     * Server level instance for generation environment handling.
     */
    getServerLevel(): NativeLevel;
    /**
     * Client level instance for rendering environment handling.
     */
    getLevel(): NativeLevel;
    /**
     * Access, for example, to player's interface.
     */
    getLocalPlayer(): LocalPlayer;
    /**
     * Access to physics, as well as events taking place on server.
     */
    getServerPlayer(): ServerPlayer;
    /**
     * Access to settings, dimension generator and more.
     */
    getDimension(): Dimension;
}
/**
 * General classes for more convenient and quick access to them.
 */
declare var GlobalContext: IGlobalContext;

declare class IBlockLegacy extends PointerClass {}
declare interface IBlockUtils {
    /**
     * Get LegacyBlock pointer for specified ID.
     * @param id Block ID
     * @returns Class represent pointer
     */
    getBlockById(id: number): IBlockLegacy;
    /**
     * Get BlockState pointer for specified ID & Data.
     * @param id Block ID
     * @param data Block Data/Meta
     * @returns Class represent pointer
     */
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
    FileUtils: FileUtils,
    /**
     * Performs requested action in context of core script, used to access specific fields.
     * @param cmd Eval in script
     * @returns What you required
     */
    requireGlobal(cmd: string): any;
}

declare namespace ModAPI {
    export function addAPICallback(name: "CoreUtility", func: (api: CoreUtilityAPI) => void): void;
}
