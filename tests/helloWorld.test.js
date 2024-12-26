const chai = require('chai');
const expect = chai.expect;

describe('Hello World Test', function() {
    it('should return hello world', function() {
        const message = 'hello world';
        expect(message).to.equal('hello world');
    });
});
