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