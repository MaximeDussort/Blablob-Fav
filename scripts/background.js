let isProcessing = false;

async function ask_llm(bookmark, existingFolders) {
    const prompt = `
    Tu es une IA spécialisée dans l'organisation des bookmarks.
    Ta tâche est de classer le bookmark suivant : 
    - Titre : "${bookmark.title}"
    - URL : "${bookmark.url}"
    
    Utilise des mots de catégories courants comme "Loisirs", "Travail", "Informatique", "Voyages", etc.
    Voici la liste des catégories existantes : "${existingFolders.join('", "')}".
    
    Réponds uniquement avec un mot clair et précis correspondant à la catégorie la plus appropriée pour ce bookmark, sans ponctuation.
    `;
    //console.log(prompt);
    return await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': 'llama3.2:3b',
            'prompt': prompt,
            'stream': false
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
        return null;
    });
}

function findFolderByTitle(title) {
    return browser.bookmarks.search({ title }).then(results => {
        return results.find(result => result.title === title && result.type === 'folder');
    });
}

function getAllFolders() {
    return browser.bookmarks.search({}).then(results => {
        return results.filter(result => result.type === 'folder').map(folder => folder.title);
    });
}

browser.bookmarks.onCreated.addListener(function(id, bookmark) {
    if (isProcessing) return;
    isProcessing = true;

    getAllFolders().then(existingFolders => {
        ask_llm(bookmark, existingFolders).then(category => {
            //console.log(category);
            if (category) {
                findFolderByTitle(category.response).then(folder => {
                    if (folder) {
                        browser.bookmarks.move(bookmark.id, { parentId: folder.id });
                        isProcessing = false;
                    } else {
                        browser.bookmarks.create({ title: category.response }).then(newFolder => {
                            browser.bookmarks.move(bookmark.id, { parentId: newFolder.id });
                            isProcessing = false;
                        });
                    }
                });
            } else {
                isProcessing = false;
            }
        }).catch(() => {
            isProcessing = false;
        });
    });
});