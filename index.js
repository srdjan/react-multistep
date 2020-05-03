let e$=Object.defineProperty,f$=Object.hasOwnProperty,h$={},j$,k$=a$=>{let b$=h$[a$];return b$||(b$=h$[a$]={exports:{}},j$[a$](b$.exports,b$)),b$.exports},l$=a$=>{if(a$&&a$.__esModule)return a$;let b$={};for(let c$ in a$)f$.call(a$,c$)&&(b$[c$]=a$[c$]);return b$.default=a$,b$},o$=a$=>l$(k$(a$)),p$=(a$,b$)=>{e$(a$,"__esModule",{value:!0});for(let c$ in b$)e$(a$,c$,{get:b$[c$],enumerable:!0})};j$={0(j){var q={data:""},n=function(d){try{var c=d?d.querySelector("#_goober"):self._goober;return c||((c=(d||document.head).appendChild(document.createElement("style"))).innerHTML=" ",c.id="_goober"),c.firstChild}catch(f){}return q},r=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,s=/\/\*.*?\*\/|\s{2,}|\n/gm,l=function(d,c,f){var i="",g="",h="";for(var b in d){var a=d[b];if("object"==typeof a){var e=c+" "+b;/&/g.test(b)&&(e=b.replace(/&/g,c)),"@"==b[0]&&(e=c,"f"==b[1]&&(e=b)),/@k/.test(b)?g+=b+"{"+l(a,"","")+"}":g+=l(a,e,e==c?b:f||"")}else/^@i/.test(b)?h=b+" "+a+";":i+=b.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+a+";"}if(i.charCodeAt(0)){var p=c+"{"+i+"}";return f?g+f+"{"+p+"}":h+p+g}return h+g},k={},t=function(d,c,f,i){var g=JSON.stringify(d),h=k[g]||(k[g]=".go"+g.split("").reduce(function(b,a){return 101*b+a.charCodeAt(0)>>>0},11));return function(b,a,e){a.data.indexOf(b)<0&&(a.data=e?b+a.data:a.data+b)}(k[h]||(k[h]=l(d[0]?function(b){for(var a,e=[{}];a=r.exec(b.replace(s,""));)a[4]&&e.shift(),a[3]?e.unshift(e[0][a[3]]=e[0][a[3]]||{}):a[4]||(e[0][a[1]]=a[2]);return e[0]}(d):d,f?"":h)),c,i),h.slice(1)},u=function(d,c,f){return d.reduce(function(i,g,h){var b=c[h];if(b&&b.call){var a=b(f),e=a&&a.props&&a.props.className||/^go/.test(a)&&a;b=e?"."+e:a&&a.props?"":a}return i+g+(null==b?"":b)},"")};function m(d){var c=this||{},f=d.call?d(c.p):d;return t(f.map?u(f,[].slice.call(arguments,1),c.p):f,n(c.target),c.g,c.o)}var o,v=m.bind({g:1});j.styled=function(d){var c=this||{};return function(){var f=arguments;return function(i){var g=c.p=Object.assign({},i),h=g.className;return c.o=/\s*go[0-9]+/g.test(h),g.className=m.apply(c,f)+(h?" "+h:""),o(d,g)}}},j.setPragma=function(d){return o=d},j.extractCss=function(d){var c=n(d),f=c.data;return c.data="",f},j.css=m,j.glob=v},1(o){p$(o,{default:()=>F});const D=l$(require("react")),E=o$(0);E.setPragma(D.default.createElement);const s=E.styled("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,t=a=>E.css`
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
`,k=(a,e)=>{let f=[];for(let g=0;g<e;g++)g<a?f.push("done"):g===a?f.push("doing"):f.push("todo");return f},l=(a,e)=>a>0&&a<e-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function F(a){let e=!0;a.showNavigation&&a.showNavigation&&(e=a.showNavigation);const[f,g]=D.useState(k(0,a.steps.length)),[d,u]=D.useState(0),[m,v]=D.useState(l(0,a.steps.length)),h=b=>{g(k(b,a.steps.length)),u(b<a.steps.length?b:d),v(l(b,a.steps.length))},n=()=>h(d+1),w=()=>h(d>0?d-1:d),x=b=>b.which===13?n(a.steps.length):{},y=b=>{b.currentTarget.value===a.steps.length-1&&d===a.steps.length-1?h(a.steps.length):h(b.currentTarget.value)},z=()=>a.steps.map((b,i)=>D.default.createElement("li",{className:t({state:f[i]}),onClick:y,key:i,value:i},D.default.createElement("span",null,i+1))),A=b=>b&&D.default.createElement("div",null,D.default.createElement("button",{style:m.showPreviousBtn?{}:{display:"none"},onClick:w},"Prev"),D.default.createElement("button",{style:m.showNextBtn?{}:{display:"none"},onClick:n},"Next"));return D.default.createElement("div",{onKeyDown:x},D.default.createElement(s,null,z()),D.default.createElement("div",null,a.steps[d].component),D.default.createElement("div",null,A(e)))}}};module.exports=k$(1);
