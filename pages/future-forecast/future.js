const forecastIconMap = {
  'sunny': 'sunny-icon.png',
  'cloudy': 'cloudy-icon.png',
  'overcast': 'overcast-icon.png',
  'lightrain': 'lightrain-icon.png',
  'heavyrain': 'heavyrain-icon.png',
  'snow': 'snow-icon.png'
};

function getForecastIconUrl(weather) {
  var imageName = forecastIconMap[weather];
  if (!imageName) {
    return "";
  }
  return "/images/" + imageName;
}

function getWeekdays(n){
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if(n >= weekDays.length){
    return "Error";
  }
  return weekDays[n];
}

const app = getApp();

Page({
  data: {
    futureWeatherInfos: []
  },
  onLoad: function (options) {
    // const cityName = options.city;
    // console.log(cityName);
    this.updateFuture();
  },
  onPullDownRefresh: function(){
    this.updateFuture(function(){
      wx.stopPullDownRefresh();
    });
  },
  updateFuture(onComplete){
    const page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: app.getCurrentCity(),
        time: new Date()
      },
      success: function(data){
        var results = data.data.result;

        const nowDate = new Date();
        const nowWeekday = nowDate.getDay();
        results.forEach(function(r, i){
          let weatherDate = new Date();
          weatherDate.setDate(nowDate.getDate() + i);

          r.weatherIconUrl = getForecastIconUrl(r.weather);
          if(i === 0){
            r.weekday = "Today";
          }else{
            r.weekday = getWeekdays((nowWeekday + i) % 7);
          }
          r.date = page.formatDate(weatherDate);
          r.temperature = r.minTemp + "°~" + r.maxTemp + "°";
        });

        page.setData({
          futureWeatherInfos: results
        });
      },
      complete: function(){
        onComplete && onComplete();
      }
    })
  },
  formatDate(date) {
    return date.toISOString().substring(0, 10);
  }
})