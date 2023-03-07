	function onClickSearch(){
		validations();

	}


	function onClickLog(){
		let xmhr=new XMLHttpRequest();
		xmhr.onreadystatechange=function(){
			if (xmhr.readyState !==4) return;
			if (xmhr.status===200){
				console.log(xmhr.responseText);
				//let obj=xmhr.responseText;
				
				//document.getElementById("t1").textContent=obj.[0].[0];
			}
			else{
				console.log('error',xmhr);
			}
		}

		xmhr.open('GET','weather.php');
		xmhr.send();
	
	}


	function onClickClear(){
		document.getElementById("results").style.visibility="hidden";
		document.getElementById("error1").classList.add('d-none');
		document.getElementById("error2").classList.add('d-none');
		document.getElementById("error3").classList.add('d-none');
	
	}

	function onClickRadio1(){
		document.getElementById("radio1").checked = true;
		document.getElementById("radio2").checked=false;

	}

	function onClickRadio2(){
		document.getElementById("radio2").checked = true;
		document.getElementById("radio1").checked=false;

	}

	function postData(){
	
		let xmhr=new XMLHttpRequest();
		xmhr.onreadystatechange=function(){
			if (xmhr.readyState !==4) return;
			if (xmhr.status===200){
				console.log(xmhr.responseText);
			}
			else{
				console.log('error',xmhr);
			}
		}

		xmhr.open('POST','weather.php');
		xmhr.setRequestHeader("Content-Type","application/json");
		const data={};
		data.address=document.querySelector("#input1").value;
		data.region=document.querySelector("#input2").value;
		data.city=document.querySelector("#input3").value;
		xmhr.send(JSON.stringify(data));
	}

	function validations(){
		let t1=false,t2=false,t3=false;
		let input1=document.querySelector('#input1');
		let address=input1.value;
		if (address===""){
			document.querySelector('#error1').classList.remove('d-none');
			t1=false;
		}
		else{
			document.querySelector('#error1').classList.add('d-none');
			t1=true;
		}

		let input2=document.querySelector('#input2');
		let region=input2.value;

		if (region===""){
			document.querySelector('#error2').classList.remove('d-none');
			t2=false;
		}
		else{
			document.querySelector('#error2').classList.add('d-none');
			t2=true;
		}

		let input3=document.querySelector('#input3');
		let city=input3.value;
		
		if (city==="" || city==="Select city"){
			document.querySelector('#error3').classList.remove('d-none');
			t3=false;
		}
		else{
			document.querySelector('#error3').classList.add('d-none');
			t3=true;
		}
		if (t1===true && t2===true && t3===true){

			document.getElementById("results").style.visibility="visible";

			let old_map=document.getElementById("map");
			old_map.remove();
			let new_map=document.createElement("div");
			new_map.setAttribute("id","map");
			new_map.setAttribute("class","map");
			document.getElementById("map-wrapper").appendChild(new_map);

			postData();
			nominAPI(address,region,city);
		}
	}

	function nominAPI (par1,par2,par3){
		let xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState !==4) return;
			if (xhr.status===200){

				if(!Object.keys(JSON.parse(xhr.responseText)).length){
   					alert('No result for that location');
   					return;
				}
		
				let lat=parseFloat(JSON.parse(xhr.responseText)[0].lat);
				let lon=parseFloat(JSON.parse(xhr.responseText)[0].lon);
		
				openWeatherAPI(lat,lon);


			}
			else{
				console.log('error',xhr);
			}
		}

		xhr.open('GET','https://nominatim.openstreetmap.org/search?q='+par1+','+par2+','+par3+'&format=json');
		xhr.send();
	}

	 function openWeatherAPI(lat,lon){
		let xhr=new XMLHttpRequest();
		let key='602eaed1e511fd2bc35c9cb00ef2de53';
		let radio1=document.querySelector('#radio1');
		let units;
		let obj;
		let weatherT;
		let weatherP;
		let weatherWS;



		if (radio1.checked===true){
			units="metric";
			weatherT="°C"
			weatherP="hPa";
			weatherWS="meters/sec"
		}
		else{
			units="imperial";
			weatherT="°F"
			weatherP="Mb";
			weatherWS="miles/hour"
		}
	
		xhr.onreadystatechange=function(){
			if (xhr.readyState !==4) return;
			if (xhr.status===200){

			
				obj=JSON.parse(xhr.responseText);
				let icon=obj.weather[0].icon;
				document.getElementById("icon").src="http://openweathermap.org/img/wn/"+icon+"@2x.png";

				let description=obj.weather[0].description;
				let name=obj.name;
				let main_temp=obj.main.temp;
				let max_temp=obj.main.temp_max;
				let min_temp=obj.main.temp_min;


				document.getElementById("description").textContent=description+" in "+name;
				document.getElementById("main-temp").textContent=main_temp+" "+weatherT;
				document.getElementById("min-temp").textContent="L: "+min_temp+" "+weatherT+" | ";
				document.getElementById("max-temp").textContent="H: "+max_temp+" "+weatherT;
				document.getElementById("pressure").textContent=obj.main.pressure+" "+weatherP;
				document.getElementById("humidity").textContent=obj.main.humidity+"%";
				document.getElementById("wind-speed").textContent=obj.wind.speed+" "+weatherWS;
				document.getElementById("cloud-cover").textContent=obj.clouds.all+"%";
				document.getElementById("sunrise").textContent=UTC_to_Hrs(obj.sys.sunrise);
				document.getElementById("sunset").textContent=UTC_to_Hrs(obj.sys.sunset);






			}
			else{
				console.log('error',xhr);
			}
		}

		
		xhr.open('GET','https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='
		+lon+'&units='+units+'&APPID='+key);
		xhr.send();		

		let xhr2=new XMLHttpRequest;
		xhr2.onreadystatechange=function(){
			if (xhr2.readyState !==4) return;
			if (xhr2.status===200){
		
				obj2=JSON.parse(xhr2.responseText);
				document.getElementById("time1").textContent=UTC_to_Hrs(obj2.list[0].dt);
				document.getElementById("time2").textContent=UTC_to_Hrs(obj2.list[1].dt);
				document.getElementById("time3").textContent=UTC_to_Hrs(obj2.list[2].dt);
				document.getElementById("time4").textContent=UTC_to_Hrs(obj2.list[3].dt);
				document.getElementById("time5").textContent=UTC_to_Hrs(obj2.list[4].dt);
				document.getElementById("time6").textContent=UTC_to_Hrs(obj2.list[5].dt);
				document.getElementById("time7").textContent=UTC_to_Hrs(obj2.list[6].dt);
				document.getElementById("time8").textContent=UTC_to_Hrs(obj2.list[7].dt);

				document.getElementById("icon1").src="http://openweathermap.org/img/wn/"
				+(obj2.list[0].weather[0].icon)+"@2x.png";
				document.getElementById("icon2").src="http://openweathermap.org/img/wn/"
				+(obj2.list[1].weather[0].icon)+"@2x.png";
				document.getElementById("icon3").src="http://openweathermap.org/img/wn/"
				+(obj2.list[2].weather[0].icon)+"@2x.png";
				document.getElementById("icon4").src="http://openweathermap.org/img/wn/"
				+(obj2.list[3].weather[0].icon)+"@2x.png";
				document.getElementById("icon5").src="http://openweathermap.org/img/wn/"
				+(obj2.list[4].weather[0].icon)+"@2x.png";
				document.getElementById("icon6").src="http://openweathermap.org/img/wn/"
				+(obj2.list[5].weather[0].icon)+"@2x.png";
				document.getElementById("icon7").src="http://openweathermap.org/img/wn/"
				+(obj2.list[6].weather[0].icon)+"@2x.png";
				document.getElementById("icon8").src="http://openweathermap.org/img/wn/"
				+(obj2.list[7].weather[0].icon)+"@2x.png";

				document.getElementById("temp1").textContent=obj2.list[0].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp2").textContent=obj2.list[1].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp3").textContent=obj2.list[2].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp4").textContent=obj2.list[3].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp5").textContent=obj2.list[4].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp6").textContent=obj2.list[5].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp7").textContent=obj2.list[6].main.temp.toFixed(2)+weatherT;
				document.getElementById("temp8").textContent=obj2.list[7].main.temp.toFixed(2)+weatherT;

				document.getElementById("cloud1").textContent=obj2.list[0].clouds.all+"%";
				document.getElementById("cloud2").textContent=obj2.list[1].clouds.all+"%";
				document.getElementById("cloud3").textContent=obj2.list[2].clouds.all+"%";
				document.getElementById("cloud4").textContent=obj2.list[3].clouds.all+"%";
				document.getElementById("cloud5").textContent=obj2.list[4].clouds.all+"%";
				document.getElementById("cloud6").textContent=obj2.list[5].clouds.all+"%";
				document.getElementById("cloud7").textContent=obj2.list[6].clouds.all+"%";
				document.getElementById("cloud8").textContent=obj2.list[7].clouds.all+"%";

				document.getElementById("modal-title1").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[0].dt);
				document.getElementById("modal-icon1").src="http://openweathermap.org/img/wn/"
				+(obj2.list[0].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description1").textContent=obj2.list[0].weather[0].main+" ("+
				obj2.list[0].weather[0].description+")";
				document.getElementById("modal-h1").textContent=obj2.list[0].main.humidity+"%";
				document.getElementById("modal-p1").textContent=obj2.list[0].main.pressure+" "+weatherP;
				document.getElementById("modal-ws1").textContent=obj2.list[0].wind.speed+" "+weatherWS;


				document.getElementById("modal-title2").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[1].dt);
				document.getElementById("modal-icon2").src="http://openweathermap.org/img/wn/"
				+(obj2.list[1].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description2").textContent=obj2.list[1].weather[0].main+" ("+
				obj2.list[1].weather[0].description+")";
				document.getElementById("modal-h2").textContent=obj2.list[1].main.humidity+"%";
				document.getElementById("modal-p2").textContent=obj2.list[1].main.pressure+" "+weatherP;
				document.getElementById("modal-ws2").textContent=obj2.list[1].wind.speed+" "+weatherWS;

				document.getElementById("modal-title3").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[2].dt);
				document.getElementById("modal-icon3").src="http://openweathermap.org/img/wn/"
				+(obj2.list[2].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description3").textContent=obj2.list[2].weather[0].main+" ("+
				obj2.list[2].weather[0].description+")";
				document.getElementById("modal-h3").textContent=obj2.list[2].main.humidity+"%";
				document.getElementById("modal-p3").textContent=obj2.list[2].main.pressure+" "+weatherP;
				document.getElementById("modal-ws3").textContent=obj2.list[2].wind.speed+" "+weatherWS;

				document.getElementById("modal-title4").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[3].dt);
				document.getElementById("modal-icon4").src="http://openweathermap.org/img/wn/"
				+(obj2.list[3].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description4").textContent=obj2.list[3].weather[0].main+" ("+
				obj2.list[3].weather[0].description+")";
				document.getElementById("modal-h4").textContent=obj2.list[3].main.humidity+"%";
				document.getElementById("modal-p4").textContent=obj2.list[3].main.pressure+" "+weatherP;
				document.getElementById("modal-ws4").textContent=obj2.list[3].wind.speed+" "+weatherWS;

				document.getElementById("modal-title5").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[4].dt);
				document.getElementById("modal-icon5").src="http://openweathermap.org/img/wn/"
				+(obj2.list[4].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description5").textContent=obj2.list[4].weather[0].main+" ("+
				obj2.list[4].weather[0].description+")";
				document.getElementById("modal-h5").textContent=obj2.list[4].main.humidity+"%";
				document.getElementById("modal-p5").textContent=obj2.list[4].main.pressure+" "+weatherP;
				document.getElementById("modal-ws5").textContent=obj2.list[4].wind.speed+" "+weatherWS;

				document.getElementById("modal-title6").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[5].dt);
				document.getElementById("modal-icon6").src="http://openweathermap.org/img/wn/"
				+(obj2.list[5].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description6").textContent=obj2.list[5].weather[0].main+" ("+
				obj2.list[5].weather[0].description+")";
				document.getElementById("modal-h6").textContent=obj2.list[5].main.humidity+"%";
				document.getElementById("modal-p6").textContent=obj2.list[5].main.pressure+" "+weatherP;
				document.getElementById("modal-ws6").textContent=obj2.list[5].wind.speed+" "+weatherWS;

				document.getElementById("modal-title7").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[6].dt);
				document.getElementById("modal-icon7").src="http://openweathermap.org/img/wn/"
				+(obj2.list[6].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description7").textContent=obj2.list[6].weather[0].main+" ("+
				obj2.list[6].weather[0].description+")";
				document.getElementById("modal-h7").textContent=obj2.list[6].main.humidity+"%";
				document.getElementById("modal-p7").textContent=obj2.list[6].main.pressure+" "+weatherP;
				document.getElementById("modal-ws7").textContent=obj2.list[6].wind.speed+" "+weatherWS;

				document.getElementById("modal-title8").textContent="Weather in "+obj2.city.name+" on "
				+UTC_to_Date(obj2.list[7].dt);
				document.getElementById("modal-icon8").src="http://openweathermap.org/img/wn/"
				+(obj2.list[7].weather[0].icon)+"@2x.png";
				document.getElementById("modal-description8").textContent=obj2.list[7].weather[0].main+" ("+
				obj2.list[7].weather[0].description+")";
				document.getElementById("modal-h8").textContent=obj2.list[7].main.humidity+"%";
				document.getElementById("modal-p8").textContent=obj2.list[7].main.pressure+" "+weatherP;
				document.getElementById("modal-ws8").textContent=obj2.list[7].wind.speed+" "+weatherWS;

			}

			else{
				console.log('error',xhr2);
			}
		}
		xhr2.open('GET','https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='
		+lon+'&units='+units+'&APPID='+key);
		xhr2.send();


	
		let zoom=5;
		var map = new ol.Map({
 					target: 'map',
				  	layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM() 
						}) 
					],
  					view: new ol.View({
    				center: ol.proj.fromLonLat([lon,lat]),
    				zoom:5})				  	
				  });


		let tileCoordinateX = lat2tile(lat,5);
		let tileCoordinateY = long2tile(lon,5);
			


		let map_url="https://tile.openweathermap.org/map/temp_new/"+5+"/"+tileCoordinateX+"/"
		+tileCoordinateY+".png?appid="+key;

		let layer_temp = new ol.layer.Tile({
			 source:new ol.source.XYZ({ 
			 	url:map_url})
		}); 
		map.addLayer(layer_temp);

		let map_url2="https://tile.openweathermap.org/map/precipitation_new/"+5+"/"+tileCoordinateX+
		"/"+tileCoordinateY+".png?appid="+key+"";
		let layer_temp2 = new ol.layer.Tile({
			 source:new ol.source.XYZ({ 
			 	url:map_url2})
		});
		map.addLayer(layer_temp2);

	}



	function UTC_to_Hrs(dt){
		let date=new Date(dt*1000);
		let currentHours = date.getHours();
		currentHours = ("0" + currentHours).slice(-2);
		let currentMinutes = date.getMinutes();
		currentMinutes = ("0" + currentMinutes).slice(-2);
		return currentHours+":"+currentMinutes;
	}

	function UTC_to_Date(dt){
		let date=new Date(dt*1000);
		let currentHours = date.getHours();
		currentHours = ("0" + currentHours).slice(-2);
		let currentMinutes = date.getMinutes();
		currentMinutes = ("0" + currentMinutes).slice(-2);
		let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear()+" "+currentHours+
		":"+currentMinutes;
	}




	 function long2tile(lon,zoom) { 
	 	return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
	 }
 	function lat2tile(lat,zoom)  { 
 		return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) +
 		 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); 
 	}


	const search_button=document.querySelector('.Search');
	search_button.addEventListener('click',onClickSearch);
	const radio_button1=document.querySelector('#radio2');
	radio_button1.addEventListener('click',onClickRadio1);
	const radio_button2=document.querySelector('#radio2');
	radio_button2.addEventListener('click',onClickRadio2);
	const clear_button=document.querySelector('#clear');
	clear_button.addEventListener('click',onClickClear);
	const log_button=document.querySelector('#log');
	log_button.addEventListener('click',onClickLog);

	