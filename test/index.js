'use strict';


require('should');
let options = {
        apiKey: '680e4bec6651c1b7682202b43761f392d633dd99',
        timeout: 3600,
        credentials: {
            token: null,
            secret: null
        }
    },
    bird = require('../lib/index').fly(options),
    testMask,
    duplicateMask;

bird.apiUrl = process.env.HOST || 'http://localhost:9090';

describe('Regular mask:', () => {
    describe('- Shrink', () => {
        it('A shrunken URL and it\'s reduced size.', done => {

            let content = {
                type: 'url',
                value: `https://yes.some-random-testing-domain.org/date/${(+new Date())}`
            };

            bird.shrink(content)
                .then(data => {
                    data.should.not.equal(null);
                    testMask = data.mask; // Used in the rest of the tests.
                    done();
                })
                .catch(done);
        });
    });

    describe('- Expand', () => {
        it('An expanded URL and expanded size.', done => {

            bird.expand(testMask)
                .then(data => {
                    data.should.not.equal(null);
                    done();
                })
                .catch(error => done(error));
        });
    });

    describe('- Delete', () => {
        it('200 status code.', done => {

            bird.delete(testMask)
                .then(status => {
                    status.should.be.exactly(200).and.be.a.Number();
                    done();
                })
                .catch(error => done(error));
        });
    });
}),

    describe('Custom mask:', () => {
        describe('- Shrink (custom mask)', () => {
            it('A shrunken URL and it\'s reduced size.', done => {

                duplicateMask = `pruebas${(+new Date())}`;
                let content = {
                    type: 'url',
                    value: `https://yes.some-random-testing-domain.org/date/${(+new Date())}`,
                    mask: duplicateMask
                };

                bird.shrink(content)
                    .then(data => {
                        data.should.not.equal(null);
                        testMask = data.mask; // Used in the rest of the tests.
                        done();
                    })
                    .catch(error => done(error));
            });
        });

        describe('- Shrink (duplicate)', () => {
            it('409 status code.', done => {

                let content = {
                    type: 'url',
                    value: `https://yes.some-random-testing-domain.org/date/${(+new Date())}`,
                    mask: duplicateMask
                };

                bird.shrink(content)
                    .catch(error => {
                        error.status.should.equal(400);
                        done();
                    });
            });
        });

        describe('- Expand (custom mask)', () => {
            it('An expanded URL and expanded size.', done => {

                bird.expand(testMask)
                    .then(data => {
                        data.should.not.equal(null);
                        done();
                    })
                    .catch(error => done(error));
            });
        });

        describe('- Delete (custom mask)', () => {
            it('200 status code.', done => {

                bird.delete(testMask)
                    .then(status => {
                        status.should.be.exactly(200).and.be.a.Number();
                        done();
                    })
                    .catch(error => done(error));
            });
        });
    }),

    describe('Shrink text:', () => {
        describe('- Shrink text (custom mask)', () => {
            it('A shrunken URL and it\'s reduced size.', done => {

                let content = {
                    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget arcu eget tellus ultricies ' +
                    'accumsan non id tellus. Quisque id purus fringilla, porta quam id, iaculis dui. Aliquam erat volutpat. ' +
                    'Sed scelerisque lorem at nibh blandit, vitae accumsan est malesuada. Maecenas luctus pharetra lorem, ' +
                    'eget ullamcorper sem suscipit ac. Aliquam erat volutpat. In semper erat porta dolor ultricies, sed dictum ' +
                    'mauris tempus. In in commodo massa. Proin sed risus tempus quam tempor mollis. Nullam ultrices orci in ' +
                    'urna scelerisque, ac consequat odio scelerisque. Suspendisse quis ante cursus ipsum ultricies mollis.\r\n\r\n' +
                    'Suspendisse posuere scelerisque porttitor. Etiam non turpis justo. Fusce non lacinia magna, id blandit tellus. ' +
                    'Quisque id turpis massa. Aliquam nibh nisl, porta pharetra dapibus at, efficitur sed risus. Nam id dignissim sem. ' +
                    'In vel tellus arcu. Pellentesque in justo et sem gravida ultrices. Duis fringilla ante volutpat blandit volutpat. ' +
                    'Vivamus eget nisi vel velit porttitor accumsan non a mi. In vel lacinia lectus. Ut lacinia egestas consectetur. ' +
                    'Aliquam at orci sit amet purus pulvinar placerat. Donec tincidunt dui ut ligula lobortis, ut volutpat enim ' +
                    'imperdiet. Morbi consequat risus nec mi convallis porta. Pellentesque facilisis diam nec dolor consectetur, ' +
                    'at suscipit nibh accumsan.',
                    type: 'text',
                    mask: `lipsum${(+new Date())}`,
                    source: {
                        url: 'http://en.wikipedia.org/wiki/Automobile',
                        title: 'Lipsum',
                        favicon: ''
                    }
                };

                bird.shrink(content)
                    .then(data => {
                        data.should.not.equal(null);
                        testMask = data.mask; // Used in the rest of the tests.
                        done();
                    })
                    .catch(error => done(error));
            });
        });

        describe('- Expand (custom mask)', () => {
            it('An expanded URL and expanded size.', done => {

                bird.expand(testMask)
                    .then(data => {
                        data.should.not.equal(null);
                        done();
                    })
                    .catch(error => done(error));
            });
        });

        describe('- Delete (custom mask)', () => {
            it('200 status code', done => {

                bird.delete(testMask)
                    .then(status => {
                        status.should.be.exactly(200).and.be.a.Number();
                        done();
                    })
                    .catch(error => done(error));
            });
        });
    });
