// In our Weather App there are two tabs ('Your Tab' and 'Search weather')
// If I'm using the weather app, then I'm the user. My location will be shown in the user's tab.
// Although I can search for weather of any location

const userWeatherTab = document.querySelector('[data-userWeatherTab]');//  This element is likely used to display weather information for the user's current location.
const searchWeatherTab = document.querySelector('[data-searchWeatherTab]');// This element is likely used to display weather information for a location that the user searches for.
const grantAccessLocation = document.querySelector('.grant-access-location');// For 'your tab' part, if I have not given the access of the location to browser than this element will used to display or ask for access to the location.
const searchWeatherByCity = document.querySelector('[data-searchWeatherByCity]');// This element is likely a form that the user can fill out to search for weather information for a specific location.
const loadingScreen = document.querySelector('.loading-container');// This element is likely used to display a loading screen or spinner while the weather information is being fetched or loaded.
const weatherInfo = document.querySelector('.weather-info');// It wil display all the information about the weather of user's current location or searched location



// initial variable declarations:
let currentTab = userWeatherTab; // initially I'll be logged in the user's weather tab. Here My weather information will be displayed 
const API_KEY = "2563fabe08bfb9f5228d101b9479a4d0";
// This key is likely used to authenticate and access a weather API to fetch weather information for the user's current location or searched location.
currentTab.classList.add('current-tab');// A new class has been added to the current tab element
getFromSessionStorage();
/* It is a function that is likely used to retrieve the user's location information from the browser's session storage. 
If the user has previously granted access to their location, this function will retrieve that information and display the weather information for their current location. 
If the user has not granted access to their location, this function will likely display a prompt asking for permission to access their location. */




// If I click on the userWeatherTab, then I willbe switched to this tab
userWeatherTab.addEventListener("click", () => {
    switchTab(userWeatherTab);
});

// If I click on the searchWeatherTab, then I'll be switched to this tab
searchWeatherTab.addEventListener("click", () => {
    switchTab(searchWeatherTab);
});

// switching between 'your tab' and 'search weather' tab
function switchTab(clickedTab) {// ClickedTab is the tab in which tab I have clicked.
    if (currentTab != clickedTab) {// when currentTab and clickedTab both are different
        currentTab.classList.remove('current-tab');// remove the current-tab class property from the currentTab element. that's mean desappearance of current tab
        clickedTab.classList.add('current-tab');// then add this class to the clickedTab. That means clickedTab will be visible now
        currentTab = clickedTab;// now currentTab is the clickedTab (Where I wanted to switch)
        /* These lines of code are responsible for switching between the two tabs ('Your Tab' and
        'Search weather'). */

        if (!searchWeatherByCity.classList.contains("active")) {// If my current tab isn't in search weather tab, so I want to switch to the search weather tab
            weatherInfo.classList.remove('active');// remove the active class
            grantAccessLocation.classList.remove('active');// remove the active class
            searchWeatherByCity.classList.add('active');// add the active class
            /* These lines determine that invisible the weatherInfo element and grantAccessLocation element. And make visible the searchWeatherByCity element. So Search option will be visible. and I can search for any location's weather. */
        }
        else {// If my current tab is in searchTab, so I want to switch to the 'your weather' tab
            searchWeatherByCity.classList.remove('active');// remove the active class
            weatherInfo.classList.remove('active');// remove the active class
            // now I'm in 'Your weather Tab'
            // If I have given the location access then my city weather will be displayed
            // If not then it will be aksed to grant the location permission
            getFromSessionStorage();
             /* It is a function that is likely used to retrieve the user's
            location information from the browser's session storage. 
            If the user has previously
            granted access to their location, this function will retrieve that information and display the weather information for their current location. 
            If the user has not granted access to their location, this function will likely display a prompt asking for permission to access their location. */
        }
    }
}


function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // It is retrieving the user's location information from the browser's session storage.
    // It is looking for an item with the key "user-coordinates" in the session storage and assigning its value to the `localCoordinates`
    // This information will be used to display the weather information for the user's current location.
    if (!localCoordinates) {
        // If local coordinates have not been found
        grantAccessLocation.classList.add('active');// this grant access location screen will be visible
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        // The `JSON.parse()` method is used to convert a JSON string into a JavaScript object.
        // It  is parsing the `localCoordinates` string from the browser's session storage into a JavaScript object. 
        // In this case, the`localCoordinates` string is expected to be a JSON string representing the user's location coordinates.
        
        fetchUserWeatherInfo(coordinates);
        // It is a function that is likely used to fetch weather information for a specific location using the coordinates of that location.
        // The `coordinates` parameter is an object that contains the latitude and longitude of the location.
        // The function is likely making an API call to a weather API using the`API_KEY` variable declared earlier in the code, and passing the `coordinates` object as a parameter to the API call.
        // Latitudes are horizontal lines that measure distance north or south of the equator.
        //  Longitudes are vertical lines that measure east or west of the meridian in Greenwich, England.
    }
}

const apiError = document.querySelector(".api-error-container");// If weather data can't be found then this element will perform some task

