const HOME = "https://pranayrk.github.io/notes";
const DIRECTORIES = "https://pranayrk.github.io/notes/directories";
const NOTES = "https://pranayrk.github.io/notes/notes";
const REVEAL = "https://pranayrk.github.io/notes/build/reveal.html";

function getURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

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

function loadNote(noteID) {
	if(!noteID) {
		return;
	}
	window.location = HOME + "?note=" + noteID;
}

async function goToNote(noteID) {
	if (!noteID) {
		return;
	}
	let noteDirectory = noteID.replace(/[^a-zA-Z]+/g, '');
	if(!noteDirectory) {
		return;
	}
	noteDirectory = noteDirectory.toLowerCase();
	const noteNumber = noteID.replace(/\D/g, '');
	if (noteNumber.length < 5) {
		return;
	}
	fetch(DIRECTORIES + "/" + noteDirectory + "/" + noteNumber.substring(0, 2) + ".yml")
		.then(res => res.text())
		.then(directoryString => {
			if (!directoryString) {
				return;
			}
			directoryMapping = YAML.parse(directoryString);
			if (!directoryMapping) {
				return;
			}
			const noteData = directoryMapping[noteNumber];
			if(!noteData)
			{ 
				return;
			}
			if('link' in noteData) {
				window.open(noteData['link'], '_blank');
				return;
			}
			if('markdown' in noteData) {
				fetch(REVEAL)
					.then(res => res.text())
					.then(revealHTML => {
						fetch(NOTES + "/" + noteDirectory + "/" + noteData['markdown'])
							.then(res => res.text())
							.then(note => {
								revealHTML = revealHTML.replace("{{MARKDOWN}}", note)
								document.open();
								document.write(revealHTML);
								document.close();
							})
					})
			}
		});
}

function loadDirectories() {
	fetch(REVEAL)
		.then(res => res.text())
		.then(revealHTML => {
			fetch(DIRECTORIES + "/directories.yml")
				.then(res => res.text())
				.then(directoriesString => {
					directories = YAML.parse(directoriesString);
					if(!directories) {
						return;
					}
					let directoryMarkdown = "";
					Object.keys(directories).forEach((key) => {
						directoryMarkdown += "* ["+ key + "]("+ HOME + "?directory=" + key + ")\n";
					})
					revealHTML = revealHTML.replace("{{MARKDOWN}}", directoryMarkdown);
					document.open();
					document.write(revealHTML);
					document.close();
				})
		})
}

async function goToDirectory(directory) {
	if(!directory) {
		return;
	}
	fetch(REVEAL)
		.then(res => res.text())
		.then(revealHTML => {
			fetch(DIRECTORIES + "/directories.yml")
				.then(res => res.text())
				.then(directoriesString => {
					directories = YAML.parse(directoriesString);
					directories[directory].forEach((directoryFile) => {
						fetch(DIRECTORIES + "/" + directory + "/" + directoryFile)
							.then(res => res.text())
							.then(directoryString => {
								directoryData = YAML.parse(directoryString);
								directoryMarkdown = "### " + directory + "\n\n"
								let slideCounter = 0;
								Object.keys(directoryData).forEach((key) => {
									if(!directoryData[key]) {
										return;
									}
									let link = "* **" +directory +  key + ":** [" + directoryData[key]["title"]+ "](" + HOME + "?note=" + directory + key + ")\n";
									directoryMarkdown += link;
									slideCounter++;
									if(slideCounter % 10 == 0) {
										directoryMarkdown += "\n\n---\n\n### " + directory + "\n\n";
									}

								});
								revealHTML = revealHTML.replace("{{MARKDOWN}}", directoryMarkdown);
								document.open();
								document.write(revealHTML);
								document.close();
							})
					})

				})
		})
}

note = getURLParameter("note")
directory = getURLParameter("directory")

if(directory) {
	goToDirectory(directory);
}
if(note)
{
	goToNote(note);
}
if(!directory && !note) {
	loadDirectories();
}
