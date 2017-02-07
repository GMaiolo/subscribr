/* Subscribr, a tiny event subscriber. */
class Subscribr {

    constructor() {
        this._list = {};
        this._interceptors = [];
    }

    on(eventId, handler) {
        if(!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if(!handler || typeof handler !== 'function') throw new Error('Invalid handler');
        if (eventId === '*') {
            const index = this._interceptors.push(handler) - 1;
            return () => this._interceptors.splice(index, 1);
        }
        if (!this._list[eventId]) this._list[eventId] = [];
        const index = this._list[eventId].push(handler) - 1;
        return () => this._list[eventId].splice(index, 1);
    }

    emit(eventId, params) {
        if(!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if(!this._list[eventId]) return;
        [...this._interceptors, ...this._list[eventId]].forEach(handler => handler(params));
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
        return Object.keys(this._list).map(key => this._list[key]);
    }

    get all() { 
        return [ ...this.interceptors, ...this.events ] 
    }

}

module.exports = Subscribr;
