var pages = [],
currentPage = "",
currentLocation = 0,
currentSub = 0,
currentIndex = 0,

interval = null,
isComplete = false,
isFirst = true,
isBack = false;

var pz;
var pz2;
var pz3;

var video;

$(document).ready(function () {

	init();

});

function init() {
	console.log("init ready! " + window.innerWidth + " , " + window.innerHeight);
	var video = document.getElementById('camera');
	$(".lock0, .lock1, .lock2, .lock3").addClass("disable");
	
	$(":mobile-pagecontainer").on("pagecontainerchange", function (event, ui) {
		currentPage = ui.toPage[0].id;
		if(isFirst){
			pz = PinchZoomer.get("pz1");
			pz.zoom(0.5);
			pz.x(-475);
			pz.y(-415);
			pz.on(PinchZoomer.ZOOM, onZoom);

			pz2 = PinchZoomer.get("pz2");
			pz2.zoom(0.5);
			pz2.x(-475);
			pz2.y(-415);
			pz2.on(PinchZoomer.ZOOM, onZoom);

			pz3 = PinchZoomer.get("pz3");

			isFirst = false;
		}
		switch (ui.toPage[0].id) {
			case "landing":
				loadAudio("audio/intro.mp3");
			break;
			case "map":
				
			break;
			case "content":
				var cls = ".lock" + currentLocation;
				$(cls).removeClass("disable");
				loadAudio("audio/" + json.Menu[currentLocation].Sub[currentSub].Page[0].Audio);
			break;
		}
		
	});

	$(":mobile-pagecontainer").on("pagecontainerbeforechange", function (event, ui) {
		if(ui.toPage[0].id){
			console.log("SHOW ME " + ui.toPage[0].id);
			$("audio.sfx")[0].pause();
			$(".textFullContent").scrollTop(0);
			$(".textContent").scrollTop(0);
			clearInterval(interval);

			if (!isBack) {
				switch(ui.options.fromPage[0].id) {
					case "splash":
						break;
					default:
						if(pages[pages.length-1] != ui.options.fromPage[0].id) pages.push(ui.options.fromPage[0].id);
						break;
				}
				
			}
			switch (ui.toPage[0].id) {
				case "landing":
	
					break;
				case "map":
					
					break;
				case "content":
					
				break;
			}
			isBack = false;
		}
	});

	$(".but").click(function () {
		switch (this.id) {
			case "map":
				$(":mobile-pagecontainer").pagecontainer("change", "#map", {changeHash: false});
				break;
			case "list":
				$(":mobile-pagecontainer").pagecontainer("change", "#list", {changeHash: false});
				break;
			case "help":
				$(":mobile-pagecontainer").pagecontainer("change", "#help", {changeHash: false});
				break;
			case "full":
				var imageUrl = "content/content_" + currentLocation + "/" + json.Menu[currentLocation].Sub[currentSub].Page[currentIndex].Media;
				$('.fullImage').css('background-image', 'url("' + imageUrl + '")');
				$(":mobile-pagecontainer").pagecontainer("change", "#full", {changeHash: false});
				break;
			case "back":
				goBack();
				break;
			case "zoomIn":
				if(currentPage == "map"){
					if(pz.zoom() + 0.25 < 1.6) pz.zoom(0.25 + pz.zoom());
				}else{
					if(pz2.zoom() + 0.25 < 1.6) pz2.zoom(0.25 + pz2.zoom());
				}
				
				break;
			case "zoomOut":
				if(currentPage == "map"){
					if(pz.zoom() - 0.25 > 0.24) pz.zoom(pz.zoom() - 0.25);
				}else{
					if(pz2.zoom() - 0.25 > 0.24) pz2.zoom(pz2.zoom() - 0.25);
				}
				break;
			case "prev":
				loadImage(currentIndex-1);
				break;
			case "next":
				loadImage(currentIndex+1);
				break;
		}

	});

	$(".butLink").click(function () {
		switch (this.id) {
			case "map":
				$(":mobile-pagecontainer").pagecontainer("change", "#map", {changeHash: false});
				break;
			case "link_1":
				DigDeeper(1);
			break;
			case "link_2":
				DigDeeper(2);
			break;
			case "link_3":
				DigDeeper(3);
			break;
			default:
				var arr = this.id.split("_");
				currentLocation = arr[1];
				currentSub = arr[2];
				ShowContent();
				
				break;
		}
	});

	$(".labelBut, .poi").tap(function () {
		var arr = this.id.split("");
		if(arr[0] == "l"){
			currentLocation = arr[1];
			$(".l0, .l1, .l2, .l3").addClass("off");
			switch (this.id) {
				case "l0":
					pz2.zoom(0.75);
					pz2.x(-950);
					pz2.y(-950);
					$(".l0").removeClass("off");
					break;
				case "l1":
					pz2.zoom(0.75);
					pz2.x(-900);
					pz2.y(-860);
					$(".l1").removeClass("off");
					break;
				case "l2":
					pz2.zoom(0.75);
					pz2.x(-615);
					pz2.y(-600);
					$(".l2").removeClass("off");
					break;
				case "l3":
					pz2.zoom(0.5);
					pz2.x(-325);
					pz2.y(-300);
					$(".l3").removeClass("off");
					break;
			}
			$(".mapZoom").removeClass("mapl0 mapl1 mapl2 mapl3");
			$(".mapZoom").addClass("map" + this.id);
			$(":mobile-pagecontainer").pagecontainer("change", "#mapDetail", {changeHash: false});
		}else{
			currentSub = arr[1];
			ShowContent();
		}
		
	});

	$(".splashImage").click(function () {
		$(":mobile-pagecontainer").pagecontainer("change", "#landing", {changeHash: false});
	});

	$(".playButton").click(function () {
		if($(".playButton").hasClass("playing")){
			$("audio.sfx")[0].pause();
			$(".playButton").removeClass("playing");
		}else{
			$("audio.sfx")[0].play();
			$(".playButton").addClass("playing");
		}
	});
	
}

