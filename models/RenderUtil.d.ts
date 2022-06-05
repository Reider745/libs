/// <reference path="./core-engine.d.ts"/>

declare namespace RenderUtil {
    interface Box {
        x1: number;
        y1: number;
        z1: number;
        x2: number;
        y2: number;
        z2: number;
        id: number | string;
        data: number;
    }
    class Model {
        addBoxByBlock(name:string, x1:number, y1:number, z1:number, x2:number, y2:number, z2:number, id:number, data:number): Model;
        getBoxes(): {[name: string]: Box};
        setBoxes(boxes: {[name: string]: Box});
        getAllName(): string[];
        getBlockRender(): BlockRenderer.Model;
        getCollisionShape(): ICRender.CollisionShape;
        getICRenderModel(): ICRender.Model;
        setBlockModel(id:number,data:number): Model;
        copy(): Model;
        getRenderMesh(): RenderMesh;
    }

    interface IHandlerAnimation {
        start(): void;
        update(frame: number): void;
        end(): void;
    }

    class ModelAnimation {
        setTime(tick: number): void;
        getTime(): number;
        setModel(start: Model, end: Model): void;
        replaceModel(): void;
        getTransferFrame(): any;
        getModelByFrame(frame: number): Model;
        play(x: number, y: number, z: number, infinite: boolean): void;
        updateModel(x: number, y: number, z: number, infinite: boolean): void;
        setHandler(handler: IHandlerAnimation): void;
    }

    class Animation {
        constructor(model: Model, obj: {[key: string]: Model});
        setTime(tick: number): void;
        getTime(): number;
        setAnimation(model: Model, obj: {[key: string]: Model}): void;
        getModels(tick:number):any;
        updateModel(x:number,y:number,z:number):void;
        play(x:number,y:number,z:number):void;
        setHandler(handler: IHandlerAnimation): void;
    }

    function getModelById(id: number, data: number): Model;
    function isClick(x: number, y: number, z: number, box: Box);
    function isClickBox(x: number, y: number, z: number, model: Model, name: string);
    function convertModel(model: any): any;
    function meshCopy(original: RenderMesh, mesh?:RenderMesh): RenderMesh;
}