function loadReveal() {
    Reveal.initialize({
        width: 1240,
        height: 760,
        margin: 0.04,
        hash: true,
        plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.KaTeX]
    });
}

function load(content) {
    Reveal.destroy();
    slides = document.getElementsByClassName("slides")[0];
    slides.innerHTML = content;
    loadReveal();
    Reveal.slide(0);
}

function loadMarkdown(content) {
    load("<section data-markdown>\n" + content + "\n</section>")
}
