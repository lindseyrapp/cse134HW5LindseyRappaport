class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    max-width: 600px;
                    margin: 10px auto;
                    border-radius: 10px;
                    overflow: hidden;
                    background: var(--secondary-color);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    text-align: center;
                }
                :host(:hover) {
                    transform: scale(1.03);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                }
                .card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px;
                    background: var(--secondary-color);
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                    
                @media (min-width: 1200px) {
                    :host {
                        max-width: 800px; /* Even wider on larger screens */
                    }
                }
                h2 {
                    font-size: clamp(2.1rem, 3.5vw, 4.2rem);
                    font-weight: bold;
                    margin: 12px 0;
                    color: var(--primary-color);
                    text-align: center;
                }
                p {
                    font-size: 1.5rem;
                    color: var(--text-color);
                    margin: 10px 0;
                    text-align: center;
                }
                .screenshots {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 10px;
                    margin: 15px 0;
                }
                .screenshots img {
                    width: 100px;
                    height: auto;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .screenshots img:hover {
                    transform: scale(1.1);
                }
                .video-container {
                    margin-top: 10px;
                    text-align: center;
                }
                iframe {
                    width: 100%;
                    border-radius: 10px;
                }
                a {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 10px 15px;
                    color: white;
                    background-color: var(--accent-color);
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 1.5rem;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                    cursor: pointer;
                    text-align: center;
                }
                a:hover {
                    background-color: var(--primary-color);
                }

            </style>
            <div class="card">
                <h2></h2>
                <div class="screenshots"></div>
                <div class="video-container"></div>
                <p></p>
                <h3>Technologies Used:</h3>
                <ul class="technologies"></ul>
                <h3>Responsibilities:</h3>
                <ul class="responsibilities"></ul>
                <p><a class="github-link" href="" target="_blank">GitHub Repository</a></p>
                <a class="read-more">Read More</a>
            </div>
        `;
    }
    connectedCallback() {
        const title = this.getAttribute('title') || 'Project Name';
        const description = this.getAttribute('description') || 'No description available.';
        const fullDescription = this.getAttribute('full-description') || description;
        const github = this.getAttribute('github') || '#';
        const video = this.getAttribute('video') || '';
        const screenshotsAttr = this.getAttribute('screenshots');
        const screenshots = screenshotsAttr ? screenshotsAttr.split('|') : [];

        // Set basic content
        this.shadowRoot.querySelector('h2').textContent = title;
        this.shadowRoot.querySelector('p').textContent = description;
        this.shadowRoot.querySelector('.github-link').href = github;

        // Populate Technologies
        const techList = this.shadowRoot.querySelector('.technologies');
        (this.getAttribute('technologies') || "").split('|').forEach(tech => {
            if (tech) techList.innerHTML += `<li>${tech}</li>`;
        });
        // Populate Responsibilities
        const respList = this.shadowRoot.querySelector('.responsibilities');
        (this.getAttribute('responsibilities') || "").split('|').forEach(resp => {
            if (resp) respList.innerHTML += `<li>${resp}</li>`;
        });
        // Load Screenshots
        const screenshotsContainer = this.shadowRoot.querySelector('.screenshots');
        if (screenshots.length > 0) {
            screenshots.forEach(src => {
                let img = document.createElement('img');
                img.src = src;
                img.alt = `${title} Screenshot`;
                img.addEventListener("click", () => this.openGlobalModal(src));
                screenshotsContainer.appendChild(img);
            });
        } else {
            screenshotsContainer.style.display = "none";
        }
        // Add YouTube Video if available
        if (video) {
            this.shadowRoot.querySelector('.video-container').innerHTML = `
                <iframe width="100%" height="200" src="${video}" frameborder="0" allowfullscreen></iframe>`;
        }
        // Handle "Read More" button
        this.shadowRoot.querySelector('.read-more').addEventListener("click", () => {
            localStorage.setItem("currentProject", JSON.stringify({
                title,
                screenshots: screenshots, // Save the full array of screenshots
                description: fullDescription, // Use full description for project.html
                technologies: this.getAttribute('technologies') || '',
                responsibilities: this.getAttribute('responsibilities') || '',
                github,
                video
            }));
            window.location.href = "project.html";
        });
    }
    openGlobalModal(imageSrc) {
        const modal = document.getElementById("fullscreen-modal");
        const modalImg = document.getElementById("modal-image");
        if (modal && modalImg) {
            modal.style.display = "flex";
            modalImg.src = imageSrc;
        }
    }
}
customElements.define('project-card', ProjectCard);
