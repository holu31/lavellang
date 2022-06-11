const Parser = require('./parser');
const Lexer = require('./lexer');

const program = `
# print example
var test := 4.2;
label test:
	print -2--3;
end;

call test;
exit;
print 1+4 #it will not be processed`;
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