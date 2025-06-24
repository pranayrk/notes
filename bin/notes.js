const HOME = "https://pranayrk.github.io/notes/";
const DIRECTORIES = HOME + "directories";
const NOTES = HOME + "notes";
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
    window.location = HOME + code ? "?goTo=" + code : ""
}

function goTo(code) {
    if(!code) {
        return;
    }
    const file = code.split('_').join("/")
    loadMarkdown(file)
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

code = getURLParameter("goTo")

if(!code) {
    loadHome();
}
else {
    goTo(code);
}
