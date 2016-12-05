var app = require('exec_perl');
var exec_perl = app.exec_perl; 
var e_pl = app.e_pl ;
var print = console.log ; 

/* !!! cause , $abc should be a global variable !!!
 * !!! cause , $abc should be a global variable !!!
 * !!! cause , $abc should be a global variable !!! 
 *     important thing shoule say 3!!! times.    */
$abc = 'text of $abc var.';   // must be a global variable if it is used in a function

/* keep following statement be the original style, used to test. */
var perl_stm = `
// write any perl statement here with your passed 
// you may use // coment or "#" comment, as your wish
	// with or without indentation is fine
$abc = $abc x 2; // # this is a new 
	$abc =~ s/text/TEXT/g; # no indentation
//	$ccc=$abc;
//	(($ccc)); # return $ccc from perl to nodejs 
(($abc));
`;

var x = exec_perl( '$abc', perl_stm ); 
// var x = e_pl ('$abc', perl_stm );  // alias for exec_perl 

var abc_should_be = 'TEXT of $abc var.TEXT of $abc var.';

if ($abc != abc_should_be){
	console.error('- $abc should be:' + abc_should_be );
	process.exit(1);
}
else {
	var $DEBUG = 0 ;
	if ( $DEBUG ){
		print (`- after run exec_perl():`);
		var cmd = null;
		cmd =` -- print($abc)`;		print (cmd);
		print ( $abc+"\n"); 
		cmd=` -- print(x.perl_stm)`;	print (cmd);
		print ( x.perl_stm+"\n");
		cmd=` -- print(x.ans)`;		print (cmd);
		print ( x.ans + "\n") ; 
	}

	print ( '- all tests passed' );
}