function startApp() {

}

function goBack() {
	isBack = true;
	if (pages.length > 0) $(":mobile-pagecontainer").pagecontainer("change", "#" + pages.pop(), {changeHash: false});
	else $(":mobile-pagecontainer").pagecontainer("change", "#landing", {changeHash: false});
}

function loadAudio(file){
	$("audio.sfx source").attr("src", file);
	$("audio.sfx")[0].load();
}

function onZoom(){
	if(pz.zoom() > 1.4){
		$("#map #zoomIn").addClass("disable");
	}else{
		$("#map #zoomIn").removeClass("disable");
	}
	if(pz.zoom() < 0.26){
		$("#map #zoomOut").addClass("disable");
	}else{
		$("#map #zoomOut").removeClass("disable");
	}

	if(pz2.zoom() > 1.4){
		$("#mapDetail #zoomIn").addClass("disable");
	}else{
		$("#mapDetail #zoomIn").removeClass("disable");
	}
	if(pz2.zoom() < 0.26){
		$("#mapDetail #zoomOut").addClass("disable");
	}else{
		$("#mapDetail #zoomOut").removeClass("disable");
	}
}

function ShowContent(){
	$(".page_content .titleBar h1").html(json.Menu[currentLocation].Title);
	$(".page_content .titleBar h2").html(json.Menu[currentLocation].Sub[currentSub].Title);
	$(".page_content .textContent p").html(json.Menu[currentLocation].Sub[currentSub].Page[0].Description);
	loadImage(0);
	$(".link_1, .link_2, .link_3").addClass("off");
	if(currentSub == 0){
		for(var a = 1; a < json.Menu[currentLocation].Sub[currentSub].Page.length; a++){
			var sltr = ".link_" + a;
			var sltr2 = "#icon_" + a;
			$(sltr).removeClass("off");
			$(sltr2).removeClass("iPhoto iAudio iPast");
			$(sltr2).addClass(json.Menu[currentLocation].Sub[currentSub].Page[a].Reference);
			$(sltr + " h3").html(json.Menu[currentLocation].Sub[currentSub].Page[a].Caption);
		}
	}
	$(":mobile-pagecontainer").pagecontainer("change", "#content", {changeHash: false});
}

