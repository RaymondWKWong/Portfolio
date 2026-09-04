import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { screen, fireEvent, within } from "@testing-library/dom";
import App from "./App";
import { journey } from "./data/journey";
import { projects } from "./data/projects";
import { publications } from "./data/publications";
import { conferences } from "./data/conferences";

let root;
let container;
function renderAt(path = "/") {
  window.history.replaceState({}, "", path);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<App />));
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
  document.body.style.overflow = "";
});

test("retains the introduction, publications, conferences, and contact destinations", () => {
  renderAt();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "RaymondWong.",
  );
  expect(screen.getByText(/generating/, { selector: "p" })).toHaveTextContent(
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

test("every journey chapter exposes its original text, awards, and press links", () => {
  renderAt();
  const tabs = screen.getAllByRole("tab");
  journey.forEach((scene, index) => {
    click(tabs[index]);
    expect(tabs[index]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(
      within(panel).getByRole("heading", { name: scene.headline }),
    ).toBeInTheDocument();
    scene.body.forEach((text) =>
      expect(within(panel).getByText(text)).toBeInTheDocument(),
    );
    scene.pills?.forEach((text) =>
      expect(within(panel).getByText(text)).toBeInTheDocument(),
    );
    scene.news?.forEach((item) =>
      expect(
        within(panel).getByRole("link", {
          name: new RegExp(item.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        }),
      ).toHaveAttribute("href", item.url),
    );
  });
});

test("journey tabs support arrow keys, Home, End, and a single keyboard entry point", () => {
  renderAt();
  const tabs = screen.getAllByRole("tab");
  act(() => tabs[0].focus());
  key(tabs[0], "ArrowRight");
  expect(tabs[1]).toHaveFocus();
  expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
  key(tabs[1], "End");
  expect(tabs[4]).toHaveFocus();
  key(tabs[4], "ArrowRight");
  expect(tabs[0]).toHaveFocus();
  key(tabs[0], "ArrowLeft");
  expect(tabs[4]).toHaveFocus();
  key(tabs[4], "Home");
  expect(tabs[0]).toHaveFocus();
});

test("all six project dialogs retain full details and links, then restore focus and page scrolling", () => {
  renderAt();
  projects.forEach((project) => {
    const opener = screen.getByRole("button", {
      name: `View ${project.title} project details`,
    });
    act(() => opener.focus());
    click(opener);
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: project.title }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(project.details)).toBeInTheDocument();
    expect(
      within(dialog).getByText(project.outcome.replace(/&amp;/g, "&")),
    ).toBeInTheDocument();
    project.links.forEach((link) =>
      expect(
        within(dialog).getByRole("link", { name: link.label }),
      ).toHaveAttribute("href", link.href),
    );
    expect(document.body.style.overflow).toBe("hidden");
    expect(
      within(dialog).getByRole("button", { name: "Close project details" }),
    ).toHaveFocus();
    click(
      within(dialog).getByRole("button", { name: "Close project details" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});

test("native dialog cancellation closes the details and restores its trigger", () => {
  renderAt();
  const opener = screen.getByRole("button", {
    name: /View IMC Prosperity project details/,
  });
  act(() => opener.focus());
  click(opener);
  act(() =>
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { cancelable: true }),
    ),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
});

test("mobile menu supports dismissal and closes after section navigation", () => {
  renderAt();
  click(screen.getByRole("button", { name: "Open menu" }));
  expect(
    screen.getByRole("navigation", { name: "Mobile primary" }),
  ).toBeInTheDocument();
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
])("preserves the %s legacy route", (path, hash) => {
  renderAt(path);
  expect(window.location.hash).toBe(hash);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("CV route retains its embedded document and direct download fallback", () => {
  renderAt("/resume");
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

test("revisiting the current section anchor scrolls again with reduced motion respected", () => {
  renderAt("/#work");
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
