var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// react-multistep.js
__export(exports, {
  default: () => MultiStep
});
var import_react = __toModule(require("react"));

// node_modules/goober/dist/goober.modern.js
var e = { data: "" };
var t = (t2) => typeof window == "object" ? ((t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign((t2 || document.head).appendChild(document.createElement("style")), { innerHTML: " ", id: "_goober" })).firstChild : t2 || e;
var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/g;
var a = /\/\*[^]*?\*\/|\s\s+|\n/g;
var o = (e2, t2) => {
  let r, l2 = "", a2 = "", n2 = "";
  for (let c2 in e2) {
    let s2 = e2[c2];
    typeof s2 == "object" ? (r = t2 ? t2.replace(/([^,])+/g, (e3) => c2.replace(/([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : c2, a2 += c2[0] == "@" ? c2[1] == "f" ? o(s2, c2) : c2 + "{" + o(s2, c2[1] == "k" ? "" : t2) + "}" : o(s2, r)) : c2[0] == "@" && c2[1] == "i" ? l2 = c2 + " " + s2 + ";" : (c2 = c2.replace(/[A-Z]/g, "-$&").toLowerCase(), n2 += o.p ? o.p(c2, s2) : c2 + ":" + s2 + ";");
  }
  return n2[0] ? (r = t2 ? t2 + "{" + n2 + "}" : n2, l2 + r + a2) : l2 + a2;
};
var n = {};
var c = (e2) => {
  let t2 = "";
  for (let r in e2)
    t2 += r + (typeof e2[r] == "object" ? c(e2[r]) : e2[r]);
  return t2;
};
var s = (e2, t2, r, s2, i2) => {
  let p2 = typeof e2 == "object" ? c(e2) : e2, u2 = n[p2] || (n[p2] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; )
      r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(p2));
  if (!n[u2]) {
    let t3 = typeof e2 == "object" ? e2 : ((e3) => {
      let t4, r2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); )
        t4[4] && r2.shift(), t4[3] ? r2.unshift(r2[0][t4[3]] = r2[0][t4[3]] || {}) : t4[4] || (r2[0][t4[1]] = t4[2]);
      return r2[0];
    })(e2);
    n[u2] = o(i2 ? { ["@keyframes " + u2]: t3 } : t3, r ? "" : "." + u2);
  }
  return ((e3, t3, r2) => {
    t3.data.indexOf(e3) == -1 && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(n[u2], t2, s2), u2;
};
var i = (e2, t2, r) => e2.reduce((e3, l2, a2) => {
  let n2 = t2[a2];
  if (n2 && n2.call) {
    let e4 = n2(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n2 = t3 ? "." + t3 : e4 && typeof e4 == "object" ? e4.props ? "" : o(e4, "") : e4;
  }
  return e3 + l2 + (n2 == null ? "" : n2);
}, "");
function p(e2) {
  let r = this || {}, l2 = e2.call ? e2(r.p) : e2;
  return s(l2.unshift ? l2.raw ? i(l2, [].slice.call(arguments, 1), r.p) : l2.reduce((e3, t2) => t2 ? Object.assign(e3, t2.call ? t2(r.p) : t2) : e3, {}) : l2, t(r.target), r.g, r.o, r.k);
}
var u;
var f;
var d;
var g = p.bind({ g: 1 });
var b = p.bind({ k: 1 });
function h(e2, t2, r, l2) {
  o.p = t2, u = e2, f = r, d = l2;
}
function j(e2, t2) {
  let r = this || {};
  return function() {
    let l2 = arguments;
    function a2(o2, n2) {
      let c2 = Object.assign({}, o2), s2 = c2.className || a2.className;
      r.p = Object.assign({ theme: f && f() }, c2), r.o = / *go\d+/.test(s2), c2.className = p.apply(r, l2) + (s2 ? " " + s2 : ""), t2 && (c2.ref = n2);
      let i2 = c2.as || e2;
      return delete c2.as, d && i2[0] && d(c2), u(i2, c2);
    }
    return t2 ? t2(a2) : a2;
  };
}

// react-multistep.js
h(import_react.default.createElement);
var Ol = j("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`;
var LiClass = (props) => p`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${props.state === "todo" ? "silver" : "black"};
  border-bottom: 4px solid ${props.state === "todo" ? "silver" : "#33C3F0"};

  &::before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${props.state === "todo" ? 'content: "\u039F";' : props.state === "doing" ? 'content: "\u2022";' : 'content: "\u2713";'}
    color: ${props.state === "todo" ? "silver" : "white"};
    background-color: ${props.state === "todo" ? "white" : "#33C3F0"};  
    width: 1.2em;
    line-height: ${props.state === "todo" ? "1.2em" : "1.4em"};
    border-radius: ${props.state === "todo" ? "0" : "1.2em"};
  }
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
`;
var getTopNavStyles = (indx, length) => {
  const styles = [];
  for (let i2 = 0; i2 < length; i2++) {
    if (i2 < indx) {
      styles.push("done");
    } else if (i2 === indx) {
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
      showPreviousBtn: true,
      showNextBtn: true
    };
  } else if (indx === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true
    };
  } else {
    return {
      showPreviousBtn: true,
      showNextBtn: false
    };
  }
};
function MultiStep(props) {
  let showNav = true;
  const { activeComponentClassName, inactiveComponentClassName } = props;
  if (props.showNavigation)
    showNav = props.showNavigation;
  const [stylesState, setStyles] = (0, import_react.useState)(getTopNavStyles(0, props.steps.length));
  const [compState, setComp] = (0, import_react.useState)(0);
  const [buttonsState, setButtons] = (0, import_react.useState)(getButtonsState(0, props.steps.length));
  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length));
    setComp(indx < props.steps.length ? indx : compState);
    setButtons(getButtonsState(indx, props.steps.length));
  };
  const next = () => setStepState(compState + 1);
  const previous = () => setStepState(compState > 0 ? compState - 1 : compState);
  const handleKeyDown = (evt) => evt.which === 13 ? next(props.steps.length) : {};
  const handleOnClick = (evt) => {
    if (evt.currentTarget.value === props.steps.length - 1 && compState === props.steps.length - 1) {
      setStepState(props.steps.length);
    } else {
      setStepState(evt.currentTarget.value);
    }
  };
  const renderSteps = () => props.steps.map((s2, i2) => /* @__PURE__ */ import_react.default.createElement("li", {
    className: LiClass({ state: stylesState[i2] }),
    onClick: handleOnClick,
    key: i2,
    value: i2
  }, /* @__PURE__ */ import_react.default.createElement("span", null, i2 + 1)));
  const renderNav = (show) => show && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("button", {
    style: buttonsState.showPreviousBtn ? props.prevStyle : { display: "none" },
    onClick: previous
  }, "Prev"), /* @__PURE__ */ import_react.default.createElement("button", {
    style: buttonsState.showNextBtn ? props.nextStyle : { display: "none" },
    onClick: next
  }, "Next"));
  return /* @__PURE__ */ import_react.default.createElement("div", {
    onKeyDown: handleKeyDown
  }, /* @__PURE__ */ import_react.default.createElement(Ol, null, renderSteps()), inactiveComponentClassName ? props.steps.map((step, index) => {
    const className = index === compState ? activeComponentClassName : inactiveComponentClassName;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className,
      key: index
    }, step.component);
  }) : /* @__PURE__ */ import_react.default.createElement("div", null, props.steps[compState].component), /* @__PURE__ */ import_react.default.createElement("div", null, renderNav(showNav)));
}
