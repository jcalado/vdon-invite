function getById(id) { return document.getElementById(id); };
function log(message) { console.log(message); }
function error(message) { console.error(message); }

function copyFunction(copyText) {

	try {
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
	} catch(e) {
		var dummy = document.createElement('input');
		document.body.appendChild(dummy);
		dummy.value = copyText;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		return false;
	}
}

function popupMessage(e, message="☑ Copied to Clipboard"){
  
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
    } else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

	posx += 10;


	var menu = document.querySelector("#messagePopup");
	menu.innerHTML = "<center>"+message+"</center>";
	var menuState = 0;
	var menuWidth;
	var menuHeight;

	var windowWidth;
	var windowHeight;

    if ( menuState !== 1 ) {
		menuState = 1;
		menu.classList.add( "active" );
	}

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - posx) < menuWidth ) {
		menu.style.left = windowWidth - menuWidth + "px";
    } else {
		menu.style.left = posx + "px";
    }

    if ( (windowHeight - posy) < menuHeight ) {
		menu.style.top = windowHeight - menuHeight + "px";
    } else {
		menu.style.top = posy + "px";
    }
	
	function toggleMenuOff() {
		if ( menuState !== 0 ) {
		  menuState = 0;
		  menu.classList.remove( "active" );
		}
	}
	setTimeout(function(){toggleMenuOff();},1000);
	event.preventDefault();
}

function toggleObfuscate() {
    var url = getById('url');

    if (url.dataset.obfuscated == "true") {
        url.dataset.obfuscated = "false";
        url.href = url.dataset.raw;
        url.innerText = url.dataset.raw;
    } else {
        url.dataset.obfuscated = "true";
        url.href = obfuscateURL(url);
        url.innerText = obfuscateURL(url);
    }
}

function obfuscateURL(element) {
    input = element.href;

    if (input.startsWith("https://obs.ninja/")) {
        input = input.replace('https://obs.ninja/', '');
    } else if (input.startsWith("http://obs.ninja/")) {
        input = input.replace('http://obs.ninja/', '');
    } else if (input.startsWith("obs.ninja/")) {
        input = input.replace('obs.ninja/', '');
    }

    var key = "OBSNINJAFORLIFE";
    var encrypted = CryptoJS.AES.encrypt(input, key);
    var output = "https://invite.cam/" + encrypted.toString();
    return output;
}

