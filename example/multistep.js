var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// ../src/MultiStep.jsx
var import_react = __toESM(require("react"));

// ../node_modules/goober/dist/goober.modern.js
var e = { data: "" };
var t = (t2) => "object" == typeof window ? ((t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign((t2 || document.head).appendChild(document.createElement("style")), { innerHTML: " ", id: "_goober" })).firstChild : t2 || e;
var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var a = /\/\*[^]*?\*\/|  +/g;
var n = /\n+/g;
var o = (e2, t2) => {
  let r = "", l2 = "", a2 = "";
  for (let n3 in e2) {
    let c2 = e2[n3];
    "@" == n3[0] ? "i" == n3[1] ? r = n3 + " " + c2 + ";" : l2 += "f" == n3[1] ? o(c2, n3) : n3 + "{" + o(c2, "k" == n3[1] ? "" : t2) + "}" : "object" == typeof c2 ? l2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n3.replace(/(^:.*)|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n3) : null != c2 && (n3 = /^--/.test(n3) ? n3 : n3.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n3, c2) : n3 + ":" + c2 + ";");
  }
  return r + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l2;
};
var c = {};
var s = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r in e2)
      t2 += r + s(e2[r]);
    return t2;
  }
  return e2;
};
var i = (e2, t2, r, i3, p2) => {
  let u2 = s(e2), d2 = c[u2] || (c[u2] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; )
      r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(u2));
  if (!c[d2]) {
    let t3 = u2 !== e2 ? e2 : ((e3) => {
      let t4, r2, o2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); )
        t4[4] ? o2.shift() : t4[3] ? (r2 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r2] = o2[0][r2] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d2] = o(p2 ? { ["@keyframes " + d2]: t3 } : t3, r ? "" : "." + d2);
  }
  let f2 = r && c.g ? c.g : null;
  return r && (c.g = c[d2]), ((e3, t3, r2, l2) => {
    l2 ? t3.data = t3.data.replace(l2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(c[d2], t2, i3, f2), d2;
};
var p = (e2, t2, r) => e2.reduce((e3, l2, a2) => {
  let n3 = t2[a2];
  if (n3 && n3.call) {
    let e4 = n3(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n3 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + l2 + (null == n3 ? "" : n3);
}, "");
function u(e2) {
  let r = this || {}, l2 = e2.call ? e2(r.p) : e2;
  return i(l2.unshift ? l2.raw ? p(l2, [].slice.call(arguments, 1), r.p) : l2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r.p) : t2), {}) : l2, t(r.target), r.g, r.o, r.k);
}
var d;
var f;
var g;
var b = u.bind({ g: 1 });
var h = u.bind({ k: 1 });
function m(e2, t2, r, l2) {
  o.p = t2, d = e2, f = r, g = l2;
}
function j(e2, t2) {
  let r = this || {};
  return function() {
    let l2 = arguments;
    function a2(n3, o2) {
      let c2 = Object.assign({}, n3), s2 = c2.className || a2.className;
      r.p = Object.assign({ theme: f && f() }, c2), r.o = / *go\d+/.test(s2), c2.className = u.apply(r, l2) + (s2 ? " " + s2 : ""), t2 && (c2.ref = o2);
      let i3 = e2;
      return e2[0] && (i3 = c2.as || e2, delete c2.as), g && i3[0] && g(c2), d(i3, c2);
    }
    return t2 ? t2(a2) : a2;
  };
}

// ../node_modules/goober/prefixer/dist/goober-autoprefixer.modern.js
var i2 = /* @__PURE__ */ new Map([["align-self", "-ms-grid-row-align"], ["color-adjust", "-webkit-print-color-adjust"], ["column-gap", "grid-column-gap"], ["gap", "grid-gap"], ["grid-template-columns", "-ms-grid-columns"], ["grid-template-rows", "-ms-grid-rows"], ["justify-self", "-ms-grid-column-align"], ["margin-inline-end", "-webkit-margin-end"], ["margin-inline-start", "-webkit-margin-start"], ["overflow-wrap", "word-wrap"], ["padding-inline-end", "-webkit-padding-end"], ["padding-inline-start", "-webkit-padding-start"], ["row-gap", "grid-row-gap"], ["scroll-margin-bottom", "scroll-snap-margin-bottom"], ["scroll-margin-left", "scroll-snap-margin-left"], ["scroll-margin-right", "scroll-snap-margin-right"], ["scroll-margin-top", "scroll-snap-margin-top"], ["scroll-margin", "scroll-snap-margin"], ["text-combine-upright", "-ms-text-combine-horizontal"]]);
function n2(n3, r) {
  let t2 = "";
  const a2 = i2.get(n3);
  a2 && (t2 += `${a2}:${r};`);
  const o2 = function(i3) {
    var n4 = /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|(?:mask(?:$|-[ispro]|-cl)))|(tab-|column(?!-s)|text-align-l)|(ap)|(u|hy))/i.exec(i3);
    return n4 ? n4[1] ? 1 : n4[2] ? 2 : n4[3] ? 3 : 5 : 0;
  }(n3);
  1 & o2 && (t2 += `-webkit-${n3}:${r};`), 2 & o2 && (t2 += `-moz-${n3}:${r};`), 4 & o2 && (t2 += `-ms-${n3}:${r};`);
  const l2 = function(i3, n4) {
    var r2 = /^(?:(pos)|(background-i)|((?:max-|min-)?(?:block-s|inl|he|widt))|(dis))/i.exec(i3);
    return r2 ? r2[1] ? /^sti/i.test(n4) ? 1 : 0 : r2[2] ? /^image-/i.test(n4) ? 1 : 0 : r2[3] ? "-" === n4[3] ? 2 : 0 : /^(inline-)?grid$/i.test(n4) ? 4 : 0 : 0;
  }(n3, r);
  return 1 & l2 ? t2 += `${n3}:-webkit-${r};` : 2 & l2 ? t2 += `${n3}:-moz-${r};` : 4 & l2 && (t2 += `${n3}:-ms-${r};`), t2 += `${n3}:${r};`, t2;
}

