const HOME = "https://pranayrk.github.io/notes/";
const NOTES = HOME + "notes/";
const REVEAL = HOME + "bin/reveal.html";

function getURLParameter(param) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var parameterName = sURLVariables[i].split('=');
        if (parameterName[0] == param) {
            return parameterName[1];
        }
    }
}

function loadCode(code) {
    if(!code) {
        window.location = HOME;
        return;
    }
    window.location = HOME + "?goTo=" + code
}

function loadMap(map) {
    let lines = map.split('\n');
    let content = ""
    let linkcounter = 0
    for(let i = 0; i < lines.length; i++){
        if (lines[i].includes(" ... ")) {
            let add = lines[i].split(" ... ")
            if (add.length == 3) {
                content += "* [" + add[0] + ": " + add[1] + "](" + add[2] + ")\n"
            } else {
                content += "* Error in " + lines[i]
            }
        }
        else {
            content += lines[i] + "\n"
        }
        linkcounter++;
        if (linkcounter % 10 == 0) {
            content += "\n\n---\n\n"
        }
    }
    loadMarkdown(content)
}


function goTo(code) {
    if(!code) {
        return;
    }
    const path = code.replaceAll(".", "/")
    let mapFile = path.substring(0, path.lastIndexOf("/"))
    let note = path.substring(path.lastIndexOf("/") + 1)
    if (!mapFile) {
        mapFile = note;
        note = ""
    }
    fetch(NOTES + mapFile + "/" + mapFile + ".dir")
        .then(function(response) {
            if (!response.ok) {
                loadMarkdown(code + " not found")
            } else {
                return response.text()
            }
        })
        .then(map => {
            if (!note) {
                loadMap(map)
            } else {
                loadNote(map, note)
            }
        })
    // Handle not found
}

function load(content) {
    fetch(REVEAL)
        .then(res => res.text())
        .then(revealHTML => {
            revealHTML = revealHTML.replace("{{REVEAL}}", content);
            document.open();
            document.write(revealHTML);
            document.close();
        })
}

function loadMarkdown(content) {
    load("<section data-markdown>\n" + content + "\n</section>")
}

function loadSection(content) {
    load("<section>\n" + content + "\n</section>")
}

function loadHome() { 
    const home = "# Notes\n#### Pranay Raja Krishnan"
    loadMarkdown(home)
}

function linkEvent(e) {
    var e = window.e || e;
    console.log(e.target.tagname)

    if (e.target.tagName !== 'A' && e.target.tagName !== 'a') {
        return;
    }
    console.log(e)
    e.preventDefault(); 
    console.log("HERE")
    return false;  
}

function attachLinkEvent() {
    if (document.addEventListener) {
        console.log("ADD1")
        document.addEventListener('click', linkEvent, false);
    }
    else {
        console.log("ADD1")
        document.attachEvent('onclick', linkEvent);
    }
}


attachLinkEvent();
code = getURLParameter("goTo")

if(!code) {
    loadHome();
}
else {
    goTo(code);
}
