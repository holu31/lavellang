const Parser = require('./parser');
const Lexer = require('./lexer');

const program = `
fn pr_int then
	print 123;
end;

pr_int;
label pr_label:
	print 123;
end;
call pr_label;`;
let lexer = new Lexer(program);
console.log("---------- LEXER ----------")
while(true){
	currentToken = lexer.getNextToken();
	if(currentToken.getType() == 'EOF') break;
	console.log(currentToken);
}
console.log("____________________________")
console.log("--------- PARSING ---------")
console.log("____________________________")
console.log('PROGRAM RESULT: ')
let parser = new Parser(program);
parser.parse();