document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projects-container");
    const loadLocalBtn = document.getElementById("load-local");
    const loadRemoteBtn = document.getElementById("load-remote");
    const MY_JSON_SERVER_URL = "https://my-json-server.typicode.com/lindseyrapp/HW5JSON/projects"; 

    async function fetchRemoteProjects() {
        try {
            const response = await fetch(MY_JSON_SERVER_URL);
            if (!response.ok) throw new Error("Failed to fetch remote projects");
            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Error fetching remote projects:", error);
            return [];
        }
    }

    function fetchLocalProjects() {
        return JSON.parse(localStorage.getItem("projects")) || [];
    }

    function saveProjectsToLocalStorage(projects) {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    async function loadProjects(source) {
        container.innerHTML = ""; // Clear previous projects

        let projects = [];
        if (source === "local") {
            projects = fetchLocalProjects();
        } else if (source === "remote") {
            projects = await fetchRemoteProjects();
            saveProjectsToLocalStorage(projects); // Cache remote projects locally
        }

        if (projects.length === 0) {
            container.innerHTML = "<p>No projects available.</p>";
            return;
        }

        projects.forEach(proj => {
            const projectElement = document.createElement("project-card");
            projectElement.setAttribute("title", proj.title);
            projectElement.setAttribute("description", proj.description);
            projectElement.setAttribute("full-description", proj.fullDescription || proj.description);
            projectElement.setAttribute("github", proj.github);
            projectElement.setAttribute("technologies", proj.technologies);
            projectElement.setAttribute("responsibilities", proj.responsibilities);
            projectElement.setAttribute("video", proj.video || "");

            if (proj.screenshotPrefix && proj.screenshotCount) {
                let screenshots = [];
                for (let i = 1; i <= proj.screenshotCount; i++) {
                    screenshots.push(`${proj.screenshotPrefix}${i}.png`);
                }
                projectElement.setAttribute("screenshots", screenshots.join('|'));
            }

            container.appendChild(projectElement);
        });
    }

    // Event Listeners
    loadLocalBtn.addEventListener("click", () => loadProjects("local"));
    loadRemoteBtn.addEventListener("click", () => loadProjects("remote"));
});
