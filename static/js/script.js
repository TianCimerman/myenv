async function fetchWeather() {
  try {
      const response = await fetch('/get_current_weather');

      // Check if the response is OK
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Weather data:", data);
      const currentWeather = data.current_weather;
      const forecast = data.forecast;



      var weth_id = currentWeather.weather_id;
      console.log(weth_id);
      var time = currentWeather.timestamp;
      var date = new Date(time);
      var hours = date.getHours();
      
      
      var minutes = date.getMinutes();
      let currentDate = new Date();
      

      let day = currentDate.toLocaleDateString('en-GB', { 
        timeZone: 'Europe/London', 
        day: '2-digit', 
        
    });
    let month = currentDate.toLocaleDateString('en-GB', { 
      timeZone: 'Europe/London', 
        month: '2-digit', 
      
  });

  if(minutes<10){
    document.getElementById("minute").textContent = "0"+minutes;
  }
  else{
    document.getElementById("minute").textContent = minutes;
  }

  if(hours<10){
    document.getElementById("ura_2").textContent = "0"+hours;
  }
  else{
    document.getElementById("ura_2").textContent = hours;
  }

  if(day<10){
    document.getElementById("datum").textContent = "0"+day + "." + month+".";
  }
  else{
    document.getElementById("datum").textContent = day + "." + month+".";
  }
  if(month<10){
    document.getElementById("datum").textContent = day + "." +month+".";
  }
  else{
    document.getElementById("datum").textContent = day + "." + month+".";
  }
  var icon="icon"
  setIcon2("vrsta", weth_id, hours, icon);




  const firstDay = forecast[0];
  let fullDateTime = firstDay.datetime;
  var weth_id1 = firstDay.weather_id; 
  var temp_1= firstDay.max_temp+"°C / "+ firstDay.min_temp+"°C";
  var d = getDayName(fullDateTime, "sl-SI");
  document.getElementById("day1").textContent = getFirstThreeLetters(d);
  setIcon("vrsta1", weth_id1, hours, "icon1" );
  document.getElementById("temp1").textContent = temp_1;



  const secondDay = forecast[1];
  let fullDateTime2 = secondDay.datetime;
  var weth_id2 = secondDay.weather_id; 
  var temp_2= secondDay.max_temp+"°C / "+ secondDay.min_temp+"°C";
  var d = getDayName(fullDateTime2, "sl-SI");
  document.getElementById("day2").textContent = getFirstThreeLetters(d);
  setIcon("vrsta2", weth_id2, hours, "icon2" );
  document.getElementById("temp2").textContent = temp_2;


  const thirdDay = forecast[2];
  let fullDateTime3 = thirdDay.datetime;
  var weth_id3 = thirdDay.weather_id; 
  var temp_3= thirdDay.max_temp+"°C / "+ thirdDay.min_temp+"°C";
  var d = getDayName(fullDateTime3, "sl-SI");
  document.getElementById("day3").textContent = getFirstThreeLetters(d);
  setIcon("vrsta3", weth_id3, hours, "icon3" );
  document.getElementById("temp3").textContent = temp_3;


  const forthDay = forecast[3];
  let fullDateTime4 = forthDay.datetime;
  var weth_id4 = forthDay.weather_id; 
  var temp_4= forthDay.max_temp+"°C / "+ forthDay.min_temp+"°C";
  var d = getDayName(fullDateTime4, "sl-SI");
  document.getElementById("day4").textContent = getFirstThreeLetters(d);
  setIcon("vrsta4", weth_id4, hours, "icon4" );
  document.getElementById("temp4").textContent = temp_4;


  const fifthDay = forecast[4];
  let fullDateTime5 = fifthDay.datetime;
  var weth_id5 = forthDay.weather_id; 
  var temp_5= fifthDay.max_temp+"°C / "+ fifthDay.min_temp+"°C";
  var d = getDayName(fullDateTime5, "sl-SI");
  document.getElementById("day5").textContent = getFirstThreeLetters(d);
  setIcon("vrsta5", weth_id5, hours, "icon5" );
  document.getElementById("temp5").textContent = temp_5;    document.getElementById("icon").addEventListener("click", function () {
    document.getElementById("osnova").style.display = "none";
    document.getElementById("spodnji").style.display = "none";

    document.getElementById("napoved").style.display="block"; // Show content2


  });

  } catch (error) {
      console.error('Error fetching data:', error);

  }
}

function fetchInfo() {
  fetch('/get_info', {
      method: 'POST'
  })
  .then(response => response.json())  // Parse JSON response
  .then(data => {
      document.getElementById("info");
      const roundedInfo = Math.round(data.info);
      const gaugeValue = roundedInfo; 

        updateGaugeValue(0);

      updateGaugeValue(gaugeValue); // Update the chart

  })

  .catch(error => {
      console.error('Error fetching month:', error);
  });
}
setInterval(fetchInfo, 1000);
fetchInfo();


