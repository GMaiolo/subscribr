import chai from 'chai';
import Subscribr from './subscribr';

chai.should();

const constants = {
    fn: 'function',
    str: 'string'
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
            it('should return a destroyer function', () => subscribr.on('any', mock.handler).should.be.a(constants.fn));
        });

    })

});
