let e$=Object.defineProperty,f$=Object.hasOwnProperty,h$={},j$,k$=a$=>{let b$=h$[a$];return b$||(b$=h$[a$]={exports:{}},j$[a$](b$.exports,b$)),b$.exports},l$=a$=>{if(a$&&a$.__esModule)return a$;let b$={};for(let c$ in a$)f$.call(a$,c$)&&(b$[c$]=a$[c$]);return b$.default=a$,b$},p$=a$=>l$(k$(a$)),q$=(a$,b$)=>{e$(a$,"__esModule",{value:!0});for(let c$ in b$)e$(a$,c$,{get:b$[c$],enumerable:!0})};j$={1(E){var x={data:""},r=function(a){try{var b=a?a.querySelector("#_goober"):self._goober;return b||((b=(a||document.head).appendChild(document.createElement("style"))).innerHTML=" ",b.id="_goober"),b.firstChild}catch(e){}return x},y=function(a){var b=r(a),e=b.data;return b.data="",e},z=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,A=/\/\*.*?\*\/|\s{2,}|\n/gm,p=function(a,b,e){var h="",f="",i="";for(var d in a){var c=a[d];if("object"==typeof c){var g=b+" "+d;/&/g.test(d)&&(g=d.replace(/&/g,b)),"@"==d[0]&&(g=b,"f"==d[1]&&(g=d)),/@k/.test(d)?f+=d+"{"+p(c,"","")+"}":f+=p(c,g,g==b?d:e||"")}else/^@i/.test(d)?i=d+" "+c+";":h+=d.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+c+";"}if(h.charCodeAt(0)){var l=b+"{"+h+"}";return e?f+e+"{"+l+"}":i+l+f}return i+f},m={},B=function(a,b,e,h){var f=JSON.stringify(a),i=m[f]||(m[f]=".go"+f.split("").reduce(function(d,c){return 101*d+c.charCodeAt(0)>>>0},11));return function(d,c,g){c.data.indexOf(d)<0&&(c.data=g?d+c.data:c.data+d)}(m[i]||(m[i]=p(a[0]?function(d){for(var c,g=[{}];c=z.exec(d.replace(A,""));)c[4]&&g.shift(),c[3]?g.unshift(g[0][c[3]]=g[0][c[3]]||{}):c[4]||(g[0][c[1]]=c[2]);return g[0]}(a):a,e?"":i)),b,h),i.slice(1)},C=function(a,b,e){return a.reduce(function(h,f,i){var d=b[i];if(d&&d.call){var c=d(e),g=c&&c.props&&c.props.className||/^go/.test(c)&&c;d=g?"."+g:c&&c.props?"":c}return h+f+(null==d?"":d)},"")};function n(a){var b=this||{},e=a.call?a(b.p):a;return B(e.map?C(e,[].slice.call(arguments,1),b.p):e,r(b.target),b.g,b.o)}var s,D=n.bind({g:1}),t=function(a){return s=a};function u(a){var b=this||{};return function(){var e=arguments;return function(h){var f=b.p=Object.assign({},h),i=f.className;return b.o=/\s*go[0-9]+/g.test(i),f.className=n.apply(b,e)+(i?" "+i:""),s(a,f)}}}q$(E,{default:()=>T});const R=l$(require("react"));t(R.default.createElement);const F=u("ol")`
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
`,v=(a,b)=>{let e=[];for(let h=0;h<b;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},w=(a,b)=>a>0&&a<b-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function T(a){let b=!0;a.showNavigation&&a.showNavigation&&(b=a.showNavigation);const[e,h]=R.useState(v(0,a.steps.length)),[f,i]=R.useState(0),[d,c]=R.useState(w(0,a.steps.length)),g=j=>{h(v(j,a.steps.length)),i(j<a.steps.length?j:f),c(w(j,a.steps.length))},l=()=>g(f+1),H=()=>g(f>0?f-1:f),I=j=>j.which===13?l(a.steps.length):{},J=j=>{j.currentTarget.value===a.steps.length-1&&f===a.steps.length-1?g(a.steps.length):g(j.currentTarget.value)},K=()=>a.steps.map((j,o)=>R.default.createElement("li",{className:G({state:e[o]}),onClick:J,key:o,value:o},R.default.createElement("span",null,o+1))),L=j=>j&&R.default.createElement("div",null,R.default.createElement("button",{style:d.showPreviousBtn?{}:{display:"none"},onClick:H},"Prev"),R.default.createElement("button",{style:d.showNextBtn?{}:{display:"none"},onClick:l},"Next"));return R.default.createElement("div",{onKeyDown:I},R.default.createElement(F,null,K()),R.default.createElement("div",null,a.steps[f].component),R.default.createElement("div",null,L(b)))}}};module.exports=k$(1);
