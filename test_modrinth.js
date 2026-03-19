const facetsList = [`["project_type:mod","project_type:modpack","project_type:resourcepack","project_type:shader","project_type:plugin"]`];
const facets = `[${facetsList.join(",")}]`;

const fetchUrl = `https://api.modrinth.com/v2/search?limit=24&offset=0&index=relevance&facets=${encodeURIComponent(JSON.stringify(facets))}`;
console.log("With JSON.stringify:", fetchUrl);

fetch(fetchUrl).then(r => console.log("JSON.stringify status:", r.status)).catch(console.error);

const fetchUrl2 = `https://api.modrinth.com/v2/search?limit=24&offset=0&index=relevance&facets=${encodeURIComponent(facets)}`;
console.log("Without JSON.stringify:", fetchUrl2);

fetch(fetchUrl2).then(r => console.log("Without JSON.stringify status:", r.status)).catch(console.error);