function makeid(length) {
    var result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let jsonUrl = "data.json";

fetch(jsonUrl)
    .then((res) => res.json())
    .then((out) => {
        printSteps(out);
    })
    .catch((err) => {
        throw err;
    });

function printSteps(steps) {
    steps.forEach(function (step, index) {
        item = steps[index];

        var panel = document.createElement("div");
        panel.classList = ["panel"];

        var titleElement = document.createElement("span");
        titleElement.className = "title";
        titleElement.innerText = item.title;


        // Sliding expanding panels
        titleElement.addEventListener("click", function (evt) {
            if (evt.target !== this) return; // Do nothing

            this.parentElement.classList.toggle("active");
            var content = this.parentElement.querySelector(".answers");

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        var descriptionElement = document.createElement("span");
        descriptionElement.className = "description";
        descriptionElement.title = item.description;
        descriptionElement.addEventListener("click", function (evt) {
            if (evt.target !== this) return; // These are not the droids we are looking for

            var popupDescription = getById("popupDescription");
            popupDescription.innerText = descriptionElement.title;

            var rect = descriptionElement.getBoundingClientRect();
            var popup = getById("popup");

            var x = evt.x - popupDescription.getBoundingClientRect().width - 30;
            var y =
                evt.y -
                rect.height / 2 -
                popupDescription.getBoundingClientRect().height / 2;

            popup.style.left = x + "px";
            popup.style.top = y + "px";

            getById("popup").classList.toggle("active");
        });

        var answersElement = document.createElement("div");
        answersElement.className = "answers";

        var answersContainerElement = document.createElement("div");
        answersContainerElement.className = "answersContainer";

        panel.appendChild(titleElement);
        panel.appendChild(descriptionElement);

        item.answers.forEach(function (answer) {
            var el;
            switch (answer.type) {
                case "radio":
                    var switchGroupElement = document.createElement("div");
                    switchGroupElement.className = "switchGroup";

                    var label = document.createElement("label");
                    label.className = "switch";

                    el = document.createElement("input");
                    el.setAttribute("type", "radio");
                    el.setAttribute("name", answer.group);
                    el.setAttribute("data-param", answer.params);
                    el.setAttribute("onchange", "updateLink(this)");

                    if (answer.selected) {
                        el.setAttribute("checked", true);
                    }

                    el.innerText = answer.label;
                    el.id = answer.label;

                    label.appendChild(el);

                    var sliderElement = document.createElement("span");
                    sliderElement.className = "slider round";

                    label.appendChild(sliderElement);

                    switchGroupElement.appendChild(label);

                    var textElement = document.createElement("span");
                    textElement.innerText = answer.label;

                    switchGroupElement.appendChild(textElement);

                    answersContainerElement.appendChild(switchGroupElement);

                    break;
                case "toggle":
                    var switchGroupElement = document.createElement("div");
                    switchGroupElement.className = "switchGroup";

                    var label = document.createElement("label");
                    label.className = "switch";

                    el = document.createElement("input");
                    el.setAttribute("type", "checkbox");
                    el.setAttribute("data-param", answer.params);
                    el.setAttribute("onchange", "updateLink(this)");

                    el.innerText = answer.label;
                    el.id = answer.label;

                    label.appendChild(el);

                    var sliderElement = document.createElement("span");
                    sliderElement.className = "slider round";

                    label.appendChild(sliderElement);

                    switchGroupElement.appendChild(label);

                    var textElement = document.createElement("span");
                    textElement.innerText = answer.label;
                    textElement.title = answer.tooltip;

                    switchGroupElement.appendChild(textElement);

                    answersContainerElement.appendChild(switchGroupElement);

                    break;
                case "text":
                    var textGroupElement = document.createElement("div");
                    textGroupElement.className = "textGroup";

                    el = document.createElement("input");
                    el.setAttribute("type", "text");
                    el.setAttribute("data-param", answer.params);
                    el.setAttribute("onchange", "updateLink(this)");

                    var exampleElement = document.createElement("span");

                    switch (answer.params) {
                        case "&room":
                            var roomName = generateName();
                            exampleElement.className = 'click';
                            exampleElement.innerText = "Example room name: " + roomName;
                            exampleElement.addEventListener("click", function () {
                                el.value = roomName;
                                el.onchange();
                            });
                            break;
                        case "&push":
                            var pushid = makeid(10);
                            el.value = pushid;
                            getById('url').href = getById('url').href + "?push=" + pushid;
                            getById('url').innerText = getById('url').href;
                            getById('url').dataset.raw = getById('url').dataset.raw + "?push=" + pushid;
                            exampleElement.innerText = answer.label;
                            break;
                        default:
                            exampleElement.innerText = answer.label;
                            break;

                    }

                    textGroupElement.appendChild(exampleElement);
                    textGroupElement.appendChild(el);
                    answersContainerElement.appendChild(textGroupElement);
                    break;
                default:
                    break;
            }
            answersElement.appendChild(answersContainerElement);
            panel.appendChild(answersElement);
            getById("panels").appendChild(panel);
        });


    });
}


function updateLink(input) {

    if (input.getAttribute("type") == "text") {
        // Parameter value is  empty, remove it altogether.
        if (input.value.length == 0) {
            var param = input.dataset.param.replace("&", "")

            var url = getById("url").dataset.raw;

            // Parse url and get current param value
            var parsedUrl = new URL(getById("url").dataset.raw);
            var paramValue = parsedUrl.searchParams.get(param);
            url = url.replace("&" + param + "=" + paramValue, "");

            getById("url").dataset.raw = url;

            // Special case, room also impacts director URL
            if (param == 'room') {
                var directorUrl = getById('directorUrl').dataset.raw;
                directorUrl = directorUrl.replace("?" + param + "=" + paramValue, "");
                getById('directorUrl').innerText = directorUrl;
            }

            // Special case - If no push id is provided, generate a random one
            if (param == 'push') {
                var randomId = makeid(10);

                var url = getById('url').dataset.raw;
                url = url.replace("?push=" + paramValue, "?push=" + randomId);

                getById('url').innerText = url;
                getById('url').dataset.raw = url;

            }
        } else {
            // There's an actual input value, handle that
            var param = input.dataset.param.replace("&", "");

            // Parse url and get current param value
            var url = new URL(getById("url").dataset.raw);
            var currentParam = url.searchParams.get(param);

            // Sanitize the room name
            if (param == 'room') {
                input.value = input.value.replace(/[\W]+/g, "_");
            }

            // If the parameter is already present, change the value
            if (url.searchParams.has(param)) {
                url.searchParams.set(param, input.value);
                getById("url").dataset.raw = url.toString();
            } else {
                // There was no parameter with this name, so adding the string to the raw url
                getById("url").dataset.raw +=
                    input.dataset.param + "=" + input.value;
            }

            // Dealing with a room, update director URL as well
            if (param == 'room') {
                var directorUrl = getById('directorUrl').dataset.raw;
                getById('directorUrl').innerText = directorUrl + "?director=" + input.value;
                getById('directorUrl').href = directorUrl + "?director=" + input.value;
            }

            // Make the text the same as the raw data
            getById("url").innerText = getById("url").dataset.raw;
        }


    }

    // Checkbox checked, add the corresponding param
    if (input.checked) {
        
        // This is a radio button, handle removing other possible param from the url
        if (input.getAttribute("type") == "radio") {
            var otherGroupInputs = input.parentElement.parentElement.parentElement.querySelectorAll(
                'input[name="' + input.name + '"]'
            );
            otherGroupInputs.forEach((input) => {
                var param = input.dataset.param;
                getById("url").dataset.raw =
                    getById("url").dataset.raw.replace(param, "");
            });
        }

        // Add the param 
        getById("url").dataset.raw += input.dataset.param;
        var string = getById("url").dataset.raw;

        getById("url").innerText = string;
        getById("url").href = string;
    } else {
        // Input was unchecked
        var string = getById("url").dataset.raw + "&";
        string = string.replace(input.dataset.param + "&", "&");
        string = string.substring(0, string.length - 1);
        getById("url").dataset.raw = string;

        getById("url").href = string;
        getById("url").innerText = string;
    }

    // Toggle the director link panel
    if (getById("url").innerText.includes('&room')) {
        getById('directorLink').classList.add('show');
    } else {
        getById('directorLink').classList.remove('show');
    }

    var url = getById("url");

    if (url.dataset.obfuscated == "true") {
        url.href = obfuscateURL(url);
        url.innerText = obfuscateURL(url);
    }
}