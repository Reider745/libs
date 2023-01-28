/// <reference path="./core-engine.d.ts"/>

declare namespace PageBuilder {
    class Type {
        mathSize(book: Book, page: Page, i: string, isLeft: boolean, data: any): void;
        endMathSize(book: Book, page: Page, i: string, isLeft: boolean, data: any): void;
        build(book: Book, page: Page, i: string, isLeft: boolean, data: any): void;
    }

    function getType(name: string): Type;
    function addType(name: string, type: any): Type;
}

declare class Page {

    setNextLink(name: string): Page;
    setPreLink(name: string): Page;

    addElement(isLeft: boolean, element: PageBuilder.Type): Page;
    addLeftElement(element: PageBuilder.Type): Page;
    addRightElement(element: PageBuilder.Type): Page;
    add(isLeft: boolean, name: string, ...args: any): Page;
    addLeft(name: string, ...args: any): Page;
    addRight(name: string, ...args: any): Page;

    open(book: Book): UI.Window;
    close(book: Book): Book;
}

declare class Book {
    constructor(name: string);

    addPage(name: string | "default", page: Page): Book;

    setDefaultPage(name: string): Book;

    openClient(page?: string): Book;

    open(player: number, page?: string): Book;

    registerItem(id: number): void;

    static get(name: string): Book;
}
declare namespace BookElements {
    namespace Style {
        class Text {
            cursive: boolean;
            color: [number, number, number];
            bold: boolean;
            underline: boolean;
            size: number;
            alignment: number;
            link: Nullable<string>;
            onClick: () => void;
            onLongClick: () => void;

            setCursive(value: boolean): Text;
            setColor(r: number, g: number, b: number): Text;
            setBold(value: boolean): Text;
            setUnderline(value: boolean): Text;
            setSize(size: number): Text;
            setAlignment(alignment: number): Text;
            setLink(name: string): Text;
            setOnClick(func: () => void): Text;
            setOnLongClick(func: () => void): Text;

        }

        class Slot {
            size: number;
            texture: string;
            item: ItemInstance;
            link: Nullable<string>;
            onClick: () => void;
            onLongClick: () => void;

            constructor(item: number | ItemInstance);
            setSize(size: number): Slot;
            setTexture(name: string): Slot;
            setLink(name: string): Text;
            setOnClick(func: () => void): Text;
            setOnLongClick(func: () => void): Text;
        }
    }

    class Text extends PageBuilder.Type {
        constructor(name: string, style: Style.Text);
    }

    class Slot extends PageBuilder.Type {
        constructor(slots: Style.Slot[]);
    }
}