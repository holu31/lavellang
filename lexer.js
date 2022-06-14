const Token = require('./token');

class Lexer {
  	constructor(input) {
    	this.input = input;
    	this.position = 0;
    	this.currentChar = this.input[this.position];
  	}

  	advance() {
    	this.position += 1;

    	if (this.position > this.input.length - 1) {
      		this.currentChar = null;
    	} else {
      		this.currentChar = this.input[this.position];
      	}

      	return this;
    }

  	peek() {
    	const position = this.position + 1;

    	if (position > this.input.length - 1) return null;

    	return this.input[position];
  	}

  	skipWhitespace() {
    	while (this.currentChar && /\s/.test(this.currentChar)) {
      		this.advance();
    	}

    	return this;
  	}

  	comment(){
  		let buffer = "";
  		while(this.currentChar != '\n' && this.currentChar != null){
  			buffer += this.currentChar;
  			this.advance();
  		}
  		return Token.create(Token.COMMENT, buffer);
  	}



  	number() {
    	let number = '';

    	while (this.currentChar && /\d/.test(this.currentChar)) {
      		number += this.currentChar;
      		this.advance();
    	}

    	if (this.currentChar === '.') {
      		number += this.currentChar;
      		this.advance();
    		while (this.currentChar && /\d/.test(this.currentChar)) {
        		number += this.currentChar;
        		this.advance();
      		}
      		return Token.create(Token.REAL_LITERAL, parseFloat(number));
    	}

    	return Token.create(Token.INTEGER_LITERAL, parseInt(number));
 	}

 	identifier() {
    	let identifier = '';

    	while (this.currentChar && /[a-zA-Z0-9]/.test(this.currentChar) || this.currentChar == '_') {
      		identifier += this.currentChar;
      		this.advance();
    	}

    	return Lexer.RESERVED_WORDS[identifier] || Token.create(Token.IDENTIFIER, identifier);
  	}

 	getNextToken(){
 		while (this.currentChar) {
 			if (/\s/.test(this.currentChar)) {
        		this.skipWhitespace();
        		continue;
      		}
	 		if (/\d/.test(this.currentChar)) {
	        	return this.number();
	      	}
	      	if (/[a-zA-Z]/.test(this.currentChar)) {
        		return this.identifier();
      		}
      		if (this.currentChar === '#') {
        		this.advance();
        		return this.comment();
      		}
      		if (this.currentChar === ':' && this.peek() === '=') {
        		this.advance().advance();
        		return Token.create(Token.ASSIGN, ':=');
      		}
			if (this.currentChar === ':'){
				this.advance();
				return Token.create(Token.COLON, ':');
			}
	      	if (this.currentChar === '+') {
	        	this.advance();
	        	return Token.create(Token.PLUS, '+');
	      	}
	      	if (this.currentChar === '-') {
	        	this.advance();
	        	return Token.create(Token.MINUS, '-');
	      	}
			if (this.currentChar === '*') {
				this.advance();
				return Token.create(Token.MULTIPLY, '*');
			}
	      	if (this.currentChar === '(') {
	        	this.advance();
	        	return Token.create(Token.LEFT_PARENT, '(');
	      	}
	      	if (this.currentChar === ')') {
	        	this.advance();
	        	return Token.create(Token.RIGHT_PARENT, ')');
	      	}
	      	if (this.currentChar === ';') {
	        	this.advance();
	        	return Token.create(Token.SEMI_COLON, ';');
	      	}
	      	return this.err(`Lavel: unknown token '${this.currentChar}'!`);
	    }
	    return Token.create(Token.EOF, null);
 	}

 	static get RESERVED_WORDS() {
	    return {
	    	print: Token.create(Token.PRINT, 'print'),
			label: Token.create(Token.LABEL, 'label'),
			fn: Token.create(Token.FUNCTION, 'fn'),
			then: Token.create(Token.THEN, 'then'),
			end: Token.create(Token.END, 'end'),
			call: Token.create(Token.CALL, 'call'),
	    	var: Token.create(Token.VAR, 'var'),
	    	exit: Token.create(Token.EXIT, 'exit'),
	    }
	}

	err(text){
  		console.log(text);
  		process.exit(1);
  	}

}

module.exports = Lexer;