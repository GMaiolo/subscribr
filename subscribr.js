/** Subscribr, a tiny event subscriber. */
class Subscribr {

    constructor() {
        this._list = {};
        this._interceptors = [];
    }

    /**
    * Subscribe to an event.
    * @param {string} eventId - the event ID.
    * @param {function} handler - the callback function.
    * @return {function} Subscription destroyer.
    */
    on(eventId, handler) {
        if(!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        if(!handler || typeof handler !== 'function') throw new Error('Invalid handler');
        if (eventId === '*') {
            const index = this._interceptors.push(handler) - 1;
            return () => this._interceptors.splice(index);
        }
        if (!this._list[eventId]) this._list[eventId] = [];
        const index = this._list[eventId].push(handler) - 1;
        return () => this._list[eventId].splice(index);
    }

    /**
    * Emit an event.
    * @param {string} eventId - the event ID.
    * @param {object} params - handler params.
    */
    emit(eventId, params) {
        if(!eventId || typeof eventId !== 'string') throw new Error('Invalid event identifier');
        [...this._interceptors, ...this._list[eventId]].forEach(handler => handler(params));
    }

    /**
    * List an event's handlers.
    * @param {string} eventId - the event ID.
    * @return {array} Event handlers.
    */
    list(eventId) {
        return eventId ? this._list[eventId] : this._list;
    }

    /**
    * Unsubscribe an event.
    * @param {string} eventId - the event ID.
    */
    remove(eventId) {
        delete this._list[eventId];
    }

    /**
    * Get interceptors.
    * @return {array} Interceptors.
    */
    get interceptors() { return this._interceptors; }

    /**
    * Get all events.
    * @return {object} Events.
    */
    get allEvents() { return this._list; }

}

module.exports = Subscribr;