async function fetchUserWeatherInfo(coordinates) {
    const { latitude, longitude } = coordinates;
    // It is using destructuring assignment to extract the `latitude` and `longitude` properties from the `coordinates` object.
    // This allows us to access these properties directly as separate variables within the function.
    grantAccessLocation.classList.remove('active');// remove the location access screen
    loadingScreen.classList.add('active');// loading will be happended untill weather is being fetched from API

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`); 
        // This code is making an API call to the OpenWeatherMap API to fetch weather information for a specific location using the latitude and longitude coordinates of that location.
        // The `fetch()` method is used to make the API call
        // The `await` keyword is used to wait for the response from the API before continuing with the code execution.
        const weatherData = await response.json(); // Converting the fetching data in JSON format.
        // `await` is used to wait untill this line is getting executed
        apiError.classList.remove('active'); // here no error message will be shown
        loadingScreen.classList.remove('active');// remove the loading screen
        weatherInfo.classList.add('active');// add the active class to the weatherInfo element (To display the weather information)
        renderWeatherInfo(weatherData); // Displaying the weather information for the user's current location.
    }
    catch (error) {
        loadingScreen.classList.remove('active');// remove the loading screen
        console.log(error); 
    }
}

function renderWeatherInfo(weatherData) {
    // at first I have to fetch the elements
    
    const cityName = document.querySelector('[data-cityName]');
    const countryIcons = document.querySelector('[data-countryIcon]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const temperature = document.querySelector('[data-temperature]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    // Fetch values from weatherData object and put it in UI elements
    
    cityName.innerText = weatherData?.name;
    // The `?.` operator is used to check if the `weatherData` object exists and has a `name` property before trying to access it.
    //  If the `weatherData` object is null or undefined, the expression will short-circuit and return undefined.
    countryIcons.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherData?.weather?.[0]?.description;
    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temperature.innerText = weatherData?.main?.temp + ' °C';
    windSpeed.innerText = weatherData?.wind?.speed + ' m/s';
    humidity.innerText = weatherData?.main?.humidity + ' %';
    cloudiness.innerText = weatherData?.clouds?.all + ' %';
    showWeatherIcon(weatherData);
    /* These lines of code are responsible for displaying the weather information for the user's current location or seleted location */
}

function showWeatherIcon(weatherData) {
    const weatherIcon = document.querySelector('[data-weatherIcon]');

    const ImageSource = {// stored the image soruce of all weather 
        Clouds: './assets/Clouds.png',
        Rain: './assets/Rain.png',
        Snow: './assets/Snow.png',
        Thunderstorm: './assets/Thunderstorm.png',
        Drizzle: './assets/Drizzle.png',
        Clear: './assets/Clear.png',
        Haze: './assets/Haze.png',
        Mist: './assets/Mist.png',
        Fog: './assets/Fog.png',
        Dust: './assets/Dust.png',
        Smoke: './assets/Smoke.png',
        Sand: './assets/Sand.png',
        Ash: './assets/Ash.png',
        Squalls: './assets/Squalls.png',
        Tornado: './assets/Tornado.png',
    }
    
    weatherIcon.src = ImageSource[weatherData?.weather?.[0]?.main];
}

// when the user will be asked to grant the permission of the location, 
// there will be a button which will allow to take the information of user's location
const grantAccessButton = document.querySelector('[data-grantAccess]'); // fecthing the element

grantAccessButton.addEventListener("click", getLocation); // adding event listner

// when the user will be asked to grant the permission of the location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
    /* This code is checking if the browser supports geolocation. If it does, it calls the
    `getCurrentPosition()` method of the `navigator.geolocation` object to get the user's current
    position and passes a callback function `showPosition` as a parameter. If the browser does not support geolocation, it displays an alert message. */
}

function showPosition(position) {
    // This function stores the user's location coordinates in the browser's session storage 
    // and fetches weather information based on those coordinates.
    
    const userCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    // `userCoordinates` object contains the latitude and longitude of the user's location

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // It is storing the user's location coordinates in the browser's session storage.
    // session storage can only store string values.
    // in the 'user-coordinates', my latitude and longitude is going to be stored as string format
    //  This information will be used later to display the weather information for the user's current location.
    fetchUserWeatherInfo(userCoordinates);// now I can render my weather info based on my latitude and longitude
}

const searchByCity = document.querySelector('[data-searchByCity');

searchWeatherByCity.addEventListener("submit", (event) => {
    event.preventDefault();// `preventDefault()`  prevents the default action of the event from occurring
    // As I don't need to submit this form content anywhere

    let cityName = searchByCity.value; // whatever city name we will provide in the input it will fetch that value

    if (cityName === "")
        return;
    else 
        fetchSearchedWeatherInfo(cityName);
});

async function fetchSearchedWeatherInfo(cityName) {
    loadingScreen.classList.add('active');// Loading screen will be visible
    weatherInfo.classList.remove('active'); // this weather info screen also invisible
    grantAccessLocation.classList.remove('active');// now no need to show this location access screen

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const weatherData = await response.json();
        if (weatherData?.message === "city not found") {// If invalid city is given in input
            //const apiError = document.querySelector(".api-error-container");
            loadingScreen.classList.remove('active');// remove the loading screen
            apiError.classList.add('active');// show the error screen
            return;
        }
        
        apiError.classList.remove('active');
        // suppose at first I gave the wrong city name as input, then apiError element will be visible
        // then after that I gave the right input so I have to remove the 'active' class from apiError element.
        loadingScreen.classList.remove('active');// remove the loading screen
        weatherInfo.classList.add('active');// add the active class to the weatherInfo element (To display the weather information)
        renderWeatherInfo(weatherData); // Displaying the weather information for the searched location.
        
    }
    catch (error) {
        console.log(error);
    }
}


