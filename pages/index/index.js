const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherBackgroundImageMap = {
  'sunny': 'sunny-bg.png',
  'cloudy': 'cloudy-bg.png',
  'overcast': 'overcast-bg.png',
  'lightrain': 'lightrain-bg.png',
  'heavyrain': 'heavyrain-bg.png',
  'snow': 'snow-bg.png'
};

const forecastIconMap = {
  'sunny': 'sunny-icon.png',
  'cloudy': 'cloudy-icon.png',
  'overcast': 'overcast-icon.png',
  'lightrain': 'lightrain-icon.png',
  'heavyrain': 'heavyrain-icon.png',
  'snow': 'snow-icon.png'
};

const weatherImageNavigationBarBackgroundColorMap = {
  'sunny': '#c4efff',
  'cloudy': '#daeff7',
  'overcast': '#c4ced2',
  'lightrain': '#b6d6e2',
  'heavyrain': '#c3ccd0',
  'snow': '#99e3ff'
};

function capitalizeWeatherText(text) {
  if (text.length === 0) {
    return "";
  }
  var toBeCapitalize = text[0];
  toBeCapitalize = String(toBeCapitalize).toUpperCase();
  var truncatedText = text.substring(1);
  return toBeCapitalize + truncatedText;
}

function getBackgroundImageUrl(weather){
  var imageName = weatherBackgroundImageMap[weather];
  if(!imageName){
    return "";
  }
  return "/images/" + imageName;
}

function getForecastIconUrl(weather) {
  var imageName = forecastIconMap[weather];
  if (!imageName) {
    return "";
  }
  return "/images/" + imageName;
}

Page({
  data: {
    currentTemperature: 0,
    currentWeather: "N/A",
    backgroundImageUrl: "/images/sunny-bg.png",
    forecasts: []
  },
  onLoad: function(){
    this.updateWeather();
  },
  onPullDownRefresh: function(){
    this.updateWeather(function(){
      wx.stopPullDownRefresh();
    });
  },
  updateWeather: function(onCompleteCallback){
    const page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { "city": "深圳市" },
      success: function (data) {
        var now = data.data.result.now;
        page.updateNowWeather(now);

        var forecasts = data.data.result.forecast;
        page.updateForecast(forecasts);
      },
      complete: function(){
        onCompleteCallback && onCompleteCallback();
      }
    });
  },
  updateNowWeather: function(now){
    this.setData({
      currentTemperature: now.temp,
      currentWeather: capitalizeWeatherText(now.weather),
      backgroundImageUrl: getBackgroundImageUrl(now.weather)
    });

    // update navigation bar background color
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherImageNavigationBarBackgroundColorMap[now.weather],
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
  },
  updateForecast: function(forecasts){
    const page = this;

    // calculate forecast infos
    forecasts.forEach(function (f) {
      f.time = page.getForecastTime(f.id);
      f.weatherIconUrl = getForecastIconUrl(f.weather);
    });

    this.setData({
      forecasts
    });
  },
  getForecastTime(id){
    if(id == 0){
      return "Now";
    }
    
    var aheadHours = id * 3;
    var now = new Date();
    var nowHour = now.getHours();
    var hours =  nowHour + aheadHours;
    hours %= 24;
    var postfix = hours < 12 ? "AM" : "PM";
    return hours + " " + postfix;
  }
  
})
