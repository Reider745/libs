/// <reference path="./core-engine.d.ts"/>
declare class JavaStructure {

}
declare class BlockData {

}
declare namespace com {
    namespace zhekasmirnov {
        namespace apparatus {
            namespace adapter {
                namespace innercore {
                    namespace game {
                        namespace common {
                            class Vector3 {
                                constructor(x: number, y: number, z: number);
                                x: number;
                                y: number;
                                z: number;
                            }
                        }
                    }
                }
            }
        }
    }
}
type structure = String | JavaStructure;
declare interface ICopyPrototype {
    copyBlock(data: BlockData): BlockData;
    copyPrototype(prot: StructurePrototype): StructurePrototype
}
declare class StructurePool {
    constructor(name: string);
    put(name: String, stru: JavaStructure): StructurePool;
    get(name: string): JavaStructure;
    isLoad(name: string): boolean;
    deLoad(name: string): StructurePool;
    load(path: string, name: string, type?: string, compression?: boolean): void;
    loadRuntime(path: string, name: string, type?: string, compression?: boolean): void;
    copy(name: string, name2: string, prot?: ICopyPrototype): void;
    StructureAdvanced(name: string): Structure.advanced;
    registerRotations(name: structure, rotations: number[]): void;
    setGlobalPrototype(name: structure, prot: StructurePrototype);
}
declare namespace StructureLoader {
    function load(path: string, name: string, type?: string, compression?: boolean): void;
    function loadRuntime(path: string, name: string, type?: string, compression?: boolean): void;
    function isLoad(name: string): boolean;
    function getStructurePoolByName(): StructurePool;
    function save(path: string, name: string, type: string, compression: boolean): void;
    function deLoad(name: string): void;
}
declare interface IBonsaiPots {
    move: {
        x: number,
        y: number,
        z: number
    }
    drops: {
        id: number,
        data: number,
        chance: number,
        rolls: number
    }[]
}
declare namespace StructureIntegration {
    function registerTreeToBonsaiPots(sapling: ItemInstance, structure: structure, description: IBonsaiPots): void;
}
declare namespace ItemGeneration {
    function newGenerator(name: string): void;
    function addItem(name:string, id:number, random:number, count?:{min?:number,max?:number}, data?: number, extra?: ItemExtraData): void;
    function fill(name:string, x: number, y: number, z: number, random: java.util.Random, region: BlockSource, packet?: any): void;
    function registerRecipeViewer(generator:string,name:string): void;
    function getAllGenerator(): any;
    function getItems(name:string): any;
    function setItems(name:string, items: any): void;
    function isGenerator(name:string):boolean;
    function importFromFile(name: string, path: string): void;
    function setItemIntegration(id:number, random:number, count?:{min?:number,max?:number}, data?: number, extra?: ItemExtraData): void;
}

declare namespace StructureUtility {
    function newStructure(name: string, structure: BlockData[]): void;
    function getStructureByName(name: string): BlockData[];
    function getCountBlock(): number;
    function rotate(struc: structure, totate: number): JavaStructure;
    function registerRotationsRuntime(name: string, rotates?: number[]): void;
    function registerRotations(name: string, rotates?: number[]): void;
    function copy(name: string, name2: string, prot?: ICopyPrototype): void;
    function getStructureByPos(pos: {x: number, y: number, z: number}[], cen: {x: number, y: number, z: number}, value: boolean): BlockData[];
}
declare interface StructurePrototype {
    isBlock(original_pos: com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3, data: BlockData, region: BlockSource, packet:any): boolean;
    setBlock(original_pos: com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3, data: BlockData, region: BlockSource, packet:any): void;
    before(x: number, y: number, z: number, region: BlockSource, packet: any): void;
    after(x: number, y: number, z: number, region: BlockSource, packet: any): void;
}
declare namespace Structure {
    class advanced {
        setStructure(x:number, y:number, z:number, region:BlockSource, packet?:any): advanced;
        isStructure(x:number, y:number, z:number, region:BlockSource): void;
        isSetStructure(x:number, y:number, z:number, region:BlockSource): void;
        build(name:string, x:number, y:number, z:number, sleep:number, region:BlockSource, packet?:any): void;
        destroy(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): void;
        setUseGlobalPrototype(value: boolean):void;
        setProt(prot: StructurePrototype): void;
        getStructureJava(): JavaStructure;
        isUseGlobalPrototype(): boolean;
    }
    function setStructure(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): void;
    function set(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): void;
    function isStructure(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): boolean;
    function is(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): boolean;
    function isSetStructure(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): boolean;
    function isSet(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): boolean;
    function build(name:string, x:number, y:number, z:number, sleep:number, region:BlockSource, packet?:any): void;
    function destroy(name:string, x:number, y:number, z:number, region:BlockSource, packet?:any): void;
    function setGlobalPrototype(name:structure,prot:StructurePrototype): void;
}
declare interface IGenerationType {
    getPosition(chunkX: number, chunkZ: number, random: java.util.Random, dimension: number, region: BlockSource): com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3;
    getType(): string;
    isGeneration(pos: com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3, random: java.util.Random, dimension: number, region: BlockSource): boolean;
}
declare interface IGenerationDescription {
    getChance(): number;
    getDistance(): number;
    getName(): string;
    getStructure(): JavaStructure;
    getType(): string;
    isGeneration(pos: com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3, random:java.util.Random, dimension: number, region: BlockSource): boolean;
    isPoolStructure(pos: com.zhekasmirnov.apparatus.adapter.innercore.game.common.Vector3, random:java.util.Random, dimension: number,  region: BlockSource): boolean;
    isSet(): boolean;
}
declare namespace StructurePiece {
    function registerType(type: IGenerationType): void;
    function getDefault(obj: {
        type?: string,
        name?: string,
        offset?: {
            x?: number,
            y?: number,
            z?: number
        },
        chance?: number,
        distance?: number,
        save?: boolean,
        isSet?: boolean,
        dimension?: number,
        white_list?: boolean,
        biomes?: number[],
        white_list_blocks?: boolean,
        blocks?: number[],
        structure: Structure.advanced,
        checkName?: boolean
    }): IGenerationDescription;
    function register(description: IGenerationDescription): void
}
declare namespace StructureRotation {
    var DEFAULT: number, DEGREES_90: number, DEGREES_180: number, DEGREES_270: number, DEFAULT_DOWN: number, DEGREES_90_DOWN: number, DEGREES_180_DOWN: number, DEGREES_270_DOWN: number;
    function getAll(): number[];
    function getAllY(): number[];
    function getAllDown(): number[];
    function getRandomName(rotates: number[], random?: java.util.Random): string;
}