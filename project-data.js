document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("projects-container");

    async function fetchProjectData() {
        try {
            const response = await fetch("projects.json");
            const projects = await response.json();
            return projects;
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    }

    function loadLocalProjects() {
        return JSON.parse(localStorage.getItem("projects")) || [];
    }

    async function loadProjects() {
        const remoteProjects = await fetchProjectData();
        const localProjects = loadLocalProjects();
        return [...localProjects, ...remoteProjects];
    }

    async function renderProjects() {
        const projects = await loadProjects();
        const container = document.getElementById("projects-container");
        container.innerHTML = ""; // Clear existing content
    
        projects.forEach(proj => {
            const projectElement = document.createElement("project-card");
            projectElement.setAttribute("title", proj.title);
            projectElement.setAttribute("description", proj.description);
            projectElement.setAttribute("github", proj.github);
            projectElement.setAttribute("technologies", proj.technologies);
            projectElement.setAttribute("responsibilities", proj.responsibilities);
            projectElement.setAttribute("video", proj.video || "");
    
            // Generate screenshot filenames dynamically (only if screenshotPrefix & screenshotCount exist)
            let screenshots = [];
            if (proj.screenshotPrefix && proj.screenshotCount) {
                for (let i = 1; i <= proj.screenshotCount; i++) {
                    screenshots.push(`${proj.screenshotPrefix}${i}.png`);
                }
            }
    
            // Only set the attribute if screenshots exist
            if (screenshots.length > 0) {
                projectElement.setAttribute("screenshots", screenshots.join('|'));
            }
    
            container.appendChild(projectElement);
        });
    }
    

    renderProjects();
});