async function fetchClimateData() {

  // Make a request to the backend API
  const response = await fetch('/get_temp', {
    method: 'POST'
})
.then(response => response.json())  // Parse JSON response
.then(data => {

 console.log(data); // Check if `data` exists



  console.log(data.temperature_in);
  console.log(data.humidity_in);
  console.log(data.temperature_out);
  console.log(data.humidity_out);
  document.getElementById("temp").textContent = (data.temperature_out ?? "N/A") + " °C";
  document.getElementById("hum").textContent = (data.humidity_out ?? "N/A") + "%";
  document.getElementById("temp_2").textContent = `${data.temperature_in} °C` || "N/A";
  document.getElementById("hum_2").textContent = `${data.humidity_in} %` || "N/A";
})

}


setInterval(fetchClimateData, 5000);
fetchClimateData();


const commandCooldowns = {}; // Initialize the cooldown storage

function login() {
    const commandName = "login";
    const cooldownSeconds = 3600; // Cooldown period in seconds
    const currentTime = Date.now();

    // Check if the function is on cooldown
    if (commandName in commandCooldowns) {
        const lastExecutionTime = commandCooldowns[commandName];
        const timeSinceLastExecution = (currentTime - lastExecutionTime) / 1000; // Convert to seconds

        if (timeSinceLastExecution < cooldownSeconds) {
            const remainingTime = cooldownSeconds - timeSinceLastExecution;
            console.log(`Login is on cooldown. Try again in ${remainingTime.toFixed(1)} seconds.`);
            // Optionally update the DOM or alert the user
            return;
        }
    }

    // Execute the login function
    console.log("Attempting to login...");
    fetch('/get_login', {
        method: 'POST'
    })


    // Update the last execution time
    commandCooldowns[commandName] = currentTime;
}

function updateGaugeValue(newValue) {
  // Update the value property in options
  options.value = newValue;

  // Apply the changes to the chart
  chart.update(options);
}


const { AgCharts } = agCharts;
function getResponsiveFontSize() {
if (window.innerWidth < 600) return 10; // Smaller screens
if (window.innerWidth < 900) return 14; // Medium screens
return 20; // Default font size for larger screens
}

const options = {
type: "radial-gauge",
container: document.getElementById("myChart"),
value: 8,
scale: {
  min: -15,
  max: 20,
  label: {
    fontSize: getResponsiveFontSize(), // Set font size for labels (e.g., 16px)
    color: "white", // Optional: Set the color of the labels
  },
  secondaryLabel:{
    fontSize: 5,
    color: "white",
  },

},
label: {

  // Font size for the gauge value
  color: "white", // Set the color of the gauge value
},

segmentation: {
  enabled: true,
  interval: {
    count: 4,
  },
  spacing: 2,
},

background: {
  visible: false, // Makes the background transparent
}
};

const chart = AgCharts.createGauge(options);



function setSegmentationInterval(interval) {
options.segmentation.interval = interval;
chart.update(options);
}

function clearContent() {
  const contentSections = document.querySelectorAll('#osnova, #myChart, #side, #spodnji, #ura, #napoved, #naslov_3,#food_2,#time_2,#time,#food, #switch');
  contentSections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
}

// Function to load an external website and clear existing content
function loadPage(url) {
// Hide all visible content
document.querySelectorAll('#osnova, #myChart, #side, #spodnji, #ura, #napoved, #naslov_3,#food_2,#time_2, #time,#food, #switch').forEach(element => {
    element.style.display = 'none';
});


// Show the iframe and load the website into it
var iframe = document.getElementById('contentFrame');
iframe.style.display = 'block';  // Make iframe visible
iframe.src = url;  // Set the iframe's source to the clicked link
}
// Set the iframe's source to the clicked link




function loadFeder() {
    document.getElementById("contentFrame").src = "/feder";  

      document.querySelectorAll('#osnova, #myChart, #side, #spodnji, #ura, #napoved').forEach(element => {
        element.style.display = 'none';
      });


      // Show the iframe and load the website into it
      var iframe = document.getElementById('contentFrame');
      iframe.style.display = 'block';  // Make iframe visible
      iframe.src = url;  // Set the iframe's source to the clicked link


}

function getInputValue(inputId) {
  const value = document.getElementById(inputId).value.trim(); // Trim whitespace
  return value || "0";  // Return default "0" if empty
}

// Select the checkbox input


