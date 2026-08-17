const API_URL = "http://localhost:5000/api/stories";


// =====================================================
// CREATE / PUBLISH STORY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const storyForm = document.getElementById("storyForm");

    if (storyForm) {

        storyForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const publishButton =
                storyForm.querySelector(".publish-button");

            const title =
                document.getElementById("title")?.value.trim();

            const start =
                document.getElementById("start")?.value.trim();

            const destination =
                document.getElementById("destination")?.value.trim();

            const transport =
                document.getElementById("transport")?.value;

            const costValue =
                document.getElementById("cost")?.value;

            const route =
                document.getElementById("route")?.value.trim();

            const experience =
                document.getElementById("experience")?.value.trim();

            const tips =
                document.getElementById("tips")?.value.trim();

            if (
                !title ||
                !start ||
                !destination ||
                !transport ||
                !costValue ||
                !route ||
                !experience
            ) {

                alert("Please fill all required fields.");
                return;
            }

            const cost = Number(costValue);

            if (!Number.isFinite(cost) || cost < 0) {

                alert("Please enter a valid travel cost.");
                return;
            }

            const storyData = {
                title,
                start,
                destination,
                transport,
                cost,
                route,
                experience,
                tips
            };

            try {

                if (publishButton) {
                    publishButton.disabled = true;
                    publishButton.textContent = "Publishing...";
                }

                const response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(storyData)

                });

                const responseText =
                    await response.text();

                let result = {};

                try {

                    result = JSON.parse(responseText);

                } catch {

                    result = {
                        message: responseText
                    };

                }

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        `Server error: ${response.status}`
                    );

                }

                console.log(
                    "Published story:",
                    result.story
                );

                alert(
                    result.message ||
                    "Travel story published successfully!"
                );

                storyForm.reset();

                window.location.href = "index.html#stories";

            } catch (error) {

                console.error(
                    "Publish story error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to publish the travel story."
                );

            } finally {

                if (publishButton) {

                    publishButton.disabled = false;

                    publishButton.textContent =
                        "Publish My Experience";

                }

            }

        });

    }


    // =================================================
    // SEARCH ENTER KEY
    // =================================================

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchStories();

                }

            }
        );

    }


    // =================================================
    // LOAD STORIES
    // =================================================

    loadStories();

});


// =====================================================
// LOAD STORIES
// =====================================================

async function loadStories() {

    const container =
        document.getElementById("storiesContainer");

    if (!container) {
        return;
    }

    try {

        container.innerHTML = `
            <div class="empty-stories">
                <p>Loading travel stories...</p>
            </div>
        `;

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load travel stories."
            );

        }

        const stories =
            await response.json();

        if (!Array.isArray(stories)) {

            throw new Error(
                "Invalid stories response from server."
            );

        }

        renderStories(
            stories,
            container
        );

    } catch (error) {

        console.error(
            "Load stories error:",
            error
        );

        container.innerHTML = `

            <div class="stories-error">

                <h3>
                    Unable to load stories
                </h3>

                <p>
                    Make sure the TravelStories backend
                    is running.
                </p>

                <button
                    type="button"
                    onclick="loadStories()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// =====================================================
// SEARCH STORIES
// =====================================================

async function searchStories(searchValue = null) {

    const input =
        document.getElementById("searchInput");

    const container =
        document.getElementById("storiesContainer");

    if (!container) {

        console.error(
            "Stories container not found."
        );

        return;
    }

    const originalSearch =
        searchValue !== null
            ? String(searchValue).trim()
            : input
                ? input.value.trim()
                : "";

    const searchTerm =
        normalizeText(originalSearch);

    console.log(
        "Searching for:",
        searchTerm
    );

    if (!searchTerm) {

        await loadStories();

        scrollToStories();

        return;
    }

    try {

        container.innerHTML = `

            <div class="empty-stories">

                <p>
                    Searching for
                    "<strong>
                        ${escapeHTML(originalSearch)}
                    </strong>"...
                </p>

            </div>

        `;

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to search stories."
            );

        }

        const stories =
            await response.json();

        if (!Array.isArray(stories)) {

            throw new Error(
                "Invalid stories response from server."
            );

        }

        const filtered =
            stories.filter(function (story) {

                const searchableText = [

                    story.title,
                    story.start,
                    story.destination,
                    story.transport,
                    story.route,
                    story.experience,
                    story.tips

                ]

                    .filter(function (value) {

                        return (
                            value !== null &&
                            value !== undefined
                        );

                    })

                    .map(function (value) {

                        return normalizeText(value);

                    })

                    .join(" ");

                return searchableText.includes(
                    searchTerm
                );

            });

        console.log(
            "Total stories:",
            stories.length
        );

        console.log(
            "Matching stories:",
            filtered.length
        );

        if (filtered.length === 0) {

            container.innerHTML = `

                <div class="empty-stories">

                    <h3>
                        No stories found
                    </h3>

                    <p>
                        No travel story matches
                        "<strong>
                            ${escapeHTML(originalSearch)}
                        </strong>".
                    </p>

                    <p>
                        Try another place or destination.
                    </p>

                    <button
                        type="button"
                        onclick="clearSearch()"
                    >
                        Show All Stories
                    </button>

                </div>

            `;

            scrollToStories();

            return;
        }

        renderStories(
            filtered,
            container
        );

        scrollToStories();

    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        container.innerHTML = `

            <div class="stories-error">

                <h3>
                    Search failed
                </h3>

                <p>
                    Unable to search travel stories.
                    Please make sure the backend is running.
                </p>

                <button
                    type="button"
                    onclick="clearSearch()"
                >
                    Show All Stories
                </button>

            </div>

        `;

        scrollToStories();

    }

}


// =====================================================
// SEARCH PLACE
// =====================================================

function searchPlace(place) {

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.value = place;

    }

    searchStories(place);

}


// =====================================================
// CLEAR SEARCH
// =====================================================

async function clearSearch() {

    const input =
        document.getElementById("searchInput");

    if (input) {

        input.value = "";

    }

    await loadStories();

    scrollToStories();

}


// =====================================================
// VIEW STORY
// =====================================================

function viewStory(id) {

    if (!id) {

        console.error(
            "Invalid story ID:",
            id
        );

        return;
    }

    console.log(
        "Opening story:",
        id
    );

    window.location.href =
        "story.html?id=" +
        encodeURIComponent(id);

}


// =====================================================
// RENDER STORIES
// =====================================================

function renderStories(
    stories,
    container
) {

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !stories ||
        stories.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-stories">

                <h3>
                    No stories yet
                </h3>

                <p>
                    Be the first traveler to
                    share your journey.
                </p>

                <a href="create-story.html">
                    + Share Your Experience
                </a>

            </div>

        `;

        return;
    }

    stories.forEach(function (story) {

        const card =
            document.createElement("article");

        card.className =
            "story-card";

        card.innerHTML = `

            <div class="story-card-top">

                <span>
                    ${escapeHTML(
                        story.transport
                    )}
                </span>

                <strong>
                    ₹${Number(
                        story.cost || 0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>

            <h3>
                ${escapeHTML(
                    story.title
                )}
            </h3>

            <p>

                📍
                ${escapeHTML(
                    story.start
                )}

                →

                ${escapeHTML(
                    story.destination
                )}

            </p>

            <p>

                ${escapeHTML(
                    shortenText(
                        story.experience,
                        180
                    )
                )}

            </p>

            <button
                type="button"
                onclick="viewStory(${Number(story.id)})"
            >
                Read Story →
            </button>

        `;

        container.appendChild(card);

    });

}


// =====================================================
// SCROLL TO STORIES
// =====================================================

function scrollToStories() {

    const storiesSection =
        document.getElementById("stories");

    if (!storiesSection) {

        console.error(
            "Stories section not found."
        );

        return;
    }

    setTimeout(function () {

        storiesSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 100);

}


// =====================================================
// NORMALIZE SEARCH TEXT
// =====================================================

function normalizeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .normalize("NFKC")

        .toLowerCase()

        .trim()

        .replace(/\s+/g, " ");

}


// =====================================================
// SHORTEN TEXT
// =====================================================

function shortenText(
    text,
    maxLength
) {

    if (!text) {

        return "";

    }

    text = String(text);

    if (
        text.length <= maxLength
    ) {

        return text;

    }

    return (
        text.substring(
            0,
            maxLength
        ) +
        "..."
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}