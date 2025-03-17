document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("projects-container");
    const loadLocalBtn = document.getElementById("load-local");
    const loadRemoteBtn = document.getElementById("load-remote");
    const searchInput = document.getElementById("project-search");
    const searchResults = document.getElementById("search-results");

    // Using My JSON Server for remote data
    const MY_JSON_SERVER_URL = "https://my-json-server.typicode.com/lindseyrapp/HW5JSON/projects";
    let projects = [];

    async function fetchRemoteProjects() {
        try {
            const response = await fetch(MY_JSON_SERVER_URL);
            if (!response.ok) throw new Error("Failed to fetch remote projects");
            const data = await response.json();
            console.log("Fetched remote projects:", data);
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
        searchResults.innerHTML = ""; // Clear search results

        if (source === "local") {
            projects = fetchLocalProjects();
        } else if (source === "remote") {
            projects = await fetchRemoteProjects();
            if (projects.length > 0) saveProjectsToLocalStorage(projects); // Cache remote projects locally
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

    // Helper function - highlight matching substring
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function updateSearchResults() {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = ""; // Clear previous results

        if (!query) {
            searchResults.style.display = "none";
            return;
        }

        // Search across multiple fields
        const matchingProjects = projects.filter(proj => {
            return (
                (proj.title && proj.title.toLowerCase().includes(query)) ||
                (proj.description && proj.description.toLowerCase().includes(query)) ||
                (proj.fullDescription && proj.fullDescription.toLowerCase().includes(query)) ||
                (proj.technologies && proj.technologies.toLowerCase().includes(query)) ||
                (proj.responsibilities && proj.responsibilities.toLowerCase().includes(query))
            );
        });

        if (matchingProjects.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        searchResults.style.display = "block";

        matchingProjects.forEach(proj => {
            let displayText = proj.title;
            if (proj.title && proj.title.toLowerCase().includes(query)) {
                displayText = highlightMatch(proj.title, query);
            } else if (proj.description && proj.description.toLowerCase().includes(query)) {
                displayText = proj.title + " - " + highlightMatch(proj.description, query);
            } else if (proj.fullDescription && proj.fullDescription.toLowerCase().includes(query)) {
                displayText = proj.title + " - " + highlightMatch(proj.fullDescription, query);
            } else if (proj.technologies && proj.technologies.toLowerCase().includes(query)) {
                displayText = proj.title + " - " + highlightMatch(proj.technologies, query);
            } else if (proj.responsibilities && proj.responsibilities.toLowerCase().includes(query)) {
                displayText = proj.title + " - " + highlightMatch(proj.responsibilities, query);
            }
            
            const resultItem = document.createElement("div");
            resultItem.classList.add("search-result");
            resultItem.innerHTML = displayText;  
            resultItem.addEventListener("click", () => {
                localStorage.setItem("currentProject", JSON.stringify(proj));
                window.location.href = "project.html"; // Navigate to project details page
            });
            searchResults.appendChild(resultItem);
        });
    }

    function hideSearchResults(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    }

    // Event Listeners
    loadLocalBtn.addEventListener("click", () => loadProjects("local"));
    loadRemoteBtn.addEventListener("click", () => loadProjects("remote"));
    searchInput.addEventListener("input", updateSearchResults);
    document.addEventListener("click", hideSearchResults);

    // Auto-load remote projects if local storage is empty
    if (fetchLocalProjects().length === 0) {
        await loadProjects("remote");
    } else {
        loadProjects("local");
    }
});
