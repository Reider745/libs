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
     * Adding a few tooltips to item (this also includes blocks, upon registration, an item is also created for them).
     * @param id Item ID
     * @param data Item Data/Meta
     * @param names Array of tooltips to add
     */
    addToolTips(id: number, data: number, names: string[]): void;
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
     * Remove *all* overrided tooltips.
     */
    clearToolTips(): void;
    /**
     * Get every added to item tooltips.
     * @param id Item ID
     * @param data Item Data/Meta
     * @returns Array of tooltips
     */
    getToolTips(id: number, data: number): string[];
}
/**
 * Additional data that displayed below item name, such as amount of energy or it category.
 */
declare var ToolTip: IToolTip;

declare enum IConversionType {
    ITEM = 0,
    BLOCK = 1
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
    dynamicToStatic(id: number, type?: IConversionType): number;  
    /**
     * @param id Static Item ID
     * @param type Specified `ConversionType`
     * @returns Dynamic Item ID
     */         
    staticToDynamic(id: number, type?: IConversionType): number;  
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
    /**
     * Returns X coordinate from BlockPos reference (`offset = 0`).
     * @param ptr BlockPos pointer
     */
    getXBlockPos(ptr: number): number;
    /**
     * Returns Y coordinate from BlockPos reference (`offset = 4`).
     * @param ptr BlockPos pointer
     */
    getYBlockPos(ptr: number): number;
    /**
     * Returns Z coordinate from BlockPos reference (`offset = 8`).
     * @param ptr BlockPos pointer
     */
    getZBlockPos(ptr: number): number;
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
    /**
     * Creates native BlockPos by pointer or absolute coordinates.
     */
    constructor(...args: [ptr: number] | [x: number, y: number, z: number]);
    /**
     * Absolute X coordinate of block in world.
     */
    getX(): number;
    /**
     * Absolute Y coordinate of block in world.
     */
    getY(): number;
    /**
     * Absolute Z coordinate of block in world.
     */
    getZ(): number;
    /**
     * Changes block X coordinate in world, don't forget to apply on block instance.
     */
    setX(x: number): void;
    /**
     * Changes block Y coordinate in world, don't forget to apply on block instance.
     */
    setY(y: number): void;
     /**
     * Changes block Z coordinate in world, don't forget to apply on block instance.
     */
    setZ(z: number): void;
    /**
     * Frees memory, further interaction with this object is not available.
     */
    free(): void;
}

