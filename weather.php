<?php

	if(strcasecmp($_SERVER['REQUEST_METHOD'], 'GET') == 0) {
	

		$conn = new mysqli("localhost:3308", "root", "","phpmyadmin"); 
		
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		
		$sql ="SELECT * FROM `requests` ORDER BY timestamp DESC LIMIT 5";
		$result = $conn->query($sql);
		mysqli_close($conn);
		
			
		$num= mysqli_num_rows($result);
		$json=array();
		for ($i=0;$i<$num;$i++){
			$row=mysqli_fetch_row($result);
			$arr=array();
			for ($j=0;$j<5;$j++){
				array_push($arr,$row[j]);
			}
			array_push($json,$arr);
			
		}
		
		echo json_encode($json);
	
		
	}	
	
	
	
	

	if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') == 0) {
		echo "hey";	
		$json = file_get_contents("php://input");
		$data = json_decode($json);
		
		
		$time=idate("U");
		
	
		$conn = new mysqli("23.102.49.216:3306", "sgiann05", "esxm1111!!!!","phpmyadmin"); 
		 
		 if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		
		
		 $sql="INSERT INTO requests(timestamp,address,region,city) VALUES
		 ('$time','$data->address','$data->region','$data->city')";
		 
		 if ($conn->query($sql) === TRUE) {
			echo "201 Created";
		} else {
			echo "500 server error";
		}
		
		$conn->close();
		
	}	
	
?>