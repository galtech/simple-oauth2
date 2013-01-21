var credentials = { client: { id: 'client-id', secret: 'client-secret', site: 'https://example.org' } },
    OAuth2 = require('./../lib/simple-oauth2.js')(credentials),
		qs = require('querystring'),
    nock = require('nock');

var request, result, token, error;


describe.only('OAuth2.AccessToken',function() {

	beforeEach(function(done) {
		var params = { 'code': 'code', 'redirect_uri': 'http://callback.com', 'grant_type': 'authorization_code' };
		request = nock('https://example.org:443').post('/oauth/token', params).replyWithFile(200, __dirname + '/fixtures/access_token.json');
		done();
	})

	beforeEach(function(done) {
		var params = { 'code': 'code', 'redirect_uri': 'http://callback.com' }
		OAuth2.AuthCode.getToken(params, function(e, r) {
			error = e; result = r; done();
		})
	})

	beforeEach(function(done) {
		token = OAuth2.AccessToken.create(result);
		done();
	});

	describe('#create',function() {
		it('creates an access token',function() {
			token.should.have.property('token');
		});
	});


	describe('#expired',function() {

		describe('when not expired', function() {

			it('returns false',function() {
				token.expired().should.be.true
			});
		});

		describe('when expired', function() {

			beforeEach(function(done) {
				token.token.expires_at = Date.yesterday();
				done();
			});

			it('returns false',function() {
				token.expired().should.be.false
			});
		});
	});
});
