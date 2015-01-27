function StorageManager() {
	this.storage = localStorage;
	this.categoryKey = 'chronodex.category';
	this.dataKey = 'chronodex.data';
};

StorageManager.prototype.save = function(key, data) {
	data = typeof data === 'object' ? JSON.stringify(data) : data;
	this.storage.setItem(key, data);
}

StorageManager.prototype.get = function(key) {
	var data = this.storage.getItem(key);
	try {
		return JSON.parse(data);        
	} catch (e) { 
		return data;
	}
}

StorageManager.prototype.saveCategories = function(categories) {
	this.save(this.categoryKey, categories);
}

StorageManager.prototype.saveData = function(data) {
	this.save(this.dataKey, data);
}

StorageManager.prototype.getCategories = function() {
	return  this.get(this.categoryKey);
}

StorageManager.prototype.getData = function() {
	return this.get(this.dataKey);
}