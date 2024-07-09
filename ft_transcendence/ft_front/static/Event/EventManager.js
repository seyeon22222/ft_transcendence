import { MouseEvent } from "./MouseEvent.js";
import { KeyboardEvent } from "./KeyboardEvent.js";
import { ScreenEvent } from "./ScreenEvent.js";

export class EventManager {
    static mouse_list = [];
    static key_list = [];
    static screen_list = [];

    static setEventMouse(ray, button, objects, id, ws) {
        EventManager.mouse_list.push(new MouseEvent('click', ray, button, objects));
        EventManager.mouse_list.push(new MouseEvent('mousemove', ray));
        EventManager.mouse_list.push(new MouseEvent('mouseup', ray, null, objects));
        EventManager.mouse_list.push(new MouseEvent('mousedown', ray));
        EventManager.mouse_list.push(new MouseEvent('start', null, null, objects, id, ws));
    }

    static setEventKeyboard(cam, ws) {
        EventManager.key_list.push(new KeyboardEvent('keydown', cam, ws));
        EventManager.key_list.push(new KeyboardEvent('keyup', cam, ws));
    }

    static setScreenEvent() {
        EventManager.screen_list.push(new ScreenEvent('resize'));
    }

    static deleteEvent(type) {
        if (type === 'mouse') {
            for (let i = 0; i < EventManager.mouse_list.length; i++)
                EventManager.mouse_list[i].destructor();
            EventManager.mouse_list = [];
            MouseEvent.resetMouseEvent();
        }
        else if (type === 'keyboard'){
            for (let i = 0; i < EventManager.key_list.length; i++)
                EventManager.key_list[i].destructor();
            EventManager.key_list = [];
        }
        else if (type === 'screen') {
            for (let i = 0; i < EventManager.screen_list.length; i++)
                EventManager.screen_list[i].destructor();
            EventManager.screen_list = [];
        }
    }
};