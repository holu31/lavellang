const Lexer = require('./lexer');
const Token = require('./token');

let vars = new Map();

class Parser {
	constructor(input) {
    	this.input = input;
    	this.lexer = new Lexer(input);
    	this.currentToken = this.lexer.getNextToken();
  	}

  	expr(){
  		let left;
  		if(this.currentToken.is(Token.INTEGER_LITERAL)){
  			left = this.currentToken.getValue();
  		} else if(this.currentToken.is(Token.REAL_LITERAL)){
  			left = this.currentToken.getValue();
  		} else if(this.currentToken.is(Token.IDENTIFIER)){
  			if(vars.has(this.currentToken.getValue())){
  				left = vars.get(this.currentToken.getValue());
  			} else {
  				this.err(`Lavel: variable '${this.currentToken.getValue()}' not a created!`);
  			}
  		} else {
  			this.err("Lavel: syntax error!");
  		}
  		this.currentToken = this.lexer.getNextToken();
  		while(!this.currentToken.is(Token.SEMI_COLON)){
  			if(this.currentToken.is(Token.PLUS)){
  				this.currentToken = this.lexer.getNextToken();
  				if(this.currentToken.is(Token.INTEGER_LITERAL)){
  					left += this.currentToken.getValue();
  					this.currentToken = this.lexer.getNextToken();
  				} else if(this.currentToken.is(Token.REAL_LITERAL)){
  					left += this.currentToken.getValue();
  					this.currentToken = this.lexer.getNextToken();
  				} else if(this.currentToken.is(Token.IDENTIFIER)){
  					if(vars.has(this.currentToken.getValue())){
  						left += vars.get(this.currentToken.getValue());
  					} else {
  						this.err(`Lavel: variable '${this.currentToken.getValue()}' not a created!`);
  					}
  				} else {
  					this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
  				}
  			} else {
  				this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
  			}
  		}
  		return left;
  	}

  	parse(){
  		while(!this.currentToken.is(Token.EOF)){
	  		if(this.currentToken.is(Token.PRINT)){
	  			this.currentToken = this.lexer.getNextToken();
	  			console.log(this.expr() + '');
	  		}
	  		if(this.currentToken.is(Token.EXIT)){
	  			this.currentToken = this.lexer.getNextToken();
	  			if(!this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
	  			process.exit(1);
	  		}
	  		if(this.currentToken.is(Token.VAR)){
	  			this.currentToken = this.lexer.getNextToken();
	  			if(this.currentToken.is(Token.IDENTIFIER)){
	  				let name = this.currentToken.getValue();
	  				this.currentToken = this.lexer.getNextToken();
	  				if(this.currentToken.is(Token.ASSIGN)){
	  					this.currentToken = this.lexer.getNextToken();
	  					vars.set(name, this.expr());
	  				} else {
  						this.err("Lavel: syntax error!");
  					}
	  			} else {
  					this.err("Lavel: syntax error!");
  				}
	  		}
	  		this.currentToken = this.lexer.getNextToken();
  		}
  	}

  	err(text){
  		console.log(text);
  		process.exit(1);
  	}
}

module.exports = Parser;