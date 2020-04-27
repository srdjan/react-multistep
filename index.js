let __defineProperty = Object.defineProperty;
let __hasOwnProperty = Object.hasOwnProperty;
let __modules = {};
let __require = (id) => {
  let module = __modules[id];
  if (!module) {
    module = __modules[id] = {
      exports: {}
    };
    __commonjs[id](module.exports, module);
  }
  return module.exports;
};
let __toModule = (module) => {
  if (module && module.__esModule) {
    return module;
  }
  let result = {};
  for (let key in module) {
    if (__hasOwnProperty.call(module, key)) {
      result[key] = module[key];
    }
  }
  result.default = module;
  return result;
};
let __import = (id) => {
  return __toModule(__require(id));
};
let __export = (target, all) => {
  __defineProperty(target, "__esModule", {
    value: true
  });
  for (let name in all) {
    __defineProperty(target, name, {
      get: all[name],
      enumerable: true
    });
  }
};
let __commonjs;
__commonjs = {
  0(exports) {
    // node_modules/goober/dist/goober.js
    var r = {
      data: ""
    }, t = function(t2) {
      try {
        var e2 = t2 ? t2.querySelector("#_goober") : self._goober;
        return e2 || ((e2 = (t2 || document.head).appendChild(document.createElement("style"))).innerHTML = " ", e2.id = "_goober"), e2.firstChild;
      } catch (r2) {
      }
      return r;
    }, e = /(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi, a = /\/\*.*?\*\/|\s{2,}|\n/gm, n = function(r2, t2, e2) {
      var a2 = "", o2 = "", s2 = "";
      for (var c2 in r2) {
        var i2 = r2[c2];
        if ("object" == typeof i2) {
          var u2 = t2 + " " + c2;
          /&/g.test(c2) && (u2 = c2.replace(/&/g, t2)), "@" == c2[0] && (u2 = t2, "f" == c2[1] && (u2 = c2)), /@k/.test(c2) ? o2 += c2 + "{" + n(i2, "", "") + "}" : o2 += n(i2, u2, u2 == t2 ? c2 : e2 || "");
        } else
          /^@i/.test(c2) ? s2 = c2 + " " + i2 + ";" : a2 += c2.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + i2 + ";";
      }
      if (a2.charCodeAt(0)) {
        var f2 = t2 + "{" + a2 + "}";
        return e2 ? o2 + e2 + "{" + f2 + "}" : s2 + f2 + o2;
      }
      return s2 + o2;
    }, o = {}, s = function(r2, t2, s2, c2) {
      var i2 = JSON.stringify(r2), u2 = o[i2] || (o[i2] = ".go" + i2.split("").reduce(function(r3, t3) {
        return 101 * r3 + t3.charCodeAt(0) >>> 0;
      }, 11));
      return function(r3, t3, e2) {
        t3.data.indexOf(r3) < 0 && (t3.data = e2 ? r3 + t3.data : t3.data + r3);
      }(o[u2] || (o[u2] = n(r2[0] ? function(r3) {
        for (var t3, n2 = [{}]; t3 = e.exec(r3.replace(a, "")); )
          t3[4] && n2.shift(), t3[3] ? n2.unshift(n2[0][t3[3]] = n2[0][t3[3]] || {}) : t3[4] || (n2[0][t3[1]] = t3[2]);
        return n2[0];
      }(r2) : r2, s2 ? "" : u2)), t2, c2), u2.slice(1);
    }, c = function(r2, t2, e2) {
      return r2.reduce(function(r3, a2, n2) {
        var o2 = t2[n2];
        if (o2 && o2.call) {
          var s2 = o2(e2), c2 = s2 && s2.props && s2.props.className || /^go/.test(s2) && s2;
          o2 = c2 ? "." + c2 : s2 && s2.props ? "" : s2;
        }
        return r3 + a2 + (null == o2 ? "" : o2);
      }, "");
    };
    function i(r2) {
      var e2 = this || {}, a2 = r2.call ? r2(e2.p) : r2;
      return s(a2.map ? c(a2, [].slice.call(arguments, 1), e2.p) : a2, t(e2.target), e2.g, e2.o);
    }
    var u, f = i.bind({
      g: 1
    });
    exports.styled = function(r2) {
      var t2 = this || {};
      return function() {
        var e2 = arguments;
        return function(a2) {
          var n2 = t2.p = Object.assign({}, a2), o2 = n2.className;
          return t2.o = /\s*go[0-9]+/g.test(o2), n2.className = i.apply(t2, e2) + (o2 ? " " + o2 : ""), u(r2, n2);
        };
      };
    }, exports.setPragma = function(r2) {
      return u = r2;
    }, exports.extractCss = function(r2) {
      var e2 = t(r2), a2 = e2.data;
      return e2.data = "", a2;
    }, exports.css = i, exports.glob = f;
  },

  1(exports) {
    // react-multistep.js
    __export(exports, {
      default: () => MultiStep
    });
    const react = __toModule(require("react"));
    const goober = __import(0 /* goober */);
    goober.setPragma(react.default.createElement);
    const Ol = goober.styled("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`;
    const LiClass = (props) => goober.css`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${props.state === "todo" ? "silver" : "black"};
  border-bottom: 4px solid ${props.state === "todo" ? "silver" : "#33C3F0"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${props.state === "todo" ? 'content: "Ο";' : props.state === "doing" ? 'content: "•";' : 'content: "✓";'}
    color: ${props.state === "todo" ? "silver" : "white"};
    background-color: ${props.state === "todo" ? "white" : "#33C3F0"};  
    width: 1.2em;
    line-height: ${props.state === "todo" ? "1.2em" : "1.4em"};
    border-radius: ${props.state === "todo" ? "0" : "1.2em"};
  }
  &:hover,
  &::before {
    color: #0FA0CE;
  }
  &:after {
    content: "\\00a0\\00a0";
  }   
  span {
    padding: 0 1.5rem;
  }
`;
    const getNavStyles = (indx, length) => {
      let styles = [];
      for (let i = 0; i < length; i++) {
        if (i < indx) {
          styles.push("done");
        } else if (i === indx) {
          styles.push("doing");
        } else {
          styles.push("todo");
        }
      }
      return styles;
    };
    const getButtonsState = (indx, length) => {
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
      let showNavigation = true;
      if (props.showNavigation && props.showNavigation)
        showNavigation = props.showNavigation;
      const [stylesState, setStyles] = react.useState(getNavStyles(0, props.steps.length));
      const [compState, setComp] = react.useState(0);
      const [buttonsState, setButtons] = react.useState(getButtonsState(0, props.steps.length));
      const setStepState = (indx) => {
        setStyles(getNavStyles(indx, props.steps.length));
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
      const renderSteps = () => props.steps.map((s, i) => react.default.createElement("li", {
        className: LiClass({
          state: stylesState[i]
        }),
        onClick: handleOnClick,
        key: i,
        value: i
      }, react.default.createElement("span", null, i + 1)));
      const renderNav = (show) => show && react.default.createElement("div", null, react.default.createElement("button", {
        style: buttonsState.showPreviousBtn ? {} : {
          display: "none"
        },
        onClick: previous
      }, "Prev"), react.default.createElement("button", {
        style: buttonsState.showNextBtn ? {} : {
          display: "none"
        },
        onClick: next
      }, "Next"));
      return react.default.createElement("div", {
        onKeyDown: handleKeyDown
      }, react.default.createElement(Ol, null, renderSteps()), react.default.createElement("div", null, props.steps[compState].component), react.default.createElement("div", null, renderNav(showNavigation)));
    }
  }
};
module.exports = __require(1);
