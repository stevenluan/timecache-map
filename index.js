var fs = require('fs');

var TimeCacheMap = function(expireSecs, numBuckets, options) {
	if(numBuckets < 2) throw new Error('number of buckets must be more than 2');
	var buckets = this.buckets = initBuckets(numBuckets);
	var expireInterval = Math.round(expireSecs * 1000 / numBuckets);
	this.expireInterval = setInterval(function() {
		buckets.pop();
		buckets.unshift(new MapEntry());
	}, expireInterval);
};

TimeCacheMap.prototype.get = function(key) {
	for(var i=0;i<this.buckets.length;i++) {
		var bucket = this.buckets[i];
		if(bucket.containsKey(key)){
			return bucket.get(key);
		}
	}
	return null;
};

TimeCacheMap.prototype.set = function(key, value) {
	this.buckets[0].set(key, value);
	for(var i=1;i<this.buckets.length;i++){
		this.buckets[i].remove(key);
	}
};

TimeCacheMap.prototype.shutdown = function() {
	clearInterval(this.expireInterval);
};

var MapEntry = function() {
	this.cache = {};
};
MapEntry.prototype.containsKey = function(key){
	return this.cache.hasOwnProperty(key);
};
MapEntry.prototype.get = function(key) {
	return this.cache[key];
};
MapEntry.prototype.set = function(key, value){
	this.cache[key] = value;
};
MapEntry.prototype.remove = function(key){
	delete this.cache[key];
};

function initBuckets(numBuckets) {
	var buckets = [];
	for(var i=0;i<numBuckets;i++){
		buckets.push(new MapEntry());
	}
	return buckets;
}
module.exports = TimeCacheMap;