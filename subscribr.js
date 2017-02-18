/* Subscribr, a tiny event subscriber. */
module.exports = class Subscribr {

    constructor() {
        this._list = {};
        this._interceptors = [];
    }

    on(eventId, handler) {
        if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if (!handler || typeof handler !== 'function') throw new Error('Invalid handler');
        if (eventId === '*') return addInterceptor(this._interceptors, handler);
        if (!this._list[eventId]) this._list[eventId] = [];
        return addEventHandler(this._list, eventId, handler);
    }

    one(eventId, handler) {
        if(!handler || typeof handler !== 'function') throw new Error('Invalid handler');
        const remover = this.on(eventId, (params) => {
            handler.apply(null, [...arguments]);
            remover();
        });
        return remover;
    }

    emit(eventId, params) {
        if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if (!this._list[eventId]) return;
        [...this._interceptors, ...this._list[eventId]].forEach(handler => !!handler && handler(params));
    }

    listHandlers(eventId) {
        const handlers = this._list[eventId];
        if (!handlers) return;
        return this._list[eventId].filter(h => !!h);
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

function addInterceptor(interceptors, handler) {
    const emptyIndex = interceptors.findIndex(interceptor => interceptor === null);
    const index = emptyIndex > -1 ? emptyIndex : interceptors.push(handler) - 1;
    return () => interceptors[index] = null;
}

function addEventHandler(list, eventId, handler) {
    const emptyIndex = list[eventId].findIndex(handler => handler === null);
    const index = emptyIndex > -1 ? replaceEmptyHandler(...arguments, emptyIndex) : list[eventId].push(handler) - 1;
    return () => list[eventId][index] = null;
}

function replaceEmptyHandler(list, eventId, handler, emptyIndex) {
    list[eventId][emptyIndex] = handler;
    return emptyIndex;
}