function loadImage(page){
	console.log("GET PAGE " + page);
	$(".page_content .headerImage").attr("src", "content/content_" + currentLocation + "/" + json.Menu[currentLocation].Sub[currentSub].Page[page].Media.replace("_A.", "_B."));
	var imageUrl = "content/content_" + currentLocation + "/" + json.Menu[currentLocation].Sub[currentSub].Page[page].Media;
	$('.fullImage').css('background-image', 'url("' + imageUrl + '")');
	$(".page_content .headerImage").attr("alt", json.Menu[currentLocation].Sub[currentSub].Page[page].Caption);
	if(json.Menu[currentLocation].Sub[currentSub].Page[page].Caption != ""){
		$(".page_content .captionP").html(json.Menu[currentLocation].Sub[currentSub].Page[page].Caption);
		$(".page_content .captionP").removeClass("off");
	}else{
		$(".page_content .captionP").addClass("off");
	}
	if(page == 0 || currentSub == 0){
		$(".but#prev").addClass("disable");
	}else{
		$(".but#prev").removeClass("disable");
	}
	if(page == json.Menu[currentLocation].Sub[currentSub].Page.length-1 || currentSub == 0){
		$(".but#next").addClass("disable");
	}else{
		$(".but#next").removeClass("disable");
	}
	pz3.zoom(1);
	pz3.x(-512);
	pz3.y(-512);
	currentIndex = page;
}

function DigDeeper(ind){
	switch(json.Menu[currentLocation].Sub[currentSub].Page[ind].Reference){
		case "iPhoto":
				pz3.zoom(1);
				pz3.x(-512);
				pz3.y(-512);
				var imageUrl = "content/content_" + currentLocation + "/" + json.Menu[currentLocation].Sub[currentSub].Page[ind].Media;
				$('.fullImage').css('background-image', 'url("' + imageUrl + '")');
				$(":mobile-pagecontainer").pagecontainer("change", "#full", {changeHash: false});
		break;
		case "iPast":
			initMatch();
			$(":mobile-pagecontainer").pagecontainer("change", "#match", {changeHash: false});
		break;
		case "iAudio":
			$(".page_playAudio .titleBar h1").html(json.Menu[currentLocation].Title);
			$(".page_playAudio .titleBar h2").html(json.Menu[currentLocation].Sub[currentSub].Page[ind].Caption);
			$(".page_playAudio .textContent p").html(json.Menu[currentLocation].Sub[currentSub].Page[ind].Description);
			$(".proBar").css("width", "0%");
			$(".playButton").addClass("playing");
			$(":mobile-pagecontainer").pagecontainer("change", "#playAudio", {changeHash: false});
			loadAudio("audio/" + json.Menu[currentLocation].Sub[currentSub].Page[ind].Audio);
			interval = setInterval(checkAudio, 1000);
		break;
	}
}

function checkAudio(){
	if($("audio.sfx")[0].currentTime) {
		percent = ($("audio.sfx")[0].currentTime / $("audio.sfx")[0].duration)*100;
		
		$(".proBar").css("width", (percent) + "%");
		if(percent == 100){
			$(".playButton").removeClass("playing");
		}
	}else{
		$(".playButton").addClass("playing");
	}
}

function initMatch(){
	StartCamera();
	$(".cameraGuide").animate({opacity: 0.5}, 1000);
	$(".cameraOld").hide();
	$(".instructionHolder").show();
	$(".cameraGuide").click(function () {
		$(".cameraOld").show();
		$(".cameraGuide").animate({opacity: 0}, 1000);
		$(".instructionHolder").hide();
		video.srcObject = null;
		//$(".cameraGuide").css("background-image", "none");
	});
}

function StartCamera(){
	console.log("START CAMERA");
	if(navigator && navigator.mediaDevices){
		console.log("camera supported");
    	const options = { audio: false, video: { facingMode: "environment", width: 1920, height: 1080  } }
		navigator.mediaDevices.getUserMedia(options)
		.then(function(stream) {
			
			video.srcObject = stream;
			video.onloadedmetadata = function(e) {
			video.play();
			};
		})
		.catch(function(err) {
			//Handle error here
		});
	}else{
		console.log("camera API is not supported by your browser");
		
	}
}

