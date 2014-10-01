var TimeCacheMap = require('..');
var test = require('tape');



function createMap(expireSec, numBuckets, options) {
    return new TimeCacheMap(expireSec, numBuckets);
}



test('initialize', function(assert) {
	assert.plan(2);
    var map = createMap(10, 2);
    assert.pass('map initialized');
    map.shutdown();
    assert.pass('map shutdown');
    assert.end();
});

test('initialize with bucket error', function(assert) {
	assert.plan(1);
	var map;
    try{
      map = createMap(10, 1);
    }catch(e) {
      assert.pass('error thrown');
      assert.end();
      return;
    }
    if(map) map.shutdown();
    assert.fail('error is not thrown with less than 2 buckets');
    assert.end();
    
});