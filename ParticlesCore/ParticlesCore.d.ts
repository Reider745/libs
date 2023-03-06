/// <reference path="./core-engine.d.ts"/>

declare namespace AnimationType {
    interface Description {
        time?: number;
        pos?: number;
        isRotation?: boolean;
        isPosition?: boolean;
        tick?: () => void;
    }
    function VANILLA(description?: Description): () => void;
}
declare namespace ParticlesStorage {
    function add(strId: string, id: number): void;
    function get(strId: string): Nullable<number>;
    function addToGroup(group: string, textId: string, id: number): void;
    function getToGroup(group: string, textId: string): Nullable<number>;
    function getAll(group: string): string[];
    function setGroup(name: Nullable<string>): void;
}
type Region = number | BlockSource;
declare namespace ParticlesCore {
    interface Particle {
        type: string;
        x: number;
        y: number;
        z: number
        vx?: number;
        vy?: number;
        vz: number;
    }

    function getVector(pos1: Vector3, pos2: Vector3): Vector3;
    function spawnParticle(region: Region, type: string, x: number, y: number, z: number, vx?: number, vy?: number, vz?: number): void;
    function spawnParticles(region: Region, arr: Particle[]): void;
    function spawnCoords(region: Region, part: string, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, time: number): void;
    function spawnLine(region: Region, type: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, count: number): void;

    class Group {
        public add(type: string, x: number, y: number, z: number, vx?: number, vy?: number, vz?: number): Group;
        public send(region: Region): void;
    }

    class GroupLine {
        public addPoint(x: number, y: number, z: number): GroupLine;
        public add(type: number, count: number, x: number, y: number, z: number, vx?: number, vy?: number, vz?: number): GroupLine;
        public addLine(type: number, count: number, x: number, y: number, z: number, vx?: number, vy?: number, vz?: number): GroupLine;
        public send(region: Region): void;
    }
}