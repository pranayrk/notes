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

///MAYBE REMOVE
function fetchFiles(urls)
{
    var list = [];
    var results = [];

    urls.forEach(function(url, i) {
        list.push(
            fetch(url).then(function(res){
                results[i] = res.blob(); 
            })
        );
    });
    Promise
        .all(list) // (4)
        .then(function() {
            return results;
        });
}

function goTo(code) {
    if(!code) {
        return;
    }
    window.location = HOME + "?goTo=" + code ;
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
    let home = "# Notes\n#### Pranay Raja Krishnan"
    loadMarkdown(home)
}

code = getURLParameter("goTo")

if(!code) {
    loadHome();
}
else {
    goTo(code);
}
