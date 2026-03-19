const { searchProjects } = require("./lib/api.ts");
searchProjects("sodium", 24, 0, `["categories:fabric"]`).then(res => console.log(res)).catch(err => console.error(err));
