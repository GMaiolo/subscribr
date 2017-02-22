import chai from 'chai';
import Subscribr from '../src/subscribr';

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

function reduceSumFn(arr) { 
    return arr.reduce((acc, val) => acc + val) 
}

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

        describe('one()', () => {
            it('should be a function', () => subscribr.one.should.be.a(constants.fn));
            it('should throw an error on invalid eventId', () => {
                const _fn = () => subscribr.on(null, mock.handler);
                _fn.should.Throw(Error);
            });
            it('should throw an error on invalid handler', () => {
                const _fn = () => subscribr.one(mock.eventId, null);
                _fn.should.Throw(Error);
            });
            it('should return a destroyer function', () => subscribr.one(mock.eventId, mock.handler).should.be.a(constants.fn));
            it('should unsuscribe the handler after one emition of the event', () => {
                subscribr.on(mock.eventId, () => { });
                subscribr.one(mock.eventId, () => { });
                const handlersBefore = subscribr.listHandlers(mock.eventId);
                handlersBefore.should.be.a(constants.arr);
                handlersBefore.should.have.lengthOf(2);
                subscribr.emit(mock.eventId);
                const handlersAfter = subscribr.listHandlers(mock.eventId);
                handlersAfter.should.be.a(constants.arr);
                handlersAfter.should.have.lengthOf(1);
            });
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

        describe('[handler] execution', () => {
            it('all event handlers should be called on emit', () => {
                let calledQuantity = 0;
                subscribr.on(mock.eventId, () => calledQuantity++); /* 1 */
                subscribr.on(mock.eventId, () => calledQuantity++); /* 2 */
                subscribr.emit(mock.eventId);
                calledQuantity.should.equal(2);
                calledQuantity = 0;
                subscribr.on(mock.eventId, () => calledQuantity++); /* 3 */
                const fourthHandlerDestroyer = subscribr.on(mock.eventId, () => calledQuantity++); /* 4 */
                subscribr.on(mock.eventId, () => calledQuantity++); /* 5 */
                subscribr.emit(mock.eventId);
                calledQuantity.should.equal(5);
                calledQuantity = 0;
                fourthHandlerDestroyer();
                subscribr.emit(mock.eventId);
                calledQuantity.should.equal(4);
            });
            it('should be called with the parameters passed', () => {
                const strParameterCheck = param => (typeof param).should.equal(constants.str);
                subscribr.on(`mock${1}`, strParameterCheck);
                subscribr.emit(`mock${1}`, 'someString');
                const arrParameterCheck = param => param.should.be.a(constants.arr);
                subscribr.on(`mock${2}`, arrParameterCheck);
                subscribr.emit(`mock${2}`, []);
                subscribr.on(`mock${3}`, params => params.res = reduceSumFn(params.arr));
                let params = { arr: [5, 5, 5, 5] };
                const expectedSum = reduceSumFn(params.arr);
                subscribr.emit(`mock${3}`, params);
                params.res.should.equal(expectedSum);
            })
        })

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
            it('should delete the whole event', () => {
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on(mock.eventId, mock.handler);
                subscribr.on(mock.eventId, mock.handler);
                const beforeRemovalHandlers = subscribr.listHandlers(mock.eventId);
                beforeRemovalHandlers.should.have.lengthOf(3);
                subscribr.remove(mock.eventId);
                const afterRemovalHandlers = subscribr.listHandlers(mock.eventId);
                should.not.exist(afterRemovalHandlers);
            })
        });

        describe('[handler] destroyers', () => {
            it('should be a function', () => subscribr.on(mock.eventId, mock.handler).should.be.a(constants.fn))
            it('should remove the handler from the event', () => {
                const destroyer1 = subscribr.on(mock.eventId, mock.handler);
                const destroyer2 = subscribr.one(mock.eventId, mock.handler);
                const handlersBefore = subscribr.listHandlers(mock.eventId);
                handlersBefore.should.have.lengthOf(2);
                destroyer2();
                const handlersAfterFirstDestroy = subscribr.listHandlers(mock.eventId);
                handlersAfterFirstDestroy.should.have.lengthOf(1);
                destroyer1();
                const leftover = subscribr.listHandlers(mock.eventId);
                should.not.exist(leftover);
            });
        })

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