// ../src/MultiStep.jsx
m(import_react.default.createElement, n2);
var Breadcrumbs = j("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`;
var Li = j("li")`
  display: inline-block;
  text-align: center;
  line-height: 4.8rem;
  padding: 0 0.7rem;
  min-width: 5.5rem;
  cursor: pointer;

  color: silver;
  border-bottom: 2px solid silver;

  &:hover,
  &:before {
    color: #0FA0CE;
  }
  &:after {
    content: "\\00a0\\00a0";
  }   
  span {
    padding: 0 1.5rem;
  }
  &:before {
    position: relative;
    float: left;
    left: 50%;
    width: 1.3em;
    line-height: 1.4em;
    border-radius: 50%;
    bottom: -3.99rem;
  }
`;
var Navigation = j("ol")`
  margin: 0;
  padding-left: 2rem;
  list-style-type: none;
`;
var Todo = u`
  &:before {
    content: "\u039F";
    color: silver;
    background-color: white;
  }
`;
var Doing = u`
  &:before {
    content: "\u2022";
    color: white;
    background-color: #33C3F0;  
  }
`;
var Done = u`
  &:before {
    content: "\u2713";
    color: white;
    background-color: #33C3F0;
  }
`;
var getStep = (newIndex, length) => {
  if (newIndex <= length && newIndex > 0) {
    return newIndex - 1;
  }
  return 0;
};
var getTopNavStyles = (indx, length) => {
  const styles = [];
  for (let i3 = 0; i3 < length; i3++) {
    if (i3 < indx) {
      styles.push("done");
    } else if (i3 === indx) {
      styles.push("doing");
    } else {
      styles.push("todo");
    }
  }
  return styles;
};
var getButtonsState = (indx, length) => {
  if (indx > 0 && indx < length - 1) {
    return {
      showPrevious: true,
      showNext: true
    };
  } else if (indx === 0) {
    return {
      showPrevious: false,
      showNext: true
    };
  } else {
    return {
      showPrevious: true,
      showNextBtn: false
    };
  }
};
function MultiStep(props) {
  const styles = typeof props.styles === "undefined" ? "undefined" : props.styles;
  const showTitles = styles?.titles?.display;
  const showBreadcrumbs = styles?.breadcrumbs?.display;
  const Multistep = j("div")((props2) => ({
    width: "fit-content",
    background: styles?.main?.background ? styles?.main?.background : "white"
  }));
  const Step = j("div")((props2) => ({
    ["align-content"]: "center",
    background: styles?.step?.background ? styles?.main?.background : "white"
  }));
  const NavButton = j("button")((props2) => ({
    display: styles?.navButtons?.display ? styles.navButtons.display : "inline",
    color: styles?.navButtons?.color ? styles.navButtons.color : "white",
    background: styles?.navButtons?.background ? styles.navButtons.background : "#33C3F0",
    ["border-radius"]: styles?.navButtons?.["border-radius"] ? styles.navButtons["border-radius"] : "20px",
    ["&:disabled"]: {
      color: styles?.navButtons?.disabled?.color ? styles.navButtons.disabled.color : "white",
      background: styles?.navButtons?.disabled?.background ? styles.navButtons.disabled.background : "#33C3F0",
      border: styles?.navButtons?.disabled?.border ? styles.navButtons.disabled.border : "gray",
      cursor: styles?.navButtons?.disabled?.cursor ? styles.navButtons.disabled.cursor : "not-allowed!important"
    }
  }));
  const [activeStep, _] = (0, import_react.useState)(getStep(props.config?.activeStep, props.steps.length));
  const [stylesState, setStyles] = (0, import_react.useState)(getTopNavStyles(activeStep, props.steps.length));
  const [compState, setComp] = (0, import_react.useState)(activeStep);
  const [buttonsState, setButtons] = (0, import_react.useState)(getButtonsState(activeStep, props.steps.length));
  (0, import_react.useEffect)(() => {
    setStepState(activeStep);
  }, [activeStep]);
  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length));
    setComp(indx < props.steps.length ? indx : compState);
    setButtons(getButtonsState(indx, props.steps.length));
  };
  const next = () => setStepState(compState + 1);
  const previous = () => setStepState(compState > 0 ? compState - 1 : compState);
  const handleOnClick = (evt) => {
    if (evt.currentTarget.value === props.steps.length - 1 && compState === props.steps.length - 1) {
      setStepState(props.steps.length);
    } else {
      setStepState(evt.currentTarget.value);
    }
  };
  const renderBreadcrumbs = () => showBreadcrumbs && props.steps.map(
    (step, i3) => {
      return /* @__PURE__ */ import_react.default.createElement(
        Li,
        {
          className: stylesState[i3] === "todo" ? Todo : stylesState[i3] === "doing" ? Doing : Done,
          onClick: handleOnClick,
          key: i3,
          value: i3
        },
        showTitles && /* @__PURE__ */ import_react.default.createElement("span", null, step.title ?? i3 + 1)
      );
    }
  );
  const renderNavButtons = () => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, buttonsState.showPrevious ? /* @__PURE__ */ import_react.default.createElement(NavButton, { onClick: previous }, "Prev") : /* @__PURE__ */ import_react.default.createElement(NavButton, { disabled: true }, "Prev"), buttonsState.showNext ? /* @__PURE__ */ import_react.default.createElement(NavButton, { onClick: next }, "Next") : /* @__PURE__ */ import_react.default.createElement(NavButton, { disabled: true }, "next"));
  return /* @__PURE__ */ import_react.default.createElement(Multistep, null, /* @__PURE__ */ import_react.default.createElement(Breadcrumbs, null, renderBreadcrumbs()), /* @__PURE__ */ import_react.default.createElement(Step, null, props.steps[compState].component), /* @__PURE__ */ import_react.default.createElement(Navigation, null, renderNavButtons()));
}

// ../src/index.js
var src_default = MultiStep;
