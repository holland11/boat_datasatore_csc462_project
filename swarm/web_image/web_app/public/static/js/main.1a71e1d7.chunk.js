(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{22:function(e,a,t){e.exports=t(54)},28:function(e,a,t){},29:function(e,a,t){},30:function(e,a,t){},31:function(e,a,t){},32:function(e,a,t){},33:function(e,a,t){},34:function(e,a,t){},35:function(e,a,t){},36:function(e,a,t){},54:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(19),i=t.n(r),o=(t(28),t(8)),c=t(9),m=t(2),s=t(3),u=t(6),h=t(4),d=t(7),g=t(5);t(29),t(30);function b(e){var a=Object(o.a)({},e.data);return l.a.createElement("table",{className:"axes-fields"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null),l.a.createElement("th",null,"Longitudinal"),l.a.createElement("th",null,"Transverse"),l.a.createElement("th",null,"Vertical"))),l.a.createElement("tbody",{className:"axis-fields"},l.a.createElement("tr",null,l.a.createElement("th",null,"Center of Gravity"),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-lcg",onChange:e.onChange},a.lcg)),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-tcg",onChange:e.onChange},a.tcg)),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-vcg",onChange:e.onChange},a.vcg))),l.a.createElement("tr",null,l.a.createElement("th",null,"Moment of Inertia"),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-l_m",onChange:e.onChange},a.lm)),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-t_m",onChange:e.onChange},a.tm)),l.a.createElement(p,Object.assign({wrapper:"td",name:"axis-v_m",onChange:e.onChange},a.vm)))))}function p(e){var a=e.wrapper?e.wrapper:"div",t=e.name;return l.a.createElement(a,{className:"Range"},l.a.createElement("input",{type:"number",name:t+"-min",id:t+"-min",value:e.min,onChange:e.onChange}),"\xa0to\xa0",l.a.createElement("input",{type:"number",name:t+"-max",id:t+"-max",value:e.max,onChange:e.onChange}))}function C(e){var a=e.name+"-range";return l.a.createElement("div",{className:"LabelledRange"},l.a.createElement("label",{htmlFor:a},e.label),l.a.createElement(p,{name:e.name,min:e.min,max:e.max,onChange:e.onChange}))}t(31);function v(e){var a=e.name+"-field",t="LabelledText";return e.className&&(t+=" "+e.className),l.a.createElement("div",{className:t},l.a.createElement("label",{htmlFor:a,className:t},e.label),e.textField)}function E(e){var a=e.name+"-field",t=l.a.createElement("input",{type:"text",name:"text_"+e.name,id:a,value:e.value,onChange:e.onChange});return l.a.createElement(v,{name:e.name,className:"Input",label:e.label,textField:t})}function f(e){var a=e.name+"-field",t=l.a.createElement("textarea",{name:e.name,id:a,value:e.value,onChange:e.onChange});return l.a.createElement(v,{name:e.name,className:"TextArea",label:e.label,textField:t})}t(32);function y(e){var a=e.data;return l.a.createElement("form",{onSubmit:e.onSubmit},l.a.createElement("div",{className:"textFields"},l.a.createElement(E,{name:"Heading",label:"Heading:",value:a.Heading,onChange:e.onChange}),l.a.createElement(E,{name:"Spec_Heading",label:"Spec Heading:",value:a.Spec_Heading,onChange:e.onChange}),l.a.createElement(E,{name:"Sorting_Nature_of_Info_Produced",label:"Sorting Nature of Info Produced ('Spec Item' for part):",value:a.Sorting_Nature_of_Info_Produced,onChange:e.onChange}),l.a.createElement(E,{name:"Features",label:"Features (Comma separated):",value:a.Features,onChange:e.onChange}),l.a.createElement(E,{name:"Model",label:"Model Number:",value:a.Model,onChange:e.onChange}),l.a.createElement(E,{name:"Hyperlink",label:"Hyperlink:",value:a.Hyperlink,onChange:e.onChange}),l.a.createElement(E,{name:"Source",label:"Source:",value:a.Source,onChange:e.onChange}),l.a.createElement(C,{name:"Weight_Per_Unit",label:"Weight Per Unit",value:a.Weight_Per_Unit,onChange:e.onChange}),l.a.createElement(C,{name:"Quantity",label:"Quantity",value:a.Quantity,onChange:e.onChange}),l.a.createElement(E,{name:"Material_And_Color",label:"Material / Color:",value:a.Material_And_Color,onChange:e.onChange}),l.a.createElement(C,{name:"Size",label:"Size",value:a.Size,onChange:e.onChange})),l.a.createElement(b,{value:a.axes,onChange:e.onChange}),l.a.createElement("input",{type:"submit",value:"Submit"}))}var x=t(20),O=t.n(x),S=(t(33),function(e){function a(){return Object(m.a)(this,a),Object(u.a)(this,Object(h.a)(a).apply(this,arguments))}return Object(g.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return console.log(this.props.result),"string"!==typeof this.props.result?l.a.createElement(O.a,{src:this.props.result}):l.a.createElement("pre",{className:"QueryResult"},this.props.result)}}]),a}(l.a.Component)),j=(t(34),function(e){function a(){return Object(m.a)(this,a),Object(u.a)(this,Object(h.a)(a).apply(this,arguments))}return Object(g.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("form",{onSubmit:this.props.onSubmit,className:"WriteForm"},l.a.createElement(f,{name:"input-json",label:"Insert JSON of data to be written.",value:this.props.input,onChange:this.props.onChange}),l.a.createElement("input",{type:"submit",value:"Submit"}))}}]),a}(l.a.Component)),w=(t(35),function(e){function a(e){var t;return Object(m.a)(this,a),(t=Object(u.a)(this,Object(h.a)(a).call(this,e))).htmlFor="radio-"+e.value,t}return Object(g.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this.props.selected?"checked":null;return l.a.createElement("div",{className:"Radio"},l.a.createElement("input",{type:"radio",name:this.props.name||null,id:this.htmlFor,value:this.props.value,checked:e,onChange:this.props.onChange}),l.a.createElement("label",{htmlFor:this.htmlFor,label:this.props.label},this.props.label))}}]),a}(l.a.Component));t(36);function N(e){var a=e.name,t=e.choice,n=function(a){return e.onChange(a)};return l.a.createElement("div",{className:"DBRadio"},l.a.createElement(w,{name:a,value:"sql",label:"MySQL",selected:"sql"===t,onChange:n}),l.a.createElement(w,{name:a,value:"mongo",label:"MongoDB",selected:"mongo"===t,onChange:n}),l.a.createElement(w,{name:a,value:"both",label:"Both (Performance Comparison)",selected:"both"===t,onChange:n}))}function _(e){var a=e.name,t=e.choice,n=function(a){return e.onChange(a)};return l.a.createElement("div",{className:"ReadWriteRadio"},l.a.createElement(w,{name:a,value:"read",label:"Read",required:!0,selected:"read"===t,onChange:n}),l.a.createElement(w,{name:a,value:"write",label:"Write",required:!0,selected:"write"===t,onChange:n}))}var M=function(e){return l.a.createElement("div",{className:"ModeSelector"},l.a.createElement(N,{name:"dbChoice",choice:e.choice,onChange:e.onChange}),l.a.createElement(_,{name:"queryMode",choice:e.queryMode,onChange:e.onChange}))},k=t(21),q=t.n(k),F=function(e){function a(e){var t;return Object(m.a)(this,a),(t=Object(u.a)(this,Object(h.a)(a).call(this,e))).state={queryMode:"read",dbChoice:"sql",read:{heading:"",specHeading:"",gcmna:"",features:"",location:"",category:"",material:"",manufacturer:"",size:{min:-1,max:-1},weightOne:{min:-1,max:-1},quantity:{min:-1,max:-1},axes:{lcg:{min:-1,max:-1},tcg:{min:-1,max:-1},vcg:{min:-1,max:-1},lm:{min:-1,max:-1},tm:{min:-1,max:-1},vm:{min:-1,max:-1}}},write:""},t.handleModeChange=t.handleModeChange.bind(Object(d.a)(t)),t.handleWriteChange=t.handleWriteChange.bind(Object(d.a)(t)),t.handleSubmit=t.handleSubmit.bind(Object(d.a)(t)),t.handleReadChange=t.handleReadChange.bind(Object(d.a)(t)),t}return Object(g.a)(a,e),Object(s.a)(a,[{key:"handleModeChange",value:function(e){this.setState(Object(c.a)({},e.target.name,e.target.value)),console.log(this.state)}},{key:"handleReadChange",value:function(e){var a=e.target.name,t=e.target.value,n=this.state.read;if(a.includes("text_"))n[a.slice(5)]=e.target.value;else if(a.includes("axis-")){var l=a.slice(5,8),r=a.slice(-3);n.axes[l][r]=t}else{var i=a.slice(0,-4),o=a.slice(-3);n[i][o]=t}this.setState({read:n})}},{key:"handleWriteChange",value:function(e){this.setState({write:e.target.value})}},{key:"handleSubmit",value:function(e){var a=this;e.preventDefault();var t={mode:this.state.queryMode,source:this.state.dbChoice};if("read"===this.state.queryMode)t.args=this.state.read;else try{t.args=JSON.parse(this.state.write)}catch(n){return alert("Invalid JSON!"),void this.setState({result:n})}q.a.post("/query",t).then(function(e){a.setState({result:e.data}),console.log(Object(o.a)({},e.data))})}},{key:"render",value:function(){var e;return e="read"===this.state.queryMode?l.a.createElement(y,{data:this.state.read,onChange:this.handleReadChange,onSubmit:this.handleSubmit}):l.a.createElement(j,{input:this.state.write,onChange:this.handleWriteChange,onSubmit:this.handleSubmit}),l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("h1",null,"Boat Data Store Query App")),l.a.createElement(M,{choice:this.state.dbChoice,queryMode:this.state.queryMode,onChange:this.handleModeChange}),l.a.createElement("main",null,e,l.a.createElement(S,{result:this.state.result})))}}]),a}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(F,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[22,1,2]]]);
//# sourceMappingURL=main.1a71e1d7.chunk.js.map