let o=Object.defineProperty,x=Object.prototype.hasOwnProperty,y=a=>o(a,"__esModule",{value:!0}),I=(a,b)=>{y(a);for(let e in b)o(a,e,{get:b[e],enumerable:!0})},J=(a,b)=>{y(a);for(let e in b)x.call(b,e)&&!x.call(a,e)&&e!=="default"&&o(a,e,{get:()=>b[e],enumerable:!0});return a},K=a=>a&&a.__esModule?a:J(o({},"default",{value:a,enumerable:!0}),a);var z={data:""},A=function(a){try{var b=a?a.querySelector("#_goober"):self._goober;return b||((b=(a||document.head).appendChild(document.createElement("style"))).innerHTML=" ",b.id="_goober"),b.firstChild}catch(e){}return z},B=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,C=/\/\*.*?\*\/|\s{2,}|\n/gm,q=function(a,b,e){var h="",f="",i="";for(var d in a){var c=a[d];if("object"==typeof c){var g=b+" "+d;/&/g.test(d)&&(g=d.replace(/&/g,b)),"@"==d[0]&&(g=b,"f"==d[1]&&(g=d)),/@k/.test(d)?f+=d+"{"+q(c,"","")+"}":f+=q(c,g,g==b?d:e||"")}else/^@i/.test(d)?i=d+" "+c+";":h+=d.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+c+";"}if(h.charCodeAt(0)){var l=b+"{"+h+"}";return e?f+e+"{"+l+"}":i+l+f}return i+f},m={},D=function(a,b,e,h){var f=JSON.stringify(a),i=m[f]||(m[f]=".go"+f.split("").reduce(function(d,c){return 101*d+c.charCodeAt(0)>>>0},11));return function(d,c,g){c.data.indexOf(d)<0&&(c.data=g?d+c.data:c.data+d)}(m[i]||(m[i]=q(a[0]?function(d){for(var c,g=[{}];c=B.exec(d.replace(C,""));)c[4]&&g.shift(),c[3]?g.unshift(g[0][c[3]]=g[0][c[3]]||{}):c[4]||(g[0][c[1]]=c[2]);return g[0]}(a):a,e?"":i)),b,h),i.slice(1)},E=function(a,b,e){return a.reduce(function(h,f,i){var d=b[i];if(d&&d.call){var c=d(e),g=c&&c.props&&c.props.className||/^go/.test(c)&&c;d=g?"."+g:c&&c.props?"":c}return h+f+(null==d?"":d)},"")};function n(a){var b=this||{},e=a.call?a(b.p):a;return D(e.map?E(e,[].slice.call(arguments,1),b.p):e,A(b.target),b.g,b.o)}var s,Q=n.bind({g:1}),t=function(a){return s=a};function u(a){var b=this||{};return function(){var e=arguments;return function(h){var f=b.p=Object.assign({},h),i=f.className;return b.o=/\s*go[0-9]+/g.test(i),f.className=n.apply(b,e)+(i?" "+i:""),s(a,f)}}}I(exports,{default:()=>H});const V=K(require("react"));t(V.default.createElement);const F=u("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,G=a=>n`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${a.state==="todo"?"silver":"black"};
  border-bottom: 4px solid ${a.state==="todo"?"silver":"#33C3F0"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${a.state==="todo"?'content: "Ο";':a.state==="doing"?'content: "•";':'content: "✓";'}
    color: ${a.state==="todo"?"silver":"white"};
    background-color: ${a.state==="todo"?"white":"#33C3F0"};  
    width: 1.2em;
    line-height: ${a.state==="todo"?"1.2em":"1.4em"};
    border-radius: ${a.state==="todo"?"0":"1.2em"};
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
`,v=(a,b)=>{let e=[];for(let h=0;h<b;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},w=(a,b)=>a>0&&a<b-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function H(a){let b=!0;a.showNavigation&&a.showNavigation&&(b=a.showNavigation);const[e,h]=V.useState(v(0,a.steps.length)),[f,i]=V.useState(0),[d,c]=V.useState(w(0,a.steps.length)),g=j=>{h(v(j,a.steps.length)),i(j<a.steps.length?j:f),c(w(j,a.steps.length))},l=()=>g(f+1),L=()=>g(f>0?f-1:f),M=j=>j.which===13?l(a.steps.length):{},N=j=>{j.currentTarget.value===a.steps.length-1&&f===a.steps.length-1?g(a.steps.length):g(j.currentTarget.value)},O=()=>a.steps.map((j,p)=>V.default.createElement("li",{className:G({state:e[p]}),onClick:N,key:p,value:p},V.default.createElement("span",null,p+1))),P=j=>j&&V.default.createElement("div",null,V.default.createElement("button",{style:d.showPreviousBtn?{}:{display:"none"},onClick:L},"Prev"),V.default.createElement("button",{style:d.showNextBtn?{}:{display:"none"},onClick:l},"Next"));return V.default.createElement("div",{onKeyDown:M},V.default.createElement(F,null,O()),V.default.createElement("div",null,a.steps[f].component),V.default.createElement("div",null,P(b)))}
