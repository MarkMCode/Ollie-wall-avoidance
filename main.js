var maxSpeed =40;
var reverseSpeed = -20;
var collisionCounter = 0;
var xcollisionArray = [];
var ycollisionArray = [];
var delayTime;
var totalVelocity;
var currentLocation = new Object();
var lastCheckedLocation = new Object();
var collisionError = 10;
var avoidanceError = 40;
async function startProgram() {
	lastCheckedLocation.x = 0;
	lastCheckedLocation.y = 0;
	setMainLed({ r: 0, g: 0, b: 255 }); //Blue
	setSpeed(maxSpeed);
	await delay(1);
	delayTime = 0;
	while(true){
		if(getElapsedTime() - delayTime > 0.5){
			currentLocation.x = getLocation().x; //Check location once per loop
			currentLocation.y = getLocation().y;
			totalVelocity = Math.sqrt((getVelocity().x**2) + (getVelocity().y**2))
			for(var i = 0; i<collisionCounter; i++){
				if((currentLocation.x > xcollisionArray[i] - avoidanceError) && (currentLocation.x < xcollisionArray[i] + avoidanceError) && (currentLocation.y > ycollisionArray[i] - avoidanceError) && (currentLocation.y < ycollisionArray[i] + avoidanceError)){
					//Current location is approx. equal to a collision location
					setMainLed({r:0, g:255, b:0}); //Green
					setSpeed(reverseSpeed);
					await delay(1); 
					stopRoll();
					await spin(-90, 1);
					stopRoll();
					setMainLed({ r: 0, g: 0, b: 255 }); //Blue
					await roll(getHeading(), maxSpeed, 1);
					setSpeed(maxSpeed);
					break;
				}
			}			
			if((currentLocation.x < lastCheckedLocation.x +collisionError) && (currentLocation.x > lastCheckedLocation.x - collisionError) && (currentLocation.y < lastCheckedLocation.y+collisionError) && (currentLocation.y > lastCheckedLocation.y - collisionError) /*&& totalVelocity == 0*/){
				//Location is approx. the same as last check
				stopRoll();
				xcollisionArray[collisionCounter] = currentLocation.x; //Add location to array	
				ycollisionArray[collisionCounter] = currentLocation.y;
				collisionCounter++; //Increment collision counter
				setMainLed({r:255, g:0, b:0}); //Red
				setSpeed(reverseSpeed);
				await delay(1); 
				stopRoll();
				await spin(90, 1);
				stopRoll();
				setMainLed({ r: 0, g: 0, b: 255 }); //Blue
				await roll(getHeading(), maxSpeed, 1)
				setSpeed(maxSpeed);
				
			}

			lastCheckedLocation.x = currentLocation.x;
			lastCheckedLocation.y = currentLocation.y;
			delayTime = getElapsedTime();
		}
		await delay(0.025);
	}
	
}

