const Parser = require('./parser');
const Lexer = require('./lexer');

const program = `
fn int_plus int_type int_type then
	print arg1+1;
	print arg2-1;
	end;

int_plus 2 6;   # write 3 and 5 on console`;
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