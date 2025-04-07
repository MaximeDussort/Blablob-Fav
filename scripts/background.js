let isProcessing = false;

async function ask_llm(bookmark, existingFolders) {
    const prompt = `
    Tu es une intelligence artificielle spécialisée dans l'organisation des bookmarks (favoris).
    Ta mission est de classer le bookmark suivant dans une catégorie appropriée :
    - Titre : "${bookmark.title}"
    - URL : "${bookmark.url}"

    Voici la liste des catégories existantes : "${existingFolders.join('", "')}".

    Si aucune catégorie existante ne convient, crée une nouvelle catégorie. 
    Les nouvelles catégories doivent respecter les règles suivantes :
    - Le nom doit être clair, précis et représenter une catégorie logique.
    - Le nom ne doit SURTOUT PAS être "Blog", "Tags", "Étiquette", "Menu des Marque-Pages", "Favoris" ou encore "Marque-Pages".
    - Le nom ne doit pas être trop long (maximum 2 mots).
    - Le nom ne doit pas être un acronyme ou une abréviation.
    - Le nom ne doit pas être un nom propre ou une marque déposée.
    - Le nom ne doit pas être un verbe ou une action.
    - Le nom ne doit pas être un adjectif ou une description.

    Réponds uniquement avec un mot correspondant au nom de la catégorie la plus appropriée, sans ponctuation ni texte supplémentaire.
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