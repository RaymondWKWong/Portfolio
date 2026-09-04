import "@testing-library/jest-dom";

global.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]);
  }
  unobserve() {}
  disconnect() {}
};
// JSDOM does not implement the native dialog methods. These shims exercise
// our state, cleanup and focus restoration; browser-owned focus trapping
// and Escape dispatch remain the responsibility of the dialog element.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