function sendData(data) {
  fetch('http://192.168.1.140:4000/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    console.log('Response from server:', responseData);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function onButtonClick() {
  const controller = document.getElementById('input_5').value;
  const switchState = document.getElementById('themeSwitch');
  const ammount = Number(controller);
  console.log(ammount);
  console.log("Ammount:", ammount);
  console.log("Switch state:", switchState);

  const data = {
    ammount: ammount,
    spec_time: false,
    spec_ammount: true,
    switchState: switchState
  };

  sendData(data);
}

function onButtonClick2() {
  const controller2 = document.getElementById('input_2').value;
  const switchState = document.getElementById('themeSwitch');
  const time = Number(controller2);
  console.log("Time:", time);
  console.log("Switch state:", switchState);

  const data = {
    time: time,
    spec_time: true,
    spec_ammount: false,
    switchState: switchState
  };

  sendData(data);
}

function onButtonClick3() {
  const switchState = document.getElementById('themeSwitch');
  const controller3 = document.getElementById('input_3').value;
  const controller4 = document.getElementById('input_4').value;
  const time = Number(controller4);
  const ammount = Number(controller3);
  console.log("Time:", time, "Ammount:", ammount);
  console.log("Switch state:", switchState);

  const data = {
    time: time,
    ammount: ammount,
    spec_time: true,
    spec_ammount: true,
    switchState: switchState
  };

  sendData(data);
}



const controller = document.getElementById('input_5');  // Second slider
const radialProgress = document.querySelector('.RadialProgress5');

const setProgress = (value) => {
  const progress = (value / 25) * 100;
  radialProgress.style.setProperty('--progress', `${progress}%`);
  radialProgress.innerHTML = `${value}`;
  radialProgress.setAttribute('aria-valuenow', value);
};

setProgress(controller.value);  // Initialize
controller.oninput = () => {
  setProgress(controller.value);
  updateSliderBackground();  // Ensure background updates on input
};

const updateSliderBackground = () => {
  const value = controller.value;
  const max = controller.max;
  const progress = (value / max) * 100;
  controller.style.background = `linear-gradient(to right, #13eca7 0%, #13eca7 ${progress}%, #e0e0e0 ${progress}% 100%)`;
};

controller.addEventListener('input', updateSliderBackground);
updateSliderBackground(); 




const controller2 = document.getElementById('input_2');  // Second slider
const radialProgress2 = document.querySelector('.RadialProgress2');

const setProgress2 = (value) => {
  const progress = (value / 25) * 100;
  radialProgress2.style.setProperty('--progress', `${progress}%`);
  radialProgress2.innerHTML = `${value}`;
  radialProgress2.setAttribute('aria-valuenow', value);
};

setProgress2(controller2.value);  // Initialize
controller2.oninput = () => {
  setProgress2(controller2.value);
  updateSliderBackground2();  // Ensure background updates on input
};

const updateSliderBackground2 = () => {
  const value = controller2.value;
  const max = controller2.max;
  const progress = (value / max) * 100;
  controller2.style.background = `linear-gradient(to right, #13eca7 0%, #13eca7 ${progress}%, #e0e0e0 ${progress}% 100%)`;
};

controller2.addEventListener('input', updateSliderBackground2);
updateSliderBackground2();  // Initialize background




const controller3 = document.getElementById('input_3');  // Second slider
const radialProgress3 = document.querySelector('.RadialProgress3');

const setProgress3 = (value) => {
  const progress = (value / 25) * 100;
  radialProgress3.style.setProperty('--progress', `${progress}%`);
  radialProgress3.innerHTML = `${value}`;
  radialProgress3.setAttribute('aria-valuenow', value);
};

setProgress3(controller3.value);  // Initialize
controller3.oninput = () => {
  setProgress3(controller3.value);
  updateSliderBackground3();  // Ensure background updates on input
};

const updateSliderBackground3 = () => {
  const value = controller3.value;
  const max = controller3.max;
  const progress = (value / max) * 100;
  controller3.style.background = `linear-gradient(to right, #13eca7 0%, #13eca7 ${progress}%, #e0e0e0 ${progress}% 100%)`;
};

controller3.addEventListener('input', updateSliderBackground3);
updateSliderBackground3();  // Initialize background




const controller4 = document.getElementById('input_4');  // Second slider
const radialProgress4 = document.querySelector('.RadialProgress4');

const setProgress4 = (value) => {
  const progress = (value / 25) * 100;
  radialProgress4.style.setProperty('--progress', `${progress}%`);
  radialProgress4.innerHTML = `${value}`;
  radialProgress4.setAttribute('aria-valuenow', value);
};

setProgress4(controller4.value);  // Initialize
controller4.oninput = () => {
  setProgress4(controller4.value);
  updateSliderBackground4();  // Ensure background updates on input
};

const updateSliderBackground4 = () => {
  const value = controller4.value;
  const max = controller4.max;
  const progress = (value / max) * 100;
  controller4.style.background = `linear-gradient(to right, #13eca7 0%, #13eca7 ${progress}%, #e0e0e0 ${progress}% 100%)`;
};

controller4.addEventListener('input', updateSliderBackground4);
updateSliderBackground4();  // Initialize background


const themeSwitch = document.getElementById('themeSwitch');

// Function to toggle the theme (for example, switching between light and dark mode)
function changeNumber() {
    if (themeSwitch.checked) {
        // Apply dark mode or custom theme
        document.getElementById('input_4').value = 17;
        updateSliderBackground4();
        setProgress4(17);
        document.getElementById('input_2').value = 17;
        updateSliderBackground2();
        setProgress2(17);
    } else {
        // Revert to light mode or default theme
        document.getElementById('input_4').value = 5;
        updateSliderBackground4();
        setProgress4(5);
        document.getElementById('input_2').value = 5;
        updateSliderBackground2();
        setProgress2(5);
    }
}

// Add an event listener to detect when the checkbox is toggled
themeSwitch.addEventListener('change', changeNumber);



function setWeatherIcon(iconClass, icon) {
  const iconElement = document.getElementById(icon);
  // Clear previous classes and set the new one
  iconElement.className = `fas ${iconClass}`; 
}

function setIcon(Id, weth_id, hours, icon ){


  if(weth_id>199&& weth_id<250) {
    document.getElementById(Id).textContent = "Nevihte";
    setWeatherIcon("fa-solid fa-cloud-bolt", icon);

  } 
  else if(weth_id>299 && weth_id<350){
    document.getElementById(Id).textContent = "Rahel dež";
    setWeatherIcon("fa-solid fa-cloud-sun-rain", icon);
  }
  else if( weth_id>499 && weth_id<550){
    document.getElementById(Id).textContent = "Dež";
    setWeatherIcon("fa-solid fa-cloud-showers-heavy", icon);
    
  } 
  else if(weth_id>599 && weth_id<650 ){
    document.getElementById(Id).textContent = "Sneženje";
    setWeatherIcon("fa-regular fa-snowflake", icon);
  }
  else if(weth_id==800 && hours<18 && hours>=5){
    document.getElementById(Id).textContent = "Sončno";
    setWeatherIcon("fa-solid fa-sun", icon);
  }
  else if(weth_id==800  && hours>=18){
    document.getElementById(Id).textContent = "Jasno";
    setWeatherIcon("fa-solid fa-moon", icon);
  }
  else if(weth_id>800 && weth_id<820 && hours<18 && hours>=5){
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud", icon);
  }
  else if(weth_id>800 && weth_id<820 &&  hours>=18){
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud-moon", icon);
  }
  else{
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud-moon", icon);
  }

}
function setIcon2(Id, weth_id, hours, icon ){


  if(weth_id>199&& weth_id<250) {
    document.getElementById(Id).textContent = "Nevihta";
    setWeatherIcon("fa-solid fa-cloud-bolt", icon);

  } 
  else if(weth_id>299 && weth_id<350){
    document.getElementById(Id).textContent = "Rahlo dežuje";
    setWeatherIcon("fa-solid fa-cloud-showers-heavy", icon);
  }
  else if( weth_id>499 && weth_id<550){
    document.getElementById(Id).textContent = "Dežuje";
    setWeatherIcon("fa-solid fa-cloud-sun-rain", icon);

  } 
  else if(weth_id>599 && weth_id<650 ){
    document.getElementById(Id).textContent = "Sneži";
    setWeatherIcon("fa-regular fa-snowflake", icon);
  }
  else if(weth_id==800 && hours<18 && hours>=5){
    document.getElementById(Id).textContent = "Jasno";
    setWeatherIcon("fa-solid fa-sun", icon);
  }
  else if(weth_id==800  && hours>=18){
    document.getElementById(Id).textContent = "Jasno";
    setWeatherIcon("fa-solid fa-moon", icon);
  }
  else if(weth_id>800 && weth_id<820 && hours<18 && hours>=5){
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud", icon);
  }
  else if(weth_id>800 && weth_id<820 &&  hours>=18){
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud-moon", icon);
  }
  else{
    document.getElementById(Id).textContent = "Oblačno";
    setWeatherIcon("fa-solid fa-cloud-moon", icon);
  }

}
function getFirstThreeLetters(word) {
  const firstLetter = word.charAt(0).toUpperCase();
  const nextTwoLetters = word.slice(1, 3).toLowerCase();
  return firstLetter + nextTwoLetters;
}

function getDayName(dateStr, locale)
  {
      var date = new Date(dateStr);
      return date.toLocaleDateString(locale, { weekday: 'long' });        
  }
  function reloadPage() {
    window.location.reload(); // This will reload the current page
  }


// Refresh every second
setInterval(fetchWeather, 1000);
fetchWeather(); // Initial call


