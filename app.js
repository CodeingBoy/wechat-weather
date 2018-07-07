// introduce tencent map SDK
const QQMapWX = require('./libs/qqmap-wx-jssdk.js');
const secret = require('./secret.js');
var qqmapsdk;

var currentCity = "Universe";
var locationPermissionStatus = 0; // 0-not request, 1-permitted, 2-not permitted

const NOT_REQUESTED = 0,
  PERMITTED = 1,
  NOT_PERMITTED = 2;

var appObject = {
  onLaunch: function() {
    qqmapsdk = new QQMapWX({
      key: secret.getTencentMapSdkKey()
    });
  },
  getCurrentCity: function() {
    return currentCity;
  },
  setCurrentCity: function(city) {
    currentCity = city;
  },
  getLocationPermissionRequestStatus() {
    return locationPermissionStatus;
  },
  refreshLocationPermissionRequestStatus(onPermitted, onPermissionCanceled){
    var locationPermitted = wx.getSetting({
      scope: "scope.userLocation"
    });
    if (locationPermitted && locationPermissionStatus !== NOT_PERMITTED){
      locationPermissionStatus = PERMITTED;
      onPermitted && onPermitted();
    } else if (!locationPermitted && locationPermissionStatus === NOT_PERMITTED){
      locationPermissionStatus = NOT_PERMITTED;
      onPermissionCanceled && onPermissionCanceled();
    }
  },
  refreshLocation: function(onSuccess, onFail) {
    const app = this;

    wx.getLocation({
      success: function(result) {
        locationPermissionStatus = PERMITTED;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: result.latitude,
            longitude: result.longitude
          },
          success: function(result) {
            const cityName = result.result.address_component.city;
            app.setCurrentCity(cityName);
            onSuccess(cityName);
          },
          fail: onFail
        })
      },
      fail: function() {
        if (locationPermissionStatus === NOT_REQUESTED) {
          locationPermissionStatus = NOT_PERMITTED;
        }
        wx.showModal({
          title: 'Permission denied',
          content: 'You have denied location permission. To use this feature, you need to go to setting and permit location permission.',
          showCancel: false
        });

        onFail && onFail();
      }
    });
  }
};

App(appObject);