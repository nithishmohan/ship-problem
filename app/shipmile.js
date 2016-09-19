const uuid = require('node-uuid');
const fs= require('fs');
const async= require('async');

module.exports = {

	calculate: function(req, res){
		var data= req.body;
		data.shipment_id=uuid.v4();
		fs.readFile('./data/ratecard.json', 'utf8', function read(err, rate) {
			if (err) {
			    throw err;
			}
			module.exports.rate_calc(data, JSON.parse(rate), function(err, rates){
				if(!err)
					res.status(200).json({rate_card:rates});
				else
					res.status(400);
			})

			});
	},

	rate_calc : function(data, rate, cb) {
		var zone = ["A", "B" , "C" , "D" , "E"].randomElement();
		if(data.weight_unit=="kg")
			data.weight*= 1000;
		async.parallel([
	  		function(callback){
		  		module.exports.rate_card(data, rate.V1, zone, function(err, rates){
		  			if(!err){
		  				rates.vendor="V1";
		  				callback(null, rates);
		  				//callback(null, {V1: rates});
		  			}
		  			else{
		  				callback(err + "1");
		  			}
				});

	         
	  		}, 
	  		function(callback){
		  		module.exports.rate_card(data, rate.V2, zone, function(err, rates){
		  			if(!err){
		  				rates.vendor="V2";
		  				callback(null, rates);
		  			}
		  			else
		  				callback(err +"2");
				})
	  		},

	  		function(callback){
		  		module.exports.rate_card(data, rate.V3, zone, function(err, rates){
		  			if(!err){
		  				rates.vendor="V3";
		  				callback(null, rates);
		  				//callback(null, {V3: rates});
		  			}
		  			else
		  				callback(err +"3");
				})
	  		},

	  		function(callback){
		  		module.exports.rate_card(data, rate.V4, zone, function(err, rates){
		  			if(!err){
		  				rates.vendor="V4";
		  				callback(null, rates);
		  			}
		  			else
		  				callback(err+"4");
				})
	  		},
	  		function(callback){
		  		module.exports.rate_card(data, rate.shipMile, zone, function(err, rates){
		  			if(!err){
		  				rates.vendor="shipMile";
		  				callback(null, rates);
		  			}
		  			else
		  				callback(err+"5");
				})
	  		}

	  		], function(err, result){
	  			if(err){
	  				console.log(" err", err);
	  			}else{
	  				 cb(null,result);
	  			}
	  	});	


	},

	rate_card: function(data, vender_data, zone, callback){
		if(vender_data.every_500){
			vender_data.g_500=vender_data.every_500;
			vender_data.additional_500=vender_data.every_500;
		}
	    var Frieght= vender_data.g_500[zone];
		var unit_value=parseInt(data.weight/500);
		if(data.weight%500==0)
			unit_value-=1;
		Frieght+=(unit_value)*vender_data.additional_500[zone];
		if(data.payment_type=="prepaid" || data.status== "returned"){
			var cod_amount=0;
		}else{
			console.log("cod");
		    var cod_amount=(Frieght*vender_data.cod_percentage)/100> vender_data.cod_amount ? Frieght*vender_data.cod_percentage: vender_data.cod_amount;
		}
		var fuel_surcharge= (Frieght*vender_data.fuel_surcharge_percentage)/100;
		var Total= Frieght+cod_amount+fuel_surcharge;
		if(data.status=="returned" && vender_data.return_charge){
			Total+= (unit_value+1)*vender_data.return_charge[zone];
		}else if(data.status=="returned" && !vender_data.return_charge){
			Total+=Total;
		}
		var billing_data={Total: Total, zone: zone, Frieght: Frieght, cod_amount: cod_amount, fuel_surcharge:fuel_surcharge, shipment_id: data.shipment_id, weight: data. weight, destination_pincode: data.destination_pincode, origin_pincode: data.origin_pincode};
		callback(null,billing_data);
	}
}

Array.prototype.randomElement = function () {
	//console.log(this[Math.floor(Math.random() * this.length)]);
    return this[Math.floor(Math.random() * this.length)]
}

