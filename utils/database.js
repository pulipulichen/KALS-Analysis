
Sequelize = require('sequelize');
sequelize = new Sequelize(DATABASE_CONFIG['database']
    , DATABASE_CONFIG['username']
    , DATABASE_CONFIG['password'], {
  host: DATABASE_CONFIG['host'],
  dialect: 'postgres',
  logging: false
});


sequelize_create_table = function (_table_name, _fields) {
	var _conf = {};
	for (var _f in _fields) {
		var _type = _fields[_f];
		if (_type === "INTEGER") {
			_conf[_f] = {type: Sequelize.INTEGER};
		}
		else if (_type === "FLOAT") {
			_conf[_f] = {type: Sequelize.FLOAT};
		}
		else if (_type === "BOOLEAN") {
			_conf[_f] = {type: Sequelize.BOOLEAN};
		}
		else {
			_conf[_f] = {type: Sequelize.TEXT};
		}
	}
	
	
	return sequelize.define(_table_name, _conf, {
		timestamps: false,
	});
};