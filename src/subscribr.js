module.exports = class Subscribr {

    constructor() {
        this._list = {};
        this._interceptors = [];
    }

    on(eventId, callback) {
        if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if (!callback || typeof callback !== 'function') throw new Error('Invalid handler');
        const handler = { callback, id: uniqueId() };
        if (eventId === '*') {
            this._interceptors.push(handler);
            return createCommonDestroyer(handler.id, this._interceptors);
        }
        if (!this._list[eventId]) this._list[eventId] = [];
        this._list[eventId].push(handler);
        return createEventDestroyer(handler.id, this._list, eventId);
    }

    one(eventId, callback) {
        if (!callback || typeof callback !== 'function') throw new Error('Invalid handler');
        const remover = this.on(eventId, params => {
            callback(params);
            remover();
        });
        return remover;
    }

    emit(eventId, params) {
        if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if (!this._list[eventId]) return;
        [ ...this._interceptors, ...this._list[eventId] ].forEach(handler => handler.callback(params));
    }

    listHandlers(eventId) {
        return this._list[eventId];
    }

    remove(eventId) {
        delete this._list[eventId];
    }

    get interceptors() {
        return this._interceptors.map(interceptor => ({ interceptor }));
    }

    get events() {
        return Object.keys(this._list).map(eventId => ({ eventId, handlers: this.listHandlers(eventId) }));
    }

    get all() {
        return [ ...this.interceptors, ...this.events ];
    }

}

const uniqueId = (() => {
    let idCounter = 0;
    return () => ++idCounter;
})();

function createCommonDestroyer(handlerId, arr) {
    return () => arr.splice(arr.findIndex(handler => handler.id === handlerId), 1);
}

function createEventDestroyer(handlerId, list, eventId) {
    const destroyer = createCommonDestroyer(handlerId, list[eventId]);
    return () => {
        destroyer();
        if(!list[eventId].length) delete list[eventId];
    }
}
