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

    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'model': 'llama3.2',
                'prompt': prompt,
                'stream': false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return null;
    }
}

function findFolderByTitle(title, callback) {
    chrome.bookmarks.search({ title }, function (results) {
        const folder = results.find(result => result.title === title && !result.url); // Dans Chrome, les dossiers n'ont pas d'URL
        callback(folder);
    });
}

function getAllFolders(callback) {
    chrome.bookmarks.getTree(function (tree) {
        const folders = [];

        function traverseTree(nodes) {
            for (const node of nodes) {
                if (!node.url) { // C'est un dossier
                    folders.push(node.title);
                }
                if (node.children) {
                    traverseTree(node.children);
                }
            }
        }

        traverseTree(tree);
        callback(folders);
    });
}

chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
    if (isProcessing) return;
    isProcessing = true;

    getAllFolders(function (existingFolders) {
        ask_llm(bookmark, existingFolders)
            .then(category => {
                if (category) {
                    findFolderByTitle(category.response, function (folder) {
                        if (folder) {
                            chrome.bookmarks.move(id, { parentId: folder.id }, function () {
                                isProcessing = false;
                            });
                        } else {
                            chrome.bookmarks.create({ title: category.response, parentId: '1' }, function (newFolder) {
                                chrome.bookmarks.move(id, { parentId: newFolder.id }, function () {
                                    isProcessing = false;
                                });
                            });
                        }
                    });
                } else {
                    isProcessing = false;
                }
            })
            .catch(() => {
                isProcessing = false;
            });
    });
});