var shell = require("shelljs"); shell.config.silent = true; 
var print = console.log;

/* # author: Jidor Tang <tlqtangok@126.com> 
 * # Date: 2016.12.05
 * # github: https://github.com/tlqtangok/exec_perl
 *
 *
 */ 

/* 
 * ****************************************************
 * ************ gen_set_stm ( string_a ) **************
 * ****************************************************
 *
 * description: private function ,  to get perl assignment from nodejs variable to perl's variable
 * param0:string , node.js variable name,need to start with '$'
 * return:string , perl's assignment statement
 * 
 * usage example: 
 * ``` javascript
 * $abc = 'text of abc varible';  // $abc should be a global var, pity, but must if you are using it in function stack.  
 * var gen_set_stm_ret = gen_set_stm ( '$abc' ); 
 * console.log ( gen_set_stm_ret );
 * // $abc = q{text of abc variable}
 * ```
 *
 */
var gen_set_stm = function(str_in_p0){
	if ( 'string' != typeof str_in_p0 ){
		console.error('- should be a string in ' );  
		process.exit(1);
	}
	if ( str_in_p0[0] != '$' ) {
		console.error('- p0 should match perl var,such as $abc' );
		process.exit(2);
	}

	var set_str_r0 = "MAGIC_set_str_r0"; 
	set_str_r0 = '${str_in_p0} = q{${__TEMPLATE__}};';


	var set_str_r1 = set_str_r0.replace(/__TEMPLATE__/, str_in_p0 ); 
	var set_str_ret  =  eval('`'+set_str_r1 +'`' );
	return  set_str_ret ;	
};


/*
 * ****************************************************
 * ** gen_js_eval_stm_in_perl_print_ret( string_a ) ***
 * ****************************************************
 *
 * description: private function, generate node.js assignment from perl's statement's
 * param0:string , all perl's statement. 
 * return:string , generate perl's print statement from last (($abc))
 * 
 * usage example:
 * ```javascript
 * var str_perl_stm = `$abc=qq(hello world);$abc=$abc x 3;(($abc)); `
 * gen_js_eval_stm_in_perl_print_ret = gen_js_eval_stm_in_perl_print ( str_perl_stm );
 * console.log( gen_js_eval_stm_in_perl_print_ret ) ;
 * // print q($abc=).qq("$abc");  
 * ```
 *
 * */
var gen_js_eval_stm_in_perl_print = function( str_perl_stm ){

	// work to get perl kernel statement 
	var arr_perl_stm = str_perl_stm.split (';');
	var i= 0;
	var var_list_inner = null ; 
	var len = arr_perl_stm.length;

	for (i=len-1; i>=0; i-=1) {
		// to get string like (($abc))
		if( var_list_inner = arr_perl_stm[i].match( /\(\((.*)\)\)/ ) ){
			break;
		}
	} // end for(i)

	if ( i == -1 ){  // no found (($xxx));?
		console.error('- the last perl statement should be in format:((*))' );  
		process.exit(2);
	}

	var var_list_inner_str = var_list_inner[1] ;  // (($xxx))
	var_list_inner_str =  var_list_inner_str.replace( /\s/g,'');  //' $xxx ' ---> '$xxx'
	//var gen_print_str = 'print '+ `q(${var_list_inner_str}=).`+ 'qq("'+var_list_inner_str +'")'+ ';' ;
	var gen_print_str = `print q(${var_list_inner_str}=).qq("${var_list_inner_str}");` ;
	if ( var_list_inner_str.match(/^\$\w/ ) ){ // if is perl str 
		return gen_print_str ; 
	}
	return gen_print_str ; 
};

/* 
 * ****************************************************
 * ** exec_perl( string_var_name, string_perl_stm ) ***
 * ****************************************************
 *
 * description: public function, execute perl statement and return value to node.js variable
 *
 * param0:string , node.js variable name,must start with '$'
 * return:object , includes the results
 * 
 * usage example:
 * ```javascript
 * $abc = 'text of abc var.';  //$abc should be a global var
 * var str_perl_stm = `
 * $abc = $abc x 2;
 * $abc =~ s/text/TEXT/g; // comment 0
 * (($abc));	# comment 1: this line is very important,it will be return variables list from perl to node.js
 * `;
 * var obj_ret = exec_perl( '$abc', str_perl_stm );
 * console.log ( $abc ); // get string: TEXT of $abc var.TEXT of $abc var.
 * console.log ( obj_ret ); 
 * // get obj:
 * 	{ 
 * 	perl_stm: 
 * 		'perl -e \'$abc = q{text of $abc var.};$abc = $abc x 2;$abc =~ s/text/TEXT/g;$abc =~ s/T//g;$abc =~ s/acomment two//g;print q($abc=).qq("$abc");\'  ',
 *  	ans: 
 *  		'$abc="EX of $abc var.EX of $abc var."' 
 *  	} 
 *  console.log( obj_ret.perl_stm );  
 *  // get string:  perl -e '$abc = q{text of $abc var.};$abc = $abc x 2;$abc =~ s/text/TEXT/g;print q($abc=).qq("$abc");'
 *
 *  console.log( obj_ret.ans );  //get string:  $abc="TEXT of $abc var.TEXT of $abc var."
 * ```
 */

var exec_perl = function(str_in_p0, str_perl_stm ){

	var pre_set_stm = gen_set_stm ( str_in_p0 ) ;

	str_perl_stm = str_perl_stm.replace(/\n\s+/g, "\n");  // strip not needed line space in line-tail

	var arr_no_enter = str_perl_stm.split (/\n/);
	var arr_no_comment = [];
	var i =0; var len = arr_no_enter.length; 
	for ( i=0;i<len;i++){
		var t = arr_no_enter[i];
		if ( t.match(/\=\~/) || t.match(/split \/\//)  ){
			t = t.replace( /\;\s+(\/\/.*|\#.*)/,';' ); // strip comment like "// comment" and "# comment" 
		}
		else {
			t = t.replace (/(\/\/|\#).*/,''); // strip comment like "// comment" and "# comment" 
		}
		t = t.replace (/\s+$/,'');		// strip last ';   ' --> ';'
		t = t.replace (/print |say /g, '');     // strip all console statement
		t = t.replace (/^\s+/g , '');		// strip line-header space 
		arr_no_comment.push (t) ;
	}

	str_perl_stm = arr_no_comment.join('');  // now it is single line string

	// get mid_exec_ker
	var mid_exec_ker =  str_perl_stm.match ( /(^.*)\(\(.{2,32}\)\)/ )[1];   // the ((content)) is limited <32

	//we dont need print in the mid,we will later generate our own in the last line 

	var tail_js_eval_stm = gen_js_eval_stm_in_perl_print( str_perl_stm );

	//	print (tail_js_eval_stm );

	//	print ( 'pre is:' +  pre_set_stm ); 
	//	print ('mid is:'+mid_exec_ker ); 
	//	print('tail is:'+  tail_js_eval_stm );

	var pre_mid_tail_perl_stm = `perl -e '${pre_set_stm}${mid_exec_ker}${tail_js_eval_stm}'  `; 
	//	print ( pre_mid_tail_perl_stm ); 

	// run ` perl -e statement, and get string ,use that to eval 
	var to_eval_by_perl_output = shell.exec ( pre_mid_tail_perl_stm ).stdout; 
	//	var output_var_name  =	to_eval_by_perl_output.match( /(^.*?)=.*/ )[1];


	//	print ( to_eval_by_perl_output ) ; 

	eval_ret_value = eval ( to_eval_by_perl_output );  
	var input_value_r1 =  ( eval ( str_in_p0 ) ); 



	//	print ( 'eval_ret_value:' + eval_ret_value ); 

	//	var ans =  `${str_in_p0} = '${eval_ret_value}'` ; 
	var ret_obj = {};
	//	ret_obj [ str_in_p0 ] = input_value_r1;
	ret_obj [ 'perl_stm' ] = pre_mid_tail_perl_stm ;
	ret_obj [ 'ans' ] = to_eval_by_perl_output ; 

	return ret_obj ; 
};


/*
 * exports list: 
 */

exports = module.exports = app = {};
var e_pl = exec_perl;
app.exec_perl= exec_perl ; 
app.e_pl= e_pl; 


