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

function loadMap(mapFile, map) {
    let lines = map.split('\n');
    let content = ""
    let linkcounter = 0
    for(let i = 0; i < lines.length; i++){
        if (lines[i].includes(" ... ")) {
            let add = lines[i].split(" ... ")
            if (add.length == 3) {
                content += "* [" + mapFile.replaceAll("/",".") + "." + add[0] + ": " + add[1] + "](" + add[2] + ")\n"
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
                loadMap(mapFile, map)
            } else {
                // go line by line to find the note
                //simulate link click with the note link
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

function attachLinkEvent() {
    console.log("TEST6")
    document.addEventListener('click', function (e) {
        if (e.target.nodeName == 'A') {
            e.preventDefault();
            link = e.srcElement.attributes.href.textContent;
            console.log(link)
            if(link.endsWith(".md") || link.endsWith(".rv") || link.endsWith(".dir")) {
                console.log("HERE")
                handleNote() //or handle here itself and handlenote should simulate a link click
            } 
            else if (link.startsWith(HOME)) {
                window.location.href = link;
            }
            else {
                window.open(link)
            }
            return false;
        }
    });
}

code = getURLParameter("goTo")

if(!code) {
    loadHome();
}
else {
    goTo(code);
}
