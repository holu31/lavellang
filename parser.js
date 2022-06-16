const Lexer = require('./lexer');
const Token = require('./token');

let vars = new Map();

class Parser {
	constructor(input) {
    	this.input = input;
    	this.lexer = new Lexer(input);
    	this.currentToken = this.lexer.getNextToken();
		this.labels = {}
		this.functions = {}
  	}

  	expr(){
  		let left;
		if(this.currentToken.is(Token.MINUS)){
			this.currentToken = this.lexer.getNextToken();
			if(this.currentToken.is(Token.INTEGER_LITERAL)){
				left = -this.currentToken.getValue();
			} else if(this.currentToken.is(Token.REAL_LITERAL)){
				left = -this.currentToken.getValue();
			} else if(this.currentToken.is(Token.IDENTIFIER)){
				if(vars.has(this.currentToken.getValue())){
					left = -vars.get(this.currentToken.getValue());
				} else {
					this.err(`Lavel: variable '${this.currentToken.getValue()}' not a created!`);
				}
			} else {
				this.err("Lavel: syntax error!");
			}
		} else {
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
			} else if(this.currentToken.is(Token.MINUS)){
				this.currentToken = this.lexer.getNextToken();
				if(this.currentToken.is(Token.MINUS)){
					this.currentToken = this.lexer.getNextToken();
					if(this.currentToken.is(Token.INTEGER_LITERAL)){
						left -= -this.currentToken.getValue();
						this.currentToken = this.lexer.getNextToken();
					} else if(this.currentToken.is(Token.REAL_LITERAL)){
						left -= -this.currentToken.getValue();
						this.currentToken = this.lexer.getNextToken();
					} else if(this.currentToken.is(Token.IDENTIFIER)){
						if(vars.has(this.currentToken.getValue())){
							left -= -vars.get(this.currentToken.getValue());
						} else {
							this.err(`Lavel: variable '${this.currentToken.getValue()}' not a created!`);
						}
					} else {
						this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
					}
				} else {
					if(this.currentToken.is(Token.INTEGER_LITERAL)){
						left -= this.currentToken.getValue();
						this.currentToken = this.lexer.getNextToken();
					} else if(this.currentToken.is(Token.REAL_LITERAL)){
						left -= this.currentToken.getValue();
						this.currentToken = this.lexer.getNextToken();
					} else if(this.currentToken.is(Token.IDENTIFIER)){
						if(vars.has(this.currentToken.getValue())){
							left -= vars.get(this.currentToken.getValue());
						} else {
							this.err(`Lavel: variable '${this.currentToken.getValue()}' not a created!`);
						}
					} else {
						this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
					}
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
			if(this.currentToken.is(Token.LABEL)){
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.IDENTIFIER)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
				let label_name = this.currentToken.getValue();
				if(this.labels.hasOwnProperty(label_name)) this.err(`Lavel: label '${label_name}' already exists!`);
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
				this.currentToken = this.lexer.getNextToken();
				this.labels[label_name] = '';
				while(!this.currentToken.is(Token.END)){
					if(this.currentToken.is(Token.EOF)) this.err(`Lavel: end token missing in label.`);
					if(this.currentToken.is(Token.LABEL)) this.err(`Lavel: label cannot be in label.`);
					this.labels[label_name] += this.currentToken.getValue() + ' ';
					this.currentToken = this.lexer.getNextToken();
				}
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
			}
			if(this.currentToken.is(Token.FUNCTION)){
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.IDENTIFIER)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
				let func_name = this.currentToken.getValue();
				if(this.functions.hasOwnProperty(func_name)) this.err(`Lavel: function '${func_name}' already exists!`);
				this.currentToken = this.lexer.getNextToken();
				this.functions[func_name] = [[], ''];
				if(!this.currentToken.is(Token.THEN)) {
					while(!this.currentToken.is(Token.THEN)){
						if(this.currentToken.is(Token.EOF)) this.err(`Lavel: then token missing in function.`);
						if(this.currentToken.is(Token.IDENTIFIER)){
							if(this.currentToken.getValue() == "int_type") this.functions[func_name][0][this.functions[func_name][0].length] = Token.INTEGER_LITERAL;
							else this.err(`Lavel: unknown type`);
						} else this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
						this.currentToken = this.lexer.getNextToken();
					}
				}
				this.currentToken = this.lexer.getNextToken();
				while(!this.currentToken.is(Token.END)){
					if(this.currentToken.is(Token.EOF)) this.err(`Lavel: end token missing in label.`);
					if(this.currentToken.is(Token.FUNCTION)) this.err(`Lavel: function cannot be in function.`);
					this.functions[func_name][1] += this.currentToken.getValue() + ' ';
					this.currentToken = this.lexer.getNextToken();
				}
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
				
			}
			if(this.currentToken.is(Token.CALL)){
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.IDENTIFIER)) this.err(`Lavel: invalid argument '${this.currentToken.getValue()}'!`);
				let label_name = this.currentToken.getValue();
				if(!this.labels.hasOwnProperty(label_name)) this.err(`Lavel: label '${label_name}' does not exists!`)
				this.currentToken = this.lexer.getNextToken();
				if(!this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
				let parser = new Parser(this.labels[label_name]);
				parser.parse();
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
			if(this.currentToken.is(Token.IDENTIFIER)){
				if(!this.functions.hasOwnProperty(this.currentToken.getValue())) this.err(`Lavel: unknown function '${this.currentToken.getValue()}'`);
				if(this.functions[this.currentToken.getValue()][0].length == 0){
					let func_name = this.currentToken.getValue();
					this.currentToken = this.lexer.getNextToken();
					if(!this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: syntax error '${this.currentToken.getValue()}'!`);
					console.log(this.functions[func_name][1]);
					let parser = new Parser(this.functions[func_name][1]);
					parser.parse();
				} else {
					let func_name = this.currentToken.getValue();
					this.currentToken = this.lexer.getNextToken();
					if(this.currentToken.is(Token.SEMI_COLON)) this.err(`Lavel: no arguments!`);
					for(let j=0; j<this.functions[func_name][0].length-1; j++){
						console.log(this.functions[func_name][0]);
						if(this.functions[func_name][0][j] === Token.INTEGER_LITERAL){
							console.log('test');
						} else {
							console.log(`Lavel: unknown type in the function.`)
						}
					}

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