var fun = require('../lib/uki-core/function');
var Observable = require('../lib/uki-core/observable').Observable;

var SearchFriends = require('../search').SearchFriends;

var Friend = fun.newClass(Observable, {

  init: function(data) {
    this.id(data.id);
    this.name(data.name);
    this.picture(data.picture);
  },

  id: Observable.newProp('id'),

  name: Observable.newProp('name'),

  picture: Observable.newProp('picture'),
  
  fetchExtraData: function(callback) {
    if (this._extraData) {
      callback(this._extraData);
    } else {
      FB.api('/' + this.id(), fun.bind(function(result) {
        this._extraData = result;
        callback(this._extraData);
      }));
    }
  }

});

Friend._cache;

Friend.byId = function(id) {
  return Friend._cache && Friend._cache[id];
};

Friend.load = function(callback) {
  FB.api('/me/friends?fields=id,name,picture', function(result) {
    Friend._cache = {};
    
    result.data.sort(SearchFriends.compareFriends);
    
    var friends = result.data.map(function(f) {
      var friend = new Friend(f);
      Friend._cache[friend.id()] = friend;
      return friend;
    });

    callback(friends);
  });
};

exports.Friend = Friend;
