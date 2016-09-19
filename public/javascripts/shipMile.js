

var shipmile_track = function() {
	var shipmile_data=this;
	document.getElementById("shipmile_submit").onclick=function(){
		var weight=document.getElementsByClassName("shipmile_weight_value")[0].value;
		var origin_pincode= document.getElementsByClassName("shipmile_origin_pincode_value")[0].value;
		var destination_pincode=document.getElementsByClassName("shipmile_destination_pincode")[0].value
		if(!weight || isNaN(weight)) 
			return true;
		if(!origin_pincode || isNaN(origin_pincode)) 
			return true;
		if(!destination_pincode || isNaN(destination_pincode)) 
			return true;

		
		var weight_unit=document.getElementById("volume").options[document.getElementById("volume").selectedIndex].value;
		var status=document.getElementById("status").options[document.getElementById("status").selectedIndex].value;
		var payment_type=document.getElementById("type").options[document.getElementById("type").selectedIndex].value
		
		shipmile_data.data={weight: weight, origin_pincode: origin_pincode, destination_pincode:destination_pincode, weight_unit: weight_unit, status: status, payment_type: payment_type};
		shipmile_data.sendmessage();
	}
};

shipmile_track.prototype.sendmessage = function() {
	var theUrl="http://localhost:3000/calculate";
	var http = new XMLHttpRequest();
	var url = "get_data.php";
	var params = this.data;
	http.open("POST", theUrl, true);
	http.setRequestHeader("Content-type", "application/json");
	
	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	    	var rate_card=  JSON.parse(http.responseText).rate_card;
	    	var parent_div=document.getElementById("shipmile_cntr_bottom");
	    	parent_div.innerHTML='';
	    	  var heading_div=document.createElement('div');
		      parent_div.appendChild(heading_div);
		      heading_div.id ='shipmile_invoice_box';
		      heading_div.className ='shipmile_invoice_box';
		      heading_div.innerHTML='<table class="w3-table" id="shipmile_table"> <tr> <th>Shipment id</th> <th>Vendor</th> <th>weight(gm)</th> <th>user Pincode</th> <th>Destination Pincode</th> <th>Frieght</th> <th>COD</th> <th>Fuel Surcharge </th> <th>Total</th> </tr> </table>'
		      var table_div=document.getElementById("shipmile_table")
	    	for(i=0; i< rate_card.length; i++ ){
		    	var c2Div=document.createElement('tr');
			      table_div.appendChild(c2Div);
			      c2Div.id ='shipmile_invoice_data';
			      c2Div.className ='shipmile_invoice_data';
			      c2Div.innerHTML='<td>'+rate_card[i].shipment_id+'</td> <td>'+rate_card[i].vendor+'</td> <td>'+rate_card[i].weight+'</td> <td>'+rate_card[i].origin_pincode+'</td> <td>'+rate_card[i].destination_pincode+'</td> <td>'+rate_card[i].Frieght+'</td> </tr> <tr> <td>'+rate_card[i].cod_amount+'</td> <td>'+rate_card[i].fuel_surcharge+'</td> <td>'+rate_card[i].Total+'</td>   ';
		    	}
	    }
	}
	http.send(JSON.stringify(params));
	return false;

};

var myshipmile_track = new shipmile_track();
