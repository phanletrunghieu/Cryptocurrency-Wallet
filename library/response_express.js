module.exports={
	success: function(res, result){
		res.json({
			'status':1,
			'results': result,
		});
	},

	exception: function(res, message, errorCode = 404){
		res.status(errorCode).json({
			'status':0,
			'error': {
				'code': errorCode,
				'message': message,
			},
		});
	},
};
