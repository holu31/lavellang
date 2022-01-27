class Token {
	constructor(type, value) {
    	this.type = type;
    	this.value = value;
	}

	getType() {
    	return this.type || null;
  	}


  	getValue() {
    	return this.value || null;
  	}

  	is(tokenType) {
    	return this.getType() === tokenType;
  	}

	toString() {
    	return `Token(${this.getType()}, ${this.getValue()})`;
  	}

	static create(type, value) {
    	return new this(type, value);
  	}

  	static get PLUS() {
    	return 'PLUS';
  	}

  	static get MINUS() {
    	return 'MINUS';
  	}

  	static get PRINT() {
    	return 'PRINT';
  	}

  	static get COMMENT() {
    	return 'COMMENT';
  	}

  	static get VAR() {
    	return 'VAR';
  	}

  	static get EXIT() {
    	return 'EXIT';
  	}

  	static get ASSIGN(){
  		return 'ASSIGN';
  	}

  	static get REAL_LITERAL() {
    	return 'REAL_LITERAL';
  	}

  	static get INTEGER_LITERAL() {
    	return 'INTEGER_LITERAL';
  	}

  	static get IDENTIFIER() {
    	return 'IDENTIFIER';
  	}

  	static get SEMI_COLON() {
    	return 'SEMI_COLON';
  	}

  	static get LEFT_PARENT() {
    	return 'LEFT_PARENT';
  	}

  	static get RIGHT_PARENT() {
    	return 'RIGHT_PARENT';
  	}

  	static get EOF() {
    	return 'EOF';
  	}
}

module.exports = Token;