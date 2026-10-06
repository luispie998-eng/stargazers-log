const repositoryList = document.querySelector("#repository-list");

function renderRepositories(events) {
  repositoryList.replaceChildren();

  for (const event of events) {
    const item = document.createElement("li");
    item.className = "repository";

    const link = document.createElement("a");
    link.href = event.url;
    link.textContent = event.repository;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const description = document.createElement("p");
    description.textContent = event.description;

    const date = document.createElement("time");
    date.dateTime = event.starredAt;
    date.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium"
    }).format(new Date(`${event.starredAt}T00:00:00`))}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Failed to load repositories (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data.events)) {
      throw new Error("Repository data must contain an events array");
    }

    renderRepositories(data.events);
  } catch (error) {
    const message = document.createElement("li");
    message.className = "status-message";
    message.setAttribute("role", "alert");
    message.textContent = "Could not load starred repositories. Please try again later.";
    repositoryList.replaceChildren(message);
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();
