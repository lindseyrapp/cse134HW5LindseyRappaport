class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    max-width: 900px; /* Wider default */
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
                        max-width: 1000px; /* Extra wide on big screens */
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
                    display: grid;
                    grid-template-columns: repeat(2, 1fr); /* Always 2x2 */
                    gap: 10px;
                    margin: 15px 0;
                    justify-items: center;
                    width: 100%;
                    max-width: 500px;
                }
                .screenshots img {
                    width: 100%;
                    max-width: 200px;
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
                    width: 100%;
                }
                iframe {
                    width: 100%;
                    border-radius: 10px;
                }
                .button-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 15px;
                    width: 100%;
                    max-width: 500px;
                }
                .button-container a {
                    display: inline-block;
                    padding: 12px 18px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 1.5rem;
                    border-radius: 5px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    text-align: center;
                    flex: 1; /* Make buttons equal width */
                }

                .github-link {
                    background-color: var(--primary-color);
                    color: white !important;
                    font-weight: bold;
                    padding: 12px 24px;
                    border-radius: 5px;
                    display: inline-block;
                    text-align: center;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    text-decoration: none;
                }

                /* Light mode hover */
                .github-link:hover {
                    background-color: #1a5276; /* Light mode GitHub hover */
                    transform: scale(1.05);
                    color: white !important;
                }

                /* Read More Button */
                .read-more {
                    background-color: var(--accent-color);
                    color: white;
                }
                .read-more:hover {
                    background-color: #135f92; /* Light mode Read More hover */
                    transform: scale(1.05);
                }

                /* Dark mode fixes */
                :host-context([data-theme="dark"]) .github-link {
                    background-color: var(--accent-color) !important;
                    color: white !important;
                }

                /* Dark mode - make GitHub hover match Read More */
                :host-context([data-theme="dark"]) .github-link:hover {
                    background-color: #135f92 !important; /* Same hover as Read More */
                    color: white !important;
                }

                :host-context([data-theme="dark"]) .read-more:hover {
                    background-color: #135f92 !important; /* Ensures Read More matches */
                    color: white !important;
                }

            </style>
            <div class="card">
                <h2></h2>
                <p class="short-description"></p>
                <div class="screenshots"></div>
                <div class="video-container"></div>
                <div class="button-container">
                    <a class="github-link" href="" target="_blank">GitHub</a>
                    <a class="read-more">Read More</a>
                </div>
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
        this.shadowRoot.querySelector('.short-description').textContent = description;
        this.shadowRoot.querySelector('.github-link').href = github;

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
