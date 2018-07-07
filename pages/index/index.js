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

Page({
  data: {
    currentTemperature: 0,
    currentWeather: "N/A",
    backgroundImageUrl: "/images/sunny-bg.png"
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
    var page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { "city": "深圳市" },
      success: function (data) {
        console.log(data);
        var now = data.data.result.now;

        // update weather texts and background image
        page.setData({
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
      complete: function(){
        onCompleteCallback && onCompleteCallback();
      }
    });
  }
  
})
