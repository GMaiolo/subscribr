import chai from 'chai';
import Subscribr from './subscribr';

let should = chai.should();

const constants = {
    fn: 'function',
    str: 'string',
    arr: 'array',
    obj: 'object'
};

const mock = {
    eventId: 'mockEventId',
    handler: (id = 0) => `mockReturn-${id}`
};

let subscribr;

describe('Class', () => {

    it('should be a function', () => Subscribr.should.be.a(constants.fn));

    describe('Subscribr', () => {

        beforeEach(() => subscribr = new Subscribr());

        describe('on()', () => {
            it('should be a function', () => subscribr.on.should.be.a(constants.fn));
            it('should throw an error on invalid eventId', () => {
                const _fn = () => subscribr.on(null, mock.handler);
                _fn.should.Throw(Error);
            });
            it('should throw an error on invalid handler', () => {
                const _fn = () => subscribr.on(mock.eventId, null);
                _fn.should.Throw(Error);
            });
            it('should return a destroyer function', () => subscribr.on(mock.eventId, mock.handler).should.be.a(constants.fn));
        });

        describe('emit()', () => {
            it('should be a function', () => subscribr.emit.should.be.a(constants.fn));
            it('should throw an error on invalid eventId', () => {
                const _fn = () => subscribr.emit();
                _fn.should.Throw(Error);
            });
            it('should return null when unmatched event', () => should.not.exist(subscribr.emit(mock.eventId)));
            it('should call the first and third events respective handlers', () => {
                let called1 = false, called11 = false, called2 = false, called3 = false;
                subscribr.on(`mock${1}`, () => called1 = true);
                subscribr.on(`mock${1}`, () => called11 = true);
                subscribr.on(`mock${2}`, () => called2 = true);
                subscribr.on(`mock${3}`, () => called3 = true);
                subscribr.emit(`mock${1}`);
                subscribr.emit(`mock${3}`);
                called1.should.be.ok;
                called11.should.be.ok;
                called2.should.be.false;
                called3.should.be.ok;
            });
        });

        describe('listHandlers()', () => {
            beforeEach(() => {
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on(`mock${1}`, mock.handler);
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on(`mock${2}`, mock.handler);
            });
            it('should be a function', () => subscribr.listHandlers.should.be.a(constants.fn));
            it('should return the event handlers', () => {
                const handlers = subscribr.listHandlers(mock.eventId);
                handlers.should.be.a(constants.arr);
                handlers.should.have.lengthOf(2);
            });
            it('should return undefined when no parameter is passed', () => should.not.exist(subscribr.listHandlers()));
            it('should return undefined when not set event id is passed', () => should.not.exist(subscribr.listHandlers('not-set-event-id')));
        });

        describe('remove()', () => {
            it('should be a function', () => subscribr.remove.should.be.a(constants.fn));
            /* TODO */
        });

        describe('interceptors', () => {
            it('should be an array', () => subscribr.interceptors.should.be.a(constants.arr));
            it('should only get interceptors', () => {
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${1}`, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${2}`, mock.handler);
                subscribr.interceptors.should.have.lengthOf(2);
            })
        });

        describe('events', () => {
            it('should be an array', () => subscribr.interceptors.should.be.a(constants.arr));
            it('should only get events', () => {
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${1}`, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${2}`, mock.handler);
                subscribr.events.should.have.lengthOf(3);
            })
        });

        describe('all', () => {
            it('should be an array', () => subscribr.all.should.be.a(constants.arr));
            it('should return interceptors and events', () => {
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${1}`, mock.handler);
                subscribr.on('*', mock.handler);
                subscribr.on(`mock${2}`, mock.handler);
                subscribr.all.should.have.lengthOf(5);
            });
        });

    })

});
