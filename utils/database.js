
Sequelize = require('sequelize');
sequelize = new Sequelize(DATABASE_CONFIG['database']
    , DATABASE_CONFIG['username']
    , DATABASE_CONFIG['password'], {
  host: DATABASE_CONFIG['host'],
  dialect: 'postgres',
  logging: false
});


sequelize_create_table_object = function (_table_name, _fields) {
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

sequelize_create_tables = function (_table_object_array, _force_reset, _callback) {
    var _next = function (_i) {
        _i++;
        if (_i < _table_object_array.length) {
            _loop(_i);
        }
        else {
            _callback();
        }
    };
    
    var _loop = function (_i) {
        _table_object_array[_i].sync({force: _force_reset}).then(function () {
            _next(_i);
        });
    };
    _loop(0);
};