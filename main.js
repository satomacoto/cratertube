
function getYouTube() {
  var list = $("#videoList").val().split('Å_n');
  var id = list[0];
  $("#videoList").val(list.slice(1).join('Å_n'));
  loadVideo(id);
}

function getMusicVideo(query) {
  var url = "http://gdata.youtube.com/feeds/api/videos?start-index=1&max-results=3&v=2&alt=json&category=music&q="+encodeURI(query);
  $.getJSON(url, function(data) {
    var videoId = data.feed.entry[0].id.$t.split(":").pop(); 
    loadVideo(videoId);
  });
}

/*
 * Polling the player for information
 */

// Update a particular HTML element with a new value
function updateHTML(elmId, value) {
  document.getElementById(elmId).innerHTML = value;
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
  alert("An error occured of type:" + errorCode);
}

// This function is called when the player changes state
function onPlayerStateChange(newState) {
  if (newState == 0 || newState == -1) {
    getYouTube();
  }
  updateHTML("playerState", newState);
}

// Display information about the current state of the player
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
  if(ytplayer && ytplayer.getDuration) {
    /*
    updateHTML("videoDuration", ytplayer.getDuration());
    updateHTML("videoCurrentTime", ytplayer.getCurrentTime());
    updateHTML("bytesTotal", ytplayer.getVideoBytesTotal());
    updateHTML("startBytes", ytplayer.getVideoStartBytes());
    updateHTML("bytesLoaded", ytplayer.getVideoBytesLoaded());
    */
  }
}

// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("ytPlayer");
  // This causes the updatePlayerInfo function to be called every 250ms to
  // get fresh data from the player
  setInterval(updatePlayerInfo, 250);
  updatePlayerInfo();
  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
  ytplayer.addEventListener("onError", "onPlayerError");
}

// Loads the selected video into the player.
function loadVideo(videoID) {
  if(ytplayer) {
    try {
      ytplayer.loadVideoById(videoID);
    } catch(err) {
      console.log(err);
    }       
  }
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadPlayer() {
  // The video to load
  var videoID = "lq4ML6o-IcI";
  // Lets Flash from another domain call JavaScript
  var params = { allowScriptAccess: "always" };
  // The element id of the Flash embed
  var atts = { id: "ytPlayer" };
  // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
  swfobject.embedSWF("http://www.youtube.com/v/" + videoID + 
                     "?version=3&enablejsapi=1&playerapiid=player1", 
                     "videoDiv", "460", "240", "9", null, null, params, atts);
}

$(function(){
  loadPlayer();

  //$.getJSON("http://craters.heroku.com/api/crater_list?sphere_id=1&offset=10&count=10", function(data) {
  $.getJSON("jvc.txt", function(data) {
    $.each(data.slice(0,20), function(i, val) {
      if (this.imageurl == "no image") return;
      var div = $("<div/>").attr("class", "item").append($("<img>").attr("class", "photo").attr("src", this.imageurl));
      var query = this.Name;
      div.click(function(e) {
        $("#videoInfo").html(query);
        getMusicVideo(query);
      });

      $container = $('#container');
      //div.append($("<div/>").attr("class", "note").html(this.name));
      $container.append(div);
    });
    $container.imagesLoaded(function(){
      $container.masonry({
        itemSelector : '.item',
        columnWidth : 240
      });
    });
    
    // filter and crop
//    $(".photo").MyThumbnail({
//      thumbWidth:200,
//      thumbHeight:200,
//      backgroundColor:"#ccc",
//      imageDivClass:"myPic"
//    });    
  });
});
