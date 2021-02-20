// a stupidly simple addons for manipulating html from javascript without Reactjs

const SimpleTemplateEngine = (html,data) => {
	let source_code = "let code=[];with(this){";
	let tags = /<%([^%>]+)?%>/g,reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,match,counter = 0;

	let add = (line,js) => {
		js? (source_code += line.match(reExp) ? line : `code.push(${line});`) :
            (source_code += line != '' ? `code.push('${line.replace(/"/g, '\\\\"')}');` : '');
        return add;
	}

	while(match = tags.exec(html)){
		add(html.slice(counter,match.index))(match[1],true)
		counter = match.index + match[0].length;
	}

	add(html.substr(counter,html.length - counter));
	source_code += '}return code.join("")'
	return new Function(source_code.replace(/[\\\n\\\r\\\t]/g,'')).apply(data)
}

const RenderComponent = (renderTemplate,parent) => (data) => {
	parent.innerHTML = SimpleTemplateEngine(renderTemplate,{data});
}