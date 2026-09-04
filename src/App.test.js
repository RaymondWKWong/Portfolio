import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { screen, fireEvent, within } from "@testing-library/dom";
import App from "./App";
import { journey } from "./data/journey";
import { projects } from "./data/projects";
import { publications } from "./data/publications";
import { conferences } from "./data/conferences";

jest.mock(
  "./components/sections/Earth3D",
  () =>
    function Globe() {
      return <div data-testid="globe-preview" />;
    },
);
let root;
let container;
async function renderAt(path = "/") {
  window.history.replaceState({}, "", path);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<App />));
}
function click(element) {
  act(() => fireEvent.click(element));
}
function key(element, value) {
  act(() => fireEvent.keyDown(element, { key: value }));
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

test("preserves the original introduction, research, conferences, and contact destinations", async () => {
  await renderAt();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Building Amara, generating 3D worlds from a single prompt.",
  );
  publications.forEach((item) =>
    expect(screen.getByText(item.title)).toBeInTheDocument(),
  );
  conferences.forEach((item) =>
    expect(screen.getAllByText(item.name).length).toBeGreaterThan(0),
  );
  expect(screen.getByRole("link", { name: /Email me/ })).toHaveAttribute(
    "href",
    "mailto:raymond.wong@imperial.ac.uk",
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/RaymondWKWong",
  );
});

test("every chapter is present in the scrolling journey with its original text and links", async () => {
  await renderAt();
  journey.forEach((scene) => {
    const chapter = screen.getByRole("region", { name: scene.chapter });
    expect(
      within(chapter).getByRole("heading", { name: scene.headline }),
    ).toBeInTheDocument();
    scene.body.forEach((text) =>
      expect(within(chapter).getByText(text)).toBeInTheDocument(),
    );
    scene.pills?.forEach((text) =>
      expect(within(chapter).getByText(text)).toBeInTheDocument(),
    );
    scene.news?.forEach((item) =>
      expect(
        within(chapter).getByText(item.title).closest("a"),
      ).toHaveAttribute("href", item.url),
    );
  });
  const navigation = screen.getByRole("navigation", {
    name: "Journey chapters",
  });
  expect(within(navigation).getAllByRole("link")).toHaveLength(5);
  within(navigation)
    .getAllByRole("link")
    .forEach((link) =>
      expect(
        document.querySelector(link.getAttribute("href")),
      ).toBeInTheDocument(),
    );
});

test("all six cards flip to complete project details and links and restore keyboard focus", async () => {
  await renderAt();
  projects.forEach((project) => {
    const opener = screen.getByRole("button", {
      name: `View ${project.title} project details`,
    });
    act(() => opener.focus());
    click(opener);
    const details = screen.getByRole("region", {
      name: `${project.title} details`,
    });
    expect(within(details).getByText(project.details)).toBeInTheDocument();
    expect(
      within(details).getByText(project.outcome.replace(/&amp;/g, "&")),
    ).toBeInTheDocument();
    project.links.forEach((link) =>
      expect(
        within(details).getByRole("link", { name: link.label }),
      ).toHaveAttribute("href", link.href),
    );
    const close = within(details).getByRole("button", {
      name: `Close ${project.title} details`,
    });
    expect(close).toHaveFocus();
    click(close);
    expect(
      screen.queryByRole("region", { name: `${project.title} details` }),
    ).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});

test("Escape reverses an open project card", async () => {
  await renderAt();
  const opener = screen.getByRole("button", {
    name: "View IMC Prosperity project details",
  });
  click(opener);
  key(
    screen.getByRole("button", { name: "Close IMC Prosperity details" }),
    "Escape",
  );
  expect(
    screen.queryByRole("region", { name: "IMC Prosperity details" }),
  ).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
});

test("hackathon medals retain the original detailed posts and open with the keyboard", async () => {
  await renderAt();
  const medal = screen.getByRole("button", {
    name: "View IMC Prosperity Trading",
  });
  key(medal, "Enter");
  const details = screen.getByRole("dialog", {
    name: "IMC Prosperity Trading",
  });
  expect(
    within(details).getByText(/Out of 20,000 registered teams/),
  ).toBeInTheDocument();
  expect(
    within(details).getByRole("link", { name: /View on LinkedIn/ }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/feed/update/urn:li:activity:7321262190555009026/",
  );
  expect(within(details).getByRole("button", { name: "Close" })).toHaveFocus();
});

test("the original scrolling highlights can be paused", async () => {
  await renderAt();
  click(screen.getByRole("button", { name: "Pause highlights" }));
  expect(
    screen.getByRole("button", { name: "Play highlights" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("mobile navigation closes on Escape and section selection", async () => {
  await renderAt();
  click(screen.getByRole("button", { name: "Open menu" }));
  key(document, "Escape");
  expect(
    screen.queryByRole("navigation", { name: "Mobile primary" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
  click(screen.getByRole("button", { name: "Open menu" }));
  click(
    within(
      screen.getByRole("navigation", { name: "Mobile primary" }),
    ).getByRole("link", { name: "Work" }),
  );
  expect(window.location.hash).toBe("#work");
  expect(
    screen.queryByRole("navigation", { name: "Mobile primary" }),
  ).not.toBeInTheDocument();
});

test.each([
  ["/about", "#about"],
  ["/project", "#work"],
  ["/projects", "#work"],
])("preserves the %s legacy route", async (path, hash) => {
  await renderAt(path);
  expect(window.location.hash).toBe(hash);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("CV route preserves its embedded document and fallback", async () => {
  await renderAt("/resume");
  expect(screen.getByLabelText("Raymond Wong — CV")).toHaveAttribute(
    "type",
    "application/pdf",
  );
  expect(
    screen.getByRole("link", { name: "Download" }).getAttribute("href"),
  ).toMatch(/CV\.pdf/);
  expect(
    screen.getByRole("link", { name: /Open the CV in a new tab/ }),
  ).toBeInTheDocument();
});

test("clicking the current navigation destination scrolls again and respects reduced motion", async () => {
  await renderAt("/#work");
  const link = within(
    screen.getByRole("navigation", { name: "Primary" }),
  ).getByRole("link", { name: "Work" });
  const initialCalls = Element.prototype.scrollIntoView.mock.calls.length;
  click(link);
  click(link);
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(
    initialCalls + 2,
  );
  expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
    behavior: "auto",
    block: "start",
  });
});