declare class Vec3 extends PointerClass {
    /**
     * Creates native Vec3 by pointer or vector.
     */
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
    /**
     * Creates native Vec2 by pointer or vector.
     */
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
   /**
     * Creates native ChunkPos by pointer or [chunk](https://minecraft.fandom.com/wiki/Chunk) location.
     * Chunks are 16 blocks wide, 16 blocks long, 256 blocks high, and 65,536 blocks total.
     */
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

/**
 * Handy class for faster access to argument conversion.
 * 
 * @example
 * Parameter.getPointer(GlobalContext.getServerLevel().getRandom());
 */
declare class Parameter {
    /**
     * Creates new integer argument (`type = "int"`).
     * @param value Integer
     */
    static getInt(value: number): Parameter;
    /**
     * Creates new float argument (`type = "float"`).
     * @param value Float
     */
    static getFloat(value: number): Parameter;
    /**
     * Creates new boolean argument (`type = "bool"`).
     * @param value Boolean
     */
    static getBool(value: boolean): Parameter;
    /**
     * Creates new pointer argument (`type = "ptr"`).
     * @param value Pointer
     */
    static getPointer(value: number): Parameter;
    /**
     * Creates new pointer argument (`type = "ptr"` with `getPointer()`).
     * @param value Pointer class
     */
    static getPointer(value: PointerClass): Parameter;
    /**
     * Creates new string argument (`type = "int"`).
     * @param value String
     */
    static getString(value: string): Parameter;
    /**
     * Creates new argument by specified type.
     * @param value To be converted
     * @param type Might be one of following
     * + int - `getInt`
     * + float - `getFloat`
     * + bool - `getBool`
     * + ptr - `getPointer`
     * + stl::string - `getString`\
     * Or tags that can be initiated by pointer
     * + BlockPos
     * + Vec2
     * + Vec3
     * + ChunkPos
     * + BlockSource
     * + CompoundTag
     */
    constructor(value: number | string, type: string);
    /**
     * Get integer value.
     */
    getInt(): number;
    /**
     * Get float value.
     */
    getFloat(): number;
    /**
     * Get pointer value.
     */
    getPointer(): number;
    /**
     * Get string value.
     */
    getString(): string;
    /**
     * Get value by specified in `constructor` type.
     */
    getValue(): any;
}

/**
 * Obtaining class fields by offset.\
 * See [StackOverflow](https://stackoverflow.com/questions/47598427/how-can-i-access-field-value-by-its-offset-in-c-sharp) for details.
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
     * @returns Pointer to offset
     */
    get(): number;
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
     */
    constructor(...args: [] | [ptr: number] | [ptr: PointerClass]);
    /**
     * Sets name of vanilla library where method is called from.
     */
    setLib(name: String): Injector;
    /**
     * Calls native method by symbol.
     * @param symbol Symbol
     */
    call(symbol: string, args?: Parameter[], table?: string): Injector;
    /**
     * Defines arguments to call native methods, call before each symbol argument definition.
     * @param types Parameters array, accepted now are
     * + stl::string
     * + int
     * + float
     * + ptr
     * + BlockPos
     * + Vec2
     * + Vec3
     * + ChunkPos
     */
    setArgsType(types: string[]): Injector;
    /**
     * Calls native method by symbol in preffered table.
     * @param symbol Symbol
     * @returns Integer result
     */
    getIntResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Calls native method by symbol in preffered table.
     * @param symbol Symbol
     * @returns Float result
     */
    getFloatResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Calls native method by symbol in preffered table.
     * @param symbol Symbol
     * @returns Boolean result
     */
    getBoolResult(symbol: string, args?: Parameter[], table?: string): boolean;
    /**
     * Calls native method by symbol in preffered table.
     * @param symbol Symbol
     * @returns String result
     */
    getStringResult(symbol: string, args?: Parameter[], table?: string): string;
    /**
     * Calls native method by symbol in preffered table.
     * @param symbol Symbol
     * @returns Pointer/ptr result
     */
    getPointerResult(symbol: string, args?: Parameter[], table?: string): number;
    /**
     * Replaces a method in a vtable with another one.
     * @param table Vtable
     * @param method In table to be replaced
     * @param symbol Replaced with
     * 
     * @example
     * let injector = new Injector(
     *     ItemsUtil.getItemById(
     *         NativeAPI.staticToDynamic(
     *             VanillaItemID.diamond
     *         )
     *     )
     * );
     * injector.replace("_ZTV4Item",
     *     "_ZNK4Item13getBlockShapeEv",
     *     "_ZNK9SkullItem13getBlockShapeEv");
     */
    replace(table: string, method: string, symbol: string): void;
    /**
     * Gets field data by offset, such as IDs, coordinates, and any other instance fields.
     * @param offset Predefined field offset
     * 
     * @example
     * let pos = new BlockPos(coords.x, coords.y, coords.z);
     * let injector = new Injector(pos);
     * let offset = injector.getOffset(4);
     * Game.tipMessage("Y: " + offset.getInt());
     * offset.free();
     * injector.free();
     * pos.free();
     */
    getData(offset?: number): Offset;
    /**
     * Frees memory, further interaction with this object is not available.
     */
    free(): void;
}

declare interface IItemsUtil {
    api: any;
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

export namespace BlockSource {
    function staticTest(player: number): BlockSource;
}

declare interface IEntityRegister {
    /**
     * Adds a tick handler to mob, where <> is additional data for mob age, etc.
     * @param name Entity Namespaced ID (e.g. minecraft:zombie<>)
     * @param func Every tick action
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
     */
    animationDestroy(x: number, y: number, z: number): void;
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
    constructor(ptr: number);
    /**
     * Random number generator based on world seed.
     * @returns Random Instance
     */
    getRandom(): Random;
    /**
     * Spawns namespaced entity by required source.
     * @param source Source to be spawn in
     * @param x Absolute X
     * @param y Absolute Y
     * @param z Absolute Z
     * @param namespace Entity, such as `minecraft:zombie<>`
     */
    addEntity(source: BlockSource, x: number, y: number, z: number, namespace: string): void;
    /**
     * Returns time offset (tick = 1/20s).
     */
    getCurrentTick(): number;
    /**
     * Returns server time offset (tick = 1/20s).
     */
    getCurrentServerTick(): number;
    /**
     * Returns tick range in world option.
     */
    getChunkTickRange(): number;
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
     * Currently, access to /title command data directly.
     */
    getGuiData(): GuiData;
    /**
     * Called by Minecraft before block breaked, emits particles.
     * @param x Block X
     * @param y Block Y
     * @param z Block Z
     * @param speed Speed, `1.0` - 20 ticks
     */
    renderDestroyBlock(x: number, y: number, z: number, speed: number): void;
}

declare interface IGlobalContext {
    api: any;
    /**
     * Client instance contains most of methods for handling user data.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getClientInstance()
     * );
     * injector.call("_ZNK14ClientInstance13useControllerEv");
     * injector.call("_ZNK14ClientInstance9grabMouseEv");
     * injector.free();
     */
    getClientInstance(): ClientInstance;
    /**
     * Server level instance for generation environment handling.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getServerLevel()
     * );
     * injector.setArgsType(["bool"]);
     * injector.call("_ZN11ServerLevel18setCommandsEnabledEb",
     *     [true]);
     * injector.free();
     */
    getServerLevel(): NativeLevel;
    /**
     * Client level instance for rendering environment handling, known local data about environment.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getLevel()
     * );
     * Game.message("Level Id: " +
     *     injector.getIntResult("_ZNK5Level10getLevelIdEv")
     * );
     * injector.free();
     */
    getLevel(): NativeLevel;
    /**
     * Access, for example, to player's interface, local states.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getLocalPlayer()
     * );
     * injector.setArgsType(["Vec3"]);
     * injector.call("_ZN11LocalPlayer4moveERK4Vec3",
     *     [new Vec3(0, 4, 0)]);
     * injector.free();
     */
    getLocalPlayer(): LocalPlayer;
    /**
     * Access to physics, as well as events taking place on server.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getServerPlayer()
     * );
     * injector.call("_ZN12ServerPlayer13openPortfolioEv");
     * injector.free();
     */
    getServerPlayer(): ServerPlayer;
    /**
     * Access to settings, dimension descriptor, generator and more.
     * 
     * @example
     * let injector = new Injector(
     *     GlobalContext.getDimension()
     * );
     * Game.message("Is Day Outside: " +
     *     injector.getBoolResult("_ZNK9Dimension5isDayEv")
     * );
     * injector.free();
     */
    getDimension(): Dimension;
}
/**
 * General classes for more convenient and quick access to them.
 */
declare var GlobalContext: IGlobalContext;

declare class IBlockLegacy extends PointerClass {
    /**
     * Creates native BlockLegacy instance by pointer, to be working with it.
     */
    constructor(ptr: number);
    addState(name: string, min: number, max: number): void;
    addState(name: string, min: number, max: number, base: number): void;
}

declare interface IBlockUtils {
    /**
     * Gets native LegacyBlock pointer for specified ID.
     * @param id Block ID
     * @returns Class represent pointer
     */
    getBlockById(id: number): IBlockLegacy;
    /**
     * Gets native BlockState pointer for specified ID & Data.
     * @param id Block ID
     * @param data Block Data/Meta
     * @returns Class represent pointer
     */
    getBlockStateForIdData(id: number, data: number): PointerClass;
}
declare var BlockUtils: IBlockUtils;

declare interface IBlockRegistry {
    api: any;
    /**
     * Registers a block with vanilla door functionality, some setup are required.
     * @param uid Named ID
     * @param name Block Name
     * @param texture Texture description
     * 
     * @example
     * Translation.addTranslation("tile.glass_door", {
     *     en: "Glass Door"
     * });
     * Translation.addTranslation("item.glass_door.name", {
     *     en: "Glass Door"
     * });
     * 
     * IDRegistry.genBlockID("glass_door");
     * BlockRegistry.registerDoorBlock("glass_door", "tile.glass_door", {
     *     name: "glass"
     * });
     * IDRegistry.genItemID("glass_door");
     * Item.createItem("glass_door", "item.glass_door.name", {
     *     name: "glass_door"
     * }, {
     *     stack: 16
     * });
     * 
     * Item.registerUseFunctionForID(ItemID.glass_door, function(coords, item, block, player) {
     *     let source = BlockSource.getDefaultForActor(player);
     *     source.setBlock(coords.x, coords.y + 1, coords.z,
     *         new BlockState(BlockID.glass_door, 0).addStates({
     *             open_bit: 0, direction: 0, door_hinge_bit: 0, upper_block_bit: 0, color: 0
     *         })
     *     );
     *     source.setBlock(coords.x, coords.y + 1, coords.z,
     *         new BlockState(BlockID.glass_door, 0).addStates({
     *             open_bit: 0, direction: 0, door_hinge_bit: 0, upper_block_bit: 1, color: 0
     *         })
     *     );
     * });
     */
    registerBlockDoor(uid: string, name: string, texture: { name: string, data?: number }): void;
}
declare var BlockRegistry: IBlockRegistry;

interface IScale {
    /**
     * Indicator name, such as `"water"` or `"hunger"`.
     */
    name: string;
    /**
     * Full scale texture name.
     */
    full: string;
    /**
     * Half scale texture name.
     */
    helf: string;
    /**
     * Empty scale texture name.
     */
    empty: string;
    /**
     * Indicator will be displayed above other indicators on left.
     */
    isLeft: boolean;
    /**
     * Scale counter will be started from start, otherwise, scale decreases.
     */
    isReset: boolean;
    /**
     * Scale is displayed, enabled by default.
     */
    isDisplay?: boolean;
}

class PlayerScale {
    constructor(ptr: number);
    /**
     * Returns halfes of scale amount.
     */
    getValue(): number;
    /**
     * Replaces halfes amount, maximum value is 20 in one row.
     * @param value Halfes
     */
    setValue(value: number): void;
    /**
     * Increases halfes counter, or decreases when value is negative.
     * @param value Addition halfes
     */
    addValue(value: number): void;
    /**
     * Sets default scale value, empty if `isReset`, full otherwise.
     */
    reset(): void;
    /**
     * Java class for that scale type.
     */
    getType(): any;
}

class Scale {
    constructor(java: any);
    /**
     * Sets scale is displayed on screen.
     * @param enabled Yeah or nope
     */
    setDisplay(enabled: boolean): this;
    /**
     * Scale is displayed for local player or not.
     */
    isDisplay(): boolean;
    /**
     * Java class.
     */
    get(): any;
}

declare interface IScales {
    /**
     * Registers new scale to indicate player states.
     * @param obj Scale descriptor
     * 
     * @example
     * const WATER_SCALE = Scales.register({
     *     name: "water",
     *     full: "water_when_full",
     *     helf: "water_when_half",
     *     empty: "water_when_empty",
     *     isLeft: true,
     *     isReset: false
     * });
     * WATER_SCALE.setDisplay(false);
     */
    register(obj: IScale): Scale;
    /**
     * Returns local player scale controller, value changers appear here.
     * @param player Actor UID
     * @param name Descriptor `name` property
     * 
     * @example
     * Scales.getScaleByPlayer(Player.get(), "water").addValue(2);
     */
    getScaleByPlayer(player: number, name: string): PlayerScale;
    /**
     * Determines if player in creative.
     * @param player Actor UID
     */
    isCreative(player: number): boolean;
}
declare var Scales: IScales;

declare interface CoreUtilityAPI {
    ToolTip: IToolTip,
    ConversionType: IConversionType,
    Injector: Injector,
    EntityRegister: IEntityRegister,
    NativeAPI: INativeAPI,
    ItemsUtil: IItemsUtil,
    FileUtils: FileUtils,
    Gui: IGui,
    TickingAreasManager: ITickingAreasManager,
    GlobalContext: IGlobalContext,
    Parameter: Parameter,
    BlockPos: BlockPos,
    Vec3: Vec3,
    Vec2: Vec2,
    ChuckPos: ChunkPos,
    BlockUtils: IBlockUtils,
    BlockRegistry: BlockRegistry,
    Scales: Scales,
    version: number,
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

declare namespace Callback {
    export function addCallback(name: "OnEnchant", func: (id: number) => void, priority?: number): void;
}
