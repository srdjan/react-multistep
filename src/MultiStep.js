"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var goober_1 = require("goober");
(0, goober_1.setup)(react_1["default"].createElement);
var Ol = (0, goober_1.styled)('ol')(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  margin: 0;\n  padding-bottom: 2.2rem;\n  list-style-type: none;\n"], ["\n  display: flex;\n  margin: 0;\n  padding-bottom: 2.2rem;\n  list-style-type: none;\n"])));
var Li = (0, goober_1.styled)('li')(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: inline-block;\n  text-align: center;\n  line-height: 4.8rem;\n  padding: 0 0.7rem;\n  cursor: pointer;\n  min-width: 6rem;\n\n  color: silver;\n  border-bottom: 2px solid silver;\n\n span{\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n }\n\n  &:hover,\n  &:before {\n    color: #0FA0CE;\n  }\n  &:after {\n    content: \"\\00a0\\00a0\";\n  }   \n  &:before {\n    position: relative;\n    float: left;\n    left: 50%;\n    width: 1.3em;\n    line-height: 1.4em;\n    border-radius: 50%;\n    bottom: -3.99rem;\n  }\n"], ["\n  display: inline-block;\n  text-align: center;\n  line-height: 4.8rem;\n  padding: 0 0.7rem;\n  cursor: pointer;\n  min-width: 6rem;\n\n  color: silver;\n  border-bottom: 2px solid silver;\n\n span{\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n }\n\n  &:hover,\n  &:before {\n    color: #0FA0CE;\n  }\n  &:after {\n    content: \"\\\\00a0\\\\00a0\";\n  }   \n  &:before {\n    position: relative;\n    float: left;\n    left: 50%;\n    width: 1.3em;\n    line-height: 1.4em;\n    border-radius: 50%;\n    bottom: -3.99rem;\n  }\n"])));
var Todo = (0, goober_1.css)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  &:before {\n    content: \"\u039F\";\n    color: silver;\n    background-color: white;\n  }\n"], ["\n  &:before {\n    content: \"\\u039F\";\n    color: silver;\n    background-color: white;\n  }\n"])));
var Doing = (0, goober_1.css)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  &:before {\n    content: \"\u2022\";\n    color: white;\n    background-color: #33C3F0;  \n  }\n"], ["\n  &:before {\n    content: \"\\u2022\";\n    color: white;\n    background-color: #33C3F0;  \n  }\n"])));
var Done = (0, goober_1.css)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &:before {\n    content: \"\u2713\";\n    color: white;\n    background-color: #33C3F0;\n  }\n"], ["\n  &:before {\n    content: \"\\u2713\";\n    color: white;\n    background-color: #33C3F0;\n  }\n"])));
var RowDirection = (0, goober_1.css)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex-direction: row;\n"], ["\n  flex-direction: row;\n"])));
var ColumnDirection = (0, goober_1.css)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-top: 4.8rem;\n  flex-direction: column;\n"], ["\n  margin-top: 4.8rem;\n  flex-direction: column;\n"])));
var getStep = function (defaultIndex, newIndex, length) {
    if (newIndex <= length) {
        return newIndex;
    }
    return defaultIndex;
};
var getTopNavStyles = function (indx, length) {
    var styles = [];
    for (var i = 0; i < length; i++) {
        if (i < indx) {
            styles.push('done');
        }
        else if (i === indx) {
            styles.push('doing');
        }
        else {
            styles.push('todo');
        }
    }
    return styles;
};
var getButtonsState = function (indx, length, isValidState) {
    if (indx > 0 && indx < length - 1) {
        return {
            showPrevBtn: true,
            showNextBtn: isValidState ? true : false
        };
    }
    else if (indx === 0) {
        return {
            showPrevBtn: false,
            showNextBtn: isValidState ? true : false
        };
    }
    else {
        return {
            showPrevBtn: true,
            showNextBtn: false
        };
    }
};
function MultiStep(props) {
    var children = props.children;
    var stepsArray = props.steps;
    if (!stepsArray && !children) {
        throw TypeError("missing children or steps in props");
    }
    var steps = [];
    if (children) {
        var childrenWithProps = react_1["default"].Children.map(children, function (child, index) {
            return react_1["default"].cloneElement(child, {
                signalIfValid: setIsChildInValidState
            });
        });
        // for backward compatibility we preserve 'steps' with components array:
        steps = childrenWithProps.map(function (childComponent) { return ({
            title: childComponent.title,
            component: childComponent
        }); });
    }
    else {
        steps = stepsArray;
    }
    var _a = (0, react_1.useState)(true), childIsValid = _a[0], setChildIsValid = _a[1];
    var setIsChildInValidState = function (isValid) { return setChildIsValid(isValid); };
    var numberOfSteps = steps.length;
    var stepCustomStyle = typeof props.stepCustomStyle === 'undefined' ? {} : props.stepCustomStyle;
    var showNavButtons = typeof props.showNavigation === 'undefined' ? true : props.showNavigation;
    var showTitles = typeof props.showTitles === 'undefined' ? true : props.showTitles;
    var directionType = typeof props.direction === 'undefined' ? 'row' : props.direction;
    var _b = (0, react_1.useState)(getStep(0, props.activeStep, numberOfSteps)), activeStep = _b[0], setActiveStep = _b[1];
    var _c = (0, react_1.useState)(getTopNavStyles(activeStep, numberOfSteps)), stylesState = _c[0], setStyles = _c[1];
    var _d = (0, react_1.useState)(getButtonsState(activeStep, numberOfSteps, childIsValid)), buttonsState = _d[0], setButtons = _d[1];
    (0, react_1.useEffect)(function () {
        setButtons(getButtonsState(activeStep, numberOfSteps, childIsValid));
        console.log("From parent, child in valid state?: ".concat(childIsValid, ", button state: ").concat(buttonsState.showNextBtn));
    }, [activeStep, childIsValid]);
    var setStepState = function (indx, isValidState) {
        setStyles(getTopNavStyles(indx, numberOfSteps));
        setActiveStep(indx < numberOfSteps ? indx : activeStep);
        setButtons(getButtonsState(indx, numberOfSteps, isValidState));
    };
    var next = function () { return setStepState(activeStep + 1); };
    var previous = function () { return setStepState(activeStep > 0 ? activeStep - 1 : activeStep); };
    var handleOnClick = function (evt) {
        if (!childIsValid) {
            console.log('Child not in valid state - no transition');
            return;
        }
        if (evt.currentTarget.value === numberOfSteps - 1 &&
            activeStep === numberOfSteps - 1) {
            setStepState(numberOfSteps);
        }
        else {
            setStepState(evt.currentTarget.value);
        }
    };
    var renderTopNav = function () {
        return steps.map(function (s, i) {
            var _a;
            return (<Li className={stylesState[i] === 'todo' ? Todo :
                    stylesState[i] === 'doing' ? Doing :
                        Done} style={__assign(__assign({}, stepCustomStyle), { transform: directionType == 'column' ? 'rotate(90deg)' : 'rotate(0deg)' })} onClick={handleOnClick} key={i} value={i}>
          {showTitles && <span>{(_a = s.title) !== null && _a !== void 0 ? _a : i + 1}</span>}
        </Li>);
        });
    };
    var renderButtonsNav = function (show) {
        return show && (<div>
        <button onClick={previous} disabled={buttonsState.showPrevBtn ? false : true}>
                Prev
        </button>
        <button onClick={next} disabled={buttonsState.showNextBtn ? false : true}>
                Next
        </button>
      </div>);
    };
    return (<div style={{ display: 'flex', flexDirection: directionType === 'column' ? 'row' : 'column' }}>
      <Ol className={directionType === 'column' ? ColumnDirection : RowDirection}>{renderTopNav()}</Ol>
      {steps[activeStep].component}
      <div>{renderButtonsNav(showNavButtons)}</div>
    </div>);
}
exports["default"] = MultiStep;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
