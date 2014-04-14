(function(){function indent(code){return""!==code?"  "+code.replace(/\n(?![\r\n]|$)/g,"\n  "):code}function multi_indent(code,level){var new_str;return""!==code&&level>0?(new_str=Array(2*level+1).join(" "),new_str+code.replace(/\n(?![\r\n]|$)/g,"\n"+new_str)):code}function create_callback(){return callback_counter+=1,current_callback="k$cb"+callback_counter}function push_class(){class_defs.push(class_def),class_def={name:"",code:"",args:[],has_constructor:!1}}function pop_class(){return class_def=class_defs.pop()}function push_scope(){var new_scope,k,v,kobj$1;scopes.push(scope),try_block_stacks.push(try_block_stack),try_block_stack=[],parfor_cb_stack.push(parfor_cb),parfor_cb=null,current_callbacks.push(current_callback),new_scope={},kobj$1=scope;for(k in kobj$1)kobj$1.hasOwnProperty(k)&&(v=scope[k],"no closures"===v||("closures ok"===v||"argument"===v||"function"===v?new_scope[k]="closure":"closure"===v&&(new_scope[k]="closure")));scope=new_scope}function pop_scope(code,wrap){var rv,var_names,var_name,kobj$2;rv="",var_names=[],kobj$2=scope;for(var_name in kobj$2)kobj$2.hasOwnProperty(var_name)&&(k$indexof.call(["closure","argument","function","class definition"],scope[var_name])>=0||"k$next"===var_name||var_names.push(var_name));return wrap&&(rv+="(function () {\n"),var_names.length>0&&(code="var "+var_names.join(", ")+";\n"+code),rv+=wrap?indent(code):code,wrap&&(rv+="})()"),scopes!==[]&&(scope=scopes.pop()),try_block_stack=try_block_stacks.pop(),current_callback=current_callbacks.pop(),parfor_cb=parfor_cb_stack.pop(),rv}function check_existence_wrapper(code,undefined_unary,invert){var rv;return rv=undefined_unary?invert?"(typeof "+code+" === 'undefined' || "+code+" === null)":"(typeof "+code+" !== 'undefined' && "+code+" !== null)":invert?""+code+" == null":""+code+" != null"}function kthis(){return null!=scope.k$this?"k$this":"this"}function render_try_blocks(){var rv,indent_level,try_block,ki$3,kobj$3;for(rv="",indent_level=0,kobj$3=try_block_stack,ki$3=0;kobj$3.length>ki$3;ki$3++)try_block=kobj$3[ki$3],rv+=multi_indent(try_block.js_wrapper_try(),indent_level),indent_level+=1;return rv}function render_catch_blocks(){var rv,indent_level,try_block,ki$4,kobj$4;for(rv="",indent_level=try_block_stack.length-1,kobj$4=try_block_stack,ki$4=0;kobj$4.length>ki$4;ki$4++)try_block=kobj$4[ki$4],rv+=multi_indent(try_block.js_wrapper_catch(),indent_level),indent_level-=1;return rv}var Grammar,KEYWORD_TRANSLATE,scopes,scope,try_block_stack,try_block_stacks,parfor_cb,parfor_cb_stack,callback_counter,current_callback,current_callbacks,comments,class_defs,class_def,literate,for_count,while_count,use_snippets,snippets,k$indexof=[].indexOf||function(item){for(var i=0,l=this.length;l>i;i++)if(i in this&&this[i]===item)return i;return-1},k$comprl=function(iterable,func,cond){var o=[];if(cond=cond||function(){return!0},iterable instanceof Array||"number"==typeof iterable.length)for(var i=0;iterable.length>i;i++)cond(iterable[i])&&o.push(func(iterable[i]));else{if("function"!=typeof iterable.next)throw"Object is not iterable";for(var i;null!=(i=iterable.next());)cond(i)&&o.push(func(i))}return o};Grammar=require("./grammar").Grammar,KEYWORD_TRANSLATE={yes:"true",on:"true",no:"false",off:"false",is:"===",isnt:"!==","==":"===","!=":"!==",and:"&&",but:"&&",or:"||",xor:"^","^":"pow",mod:"%",not:"!","new":"new",me:"this","this":"this","null":"null",nothing:"null",none:"null","break":"break","throw":"throw",raise:"throw","instanceof":"instanceof",of:"in",fail:"throw","bitwise and":"&","bitwise or":"|","bitwise xor":"^","bitwise not":"~","typeof":"typeof","bitwise left":"<<","bitwise right":">>"},scopes=[],scope={},try_block_stack=[],try_block_stacks=[],parfor_cb=null,parfor_cb_stack=[],callback_counter=0,current_callback="k$cb0",current_callbacks=[],comments=[],class_defs=[],class_def={},literate=!1,for_count=1,while_count=1,use_snippets={},Grammar.File.prototype.js=function(options){var comment,code,snip,key,kobj$5,rv;for_count=1,while_count=1,literate=options.literate,scopes=[],scope={},try_block_stack=[],try_block_stacks=[],parfor_cb=null,parfor_cb_stack=[],callback_counter=0,current_callback="k$cb0",current_callbacks=[],class_defs=[],class_def={name:"",code:"",args:[],has_constructor:!1},use_snippets={},this.callback=current_callback,this.bare=options.bare,comments=k$comprl(this.ts.comments,function(k$i){return comment=k$i}),code=Grammar.Block.prototype.js.apply(this),snip=[],kobj$5=use_snippets;for(key in kobj$5)kobj$5.hasOwnProperty(key)&&snip.push(use_snippets[key]);return snip=snip.join("\n"),rv=[snip,code].join("\n"),"k$cb0"!==current_callback&&(rv+="}"),pop_scope(rv,!options.bare)},Grammar.Statement.prototype.js=function(){var comment_postfix,comment,comment_prefix,rv;for(this.statement.in_conditional=this.in_conditional,this.statement.in_loop=this.in_loop,this.statement.parent_block=this.parent_block,this.statement.callback=this.callback,this.statement.original_callback=this.original_callback,comment_postfix="",null!=comments[0]&&comments[0].line===this.statement.line&&comments[0].post_fix&&(comment=comments.shift(),comment_postfix=" /* "+comment.value+" */\n"),comment_prefix="";null!=comments[0]&&comments[0].line<this.statement.line;)comment=comments.shift(),comment_prefix+="/* "+comment.value+" */";return literate&&(comment_prefix=comment_prefix.replace(/\*\/\/\*/g,"\n  ")),rv=this.statement.js(),""!==comment_postfix&&(rv=rv.replace(/\n/,comment_postfix)),"\n"===rv[0]&&""!==comment_prefix?rv="\n"+comment_prefix+rv:""!==comment_prefix&&(rv=comment_prefix+"\n"+rv),rv},Grammar.ThrowStatement.prototype.js=function(){var rv;return rv=0===try_block_stack.length&&null!=scope.k$next?"return k$next.apply("+kthis()+", ["+this.expr.js()+"]);\n":"throw "+this.expr.js()+";\n",null!=this.conditional&&(rv=this.conditional.js(rv,!1)),rv},Grammar.ReturnStatement.prototype.js=function(){var exprs_js,expr,arg_list,rv;return exprs_js=k$comprl(this.exprs,function(k$i){return expr=k$i,expr.js()}),null!=scope.k$next?exprs_js.unshift("null"):void 0,arg_list=exprs_js.join(", "),null!=scope.k$next?(scope.k$rv="no closures",use_snippets.async=snippets.async,rv="return k$rv = ["+arg_list+"], k$async(k$next, "+kthis()+", k$rv);",null!=this.conditional&&(rv=this.conditional.js(rv,!1)),rv+="\n"):(rv="return",1===this.exprs.length?rv+=" "+arg_list:this.exprs.length>1&&(rv+="["+arg_list+"]"),rv+=";\n",null!=this.conditional&&(rv=this.conditional.js(rv,!1)),rv)},Grammar.DeleteStatement.prototype.js=function(){var list_range,from_val,to_val,rv;return null!=this.prop?"IDENTIFIER"===this.prop.type?"delete "+this.from_var.js()+"."+this.prop.value+";\n":"delete "+this.from_var.js()+"["+this.prop.value+"];\n":this.item_list.comprehension instanceof Grammar.RangeExpression?(list_range=this.item_list.comprehension,from_val=list_range.from_expr.number_constant(),to_val=list_range.to_expr.number_constant(),null!=from_val&&null!=to_val?""+this.from_var.js()+".splice("+from_val+", "+(to_val-from_val+1)+");\n":(scope.k$rstart="no closures",rv="k$rstart = "+list_range.from_expr.js()+";\n",rv+=""+this.from_var.js()+".splice(k$rstart, "+list_range.to_expr.js()+" - k$rstart);\n")):null!=this.item_list.comprehension||this.item_list.items.length>1?(use_snippets["delete"]=snippets["delete"],"k$del("+this.from_var.js()+", "+this.item_list.js()+");\n"):null!=this.item_list.items[0].number_constant&&null!=this.item_list.items[0].number_constant()?""+this.from_var.js()+".splice("+this.item_list.items[0].number_constant()+", 1);\n":"k$del("+this.from_var.js()+", "+this.item_list.items[0].js()+");\n"},Grammar.ExpressionStatement.prototype.js=function(){var rv;return rv=this.expr.js(),""===rv?"":this.expr.left.base instanceof Grammar.FunctionExpression?"\n"+rv+"\n\n":rv+";\n"},Grammar.Expression.prototype.js=function(oop_reverse){var rv,left_code,opjs,subscope,ki$6,kobj$6,old_right,new_right,new_left;if(rv="",left_code=oop_reverse?oop_reverse:this.left.js(),null==this.op)rv+=left_code;else if(opjs=this.op.js(),"in"===opjs&&"of"!==this.op.op.value){if(null==use_snippets["in"]){for(use_snippets["in"]=snippets["in"],kobj$6=scopes,ki$6=0;kobj$6.length>ki$6;ki$6++)subscope=kobj$6[ki$6],subscope.k$indexof="closure";scope.k$indexof="closure"}old_right=this.right,new_right=this.right.left,new_left="(k$indexof.call("+new_right.js()+", "+left_code+") >= 0)",rv+=old_right.js(new_left)}else"nor"===opjs?rv+="!("+left_code+" || "+this.right.js()+")":"pow"===opjs?(old_right=this.right,new_right=this.right.left,new_left="Math.pow("+left_code+", "+new_right.js()+")",rv+=old_right.js(new_left)):rv+=""+left_code+" "+opjs+" "+this.right.js();return(null!=this.op?this.op.invert:void 0)&&(rv="!("+rv+")"),null!=this.conditional&&(rv=this.conditional.js(rv,!0)),rv},Grammar.UnaryExpression.prototype.js=function(){var rv,base_val,kw_translate,undefined_unary,existence_qualifiers,last_accessor,accessor,ki$7,kobj$7,existence_check,eq,ki$8,kobj$8,closeout,preop_value;for(rv="","IDENTIFIER"===this.base.type?(base_val=this.base.value,kw_translate=KEYWORD_TRANSLATE[base_val],"this"===kw_translate&&(kw_translate=kthis()),rv+=kw_translate||base_val,null==kw_translate&&null==scope[base_val]&&this.is_lvalue()&&0===this.accessors.length&&!this.compound_assign&&(scope[base_val]="closures ok")):rv+=this.base.js(),undefined_unary="IDENTIFIER"===this.base.type&&null==scope[base_val]&&null==kw_translate,existence_qualifiers=[],last_accessor=this.accessors[this.accessors.length-1],kobj$7=this.accessors,ki$7=0;kobj$7.length>ki$7;ki$7++)accessor=kobj$7[ki$7],existence_qualifiers.push(accessor.js_existence(rv,undefined_unary,last_accessor.invert)),rv+=accessor.js(),undefined_unary=!1;for(existence_check=[],kobj$8=existence_qualifiers,ki$8=0;kobj$8.length>ki$8;ki$8++)eq=kobj$8[ki$8],""!==eq&&existence_check.push(eq);return existence_check=existence_check.join(" && "),""!==existence_check&&(last_accessor instanceof Grammar.ExisentialCheck?rv="("+existence_check+")":(closeout="void 0",rv="(("+existence_check+") ? "+rv+" : "+closeout+")")),preop_value=null!=this.preop?this.preop.value:void 0,"new"===preop_value||"typeof"===preop_value?rv=""+KEYWORD_TRANSLATE[preop_value]+" "+rv:"not"===preop_value?(this.bitwise&&(preop_value="bitwise not"),rv=""+KEYWORD_TRANSLATE[preop_value]+"("+rv+")"):"-"===preop_value&&(rv="-"+rv),rv},Grammar.WhenExpression.prototype.js=function(true_block_js,must_return_value,false_js){var conditional_js,rv;return conditional_js=this.condition.js(),("unless"===this.specifier.value||"except"===this.specifier.value)&&(conditional_js="!("+conditional_js+")"),null!=this.false_expr&&null==false_js?"("+conditional_js+") ? "+true_block_js+" : "+this.false_expr.js():must_return_value?"("+conditional_js+") ? "+true_block_js+" : void 0":(rv="if ("+conditional_js+") {\n"+indent(true_block_js)+"}",null!=false_js&&(rv+=" else {\n"+false_js+"}"),rv+="\n")},Grammar.WhenExpression.prototype.js_bool=function(){return"unless"===this.specifier.value||"except"===this.specifier.value?"!("+this.condition.js()+")":this.condition.js()},Grammar.ExisentialCheck.prototype.js=function(){return""},Grammar.ExisentialCheck.prototype.js_existence=function(accessor,undefined_unary,invert){return check_existence_wrapper(accessor,undefined_unary,invert)},Grammar.PropertyAccess.prototype.js=function(){var rv;return rv="IDENTIFIER"===this.expr.type?this.expr.value:this.expr.js(),rv="."+rv},Grammar.PropertyAccess.prototype.js_existence=function(accessor,undefined_unary,invert){return this.exisential?check_existence_wrapper(accessor,undefined_unary,invert):""},Grammar.AssignmentStatement.prototype.js=function(){var op,rv;return op=this.assignOp.value,"="!==op&&(op+="=",this.lvalue.compound_assign=!0),rv=""+this.lvalue.js()+" "+op+" "+this.rvalue.js()+";\n",this.rvalue.left.base instanceof Grammar.FunctionExpression&&(rv+="\n"),null!=this.conditional&&(rv=this.conditional.js(rv,!1)),rv},Grammar.NumberConstant.prototype.js=function(){return this.token.text},Grammar.StringConstant.prototype.js=function(){return this.token.value},Grammar.RegexConstant.prototype.js=function(){return this.token.text},Grammar.BinOp.prototype.js=function(){var op_value;return op_value=this.op.value,this.bitwise&&(op_value="bitwise "+op_value),KEYWORD_TRANSLATE[op_value]||this.op.value},Grammar.IfStatement.prototype.js=function(){var cb_counter,conditional_js,rv,else_clause,ki$9,kobj$9,inner_js;for(null==this.original_callback&&(this.original_callback=this.callback),cb_counter=callback_counter,conditional_js=this.conditional.js(),("unless"===this.condition.value||"except"===this.condition.value)&&(conditional_js="!("+conditional_js+")"),rv="if ("+conditional_js+") {\n",this.block.in_conditional=!0,this.block.in_loop=this.in_loop,kobj$9=this.elses,ki$9=0;kobj$9.length>ki$9;ki$9++)else_clause=kobj$9[ki$9],else_clause.block.in_conditional=!0,else_clause.block.in_loop=this.in_loop;return inner_js=this.js_no_callbacks(),this.callback===current_callback||this.is_else_if||(callback_counter=cb_counter,inner_js=this.js_callbacks()),rv+inner_js},Grammar.IfStatement.prototype.js_no_callbacks=function(){var block_js,else_js,else_clause,ki$10,kobj$10;for(this.block.callback=this.callback,block_js=indent(this.block.js()+this.block.js_closeout())+"}",0===this.elses.length&&(block_js+="\n"),else_js="",kobj$10=this.elses,ki$10=0;kobj$10.length>ki$10;ki$10++)else_clause=kobj$10[ki$10],else_clause.block.callback=this.callback,else_clause.block.original_callback=this.original_callback,else_js+=" else",null!=else_clause.conditional&&(else_js+=" if ("+else_clause.conditional.js()+")"),else_js+=" {\n",else_js+=indent(else_clause.block.js()+else_clause.block.js_closeout()),else_js+="}\n";return block_js+else_js},Grammar.IfStatement.prototype.js_callbacks=function(){var block_js,else_clause,ki$11,kobj$11,else_js,ki$12,kobj$12,callback_js;for(this.callback=create_callback(),this.block.callback=this.callback,this.block.original_callback=this.callback,block_js=indent(this.block.js()),kobj$11=this.elses,ki$11=0;kobj$11.length>ki$11;ki$11++)else_clause=kobj$11[ki$11],else_clause.block.callback=this.callback,else_clause.block.original_callback=this.callback,else_clause.block_js_header=" else ",null!=else_clause.conditional&&(else_clause.block_js_header+="if ("+else_clause.conditional.js()+") "),else_clause.block_js_header+="{\n",else_clause.block_js=indent(else_clause.block.js());for(block_js+=indent(this.block.js_closeout())+"}",0===this.elses.length&&(block_js+="\n"),else_js="",kobj$12=this.elses,ki$12=0;kobj$12.length>ki$12;ki$12++)else_clause=kobj$12[ki$12],else_js+=else_clause.block_js_header+else_clause.block_js+indent(else_clause.block.js_closeout())+"}";return use_snippets.async=snippets.async,callback_js="return k$async("+this.callback+","+kthis()+");\n",callback_js+="function "+this.callback+"() {\n",callback_js+=indent(render_try_blocks()),this.parent_block.closeout_callback=this.original_callback,create_callback(),block_js+else_js+"\n"+callback_js},Grammar.BlankStatement.prototype.js=function(){return""},Grammar.ForStatement.prototype.js=function(){var rv,iterator,terminator,loop_counter,initial_val,incrementor,loop_block_js,from_val,to_val,increment;return this.callback=current_callback,this.loop_block.in_loop=!0,this.loop_block.in_conditional=this.in_conditional,rv="",iterator="ki$"+for_count,terminator="kobj$"+for_count,loop_counter="klc$"+for_count,initial_val="kiv$"+for_count,incrementor="kinc$"+for_count,for_count+=1,null==scope[this.iterant.value]&&(scope[this.iterant.value]="closures ok"),null!=this.index_var&&null==scope[this.index_var.value]&&(scope[this.index_var.value]="closures ok"),loop_block_js=this.loop_block.js()+this.loop_block.js_closeout(),this.callback!==current_callback?this.js_callbacks(iterator,terminator,loop_counter):("in"===this.type.value?null!=this.iterable_to?(from_val=this.iterable.number_constant(),to_val=this.iterable_to.number_constant(),null!=to_val&&null!=from_val?(increment=to_val>from_val?"++":"--",rv+="for ("+this.iterant.value+" = "+from_val+"; "+this.iterant.value+" <= "+to_val+"; "+this.iterant.value+increment+") {\n"):(scope[terminator]="no closures",scope[initial_val]="no closures",scope[incrementor]="no closures",rv+=""+initial_val+" = "+this.iterable.js()+"\n",rv+=""+terminator+" = "+this.iterable_to.js()+"\n",rv+=""+incrementor+" = "+initial_val+" < "+terminator+" ? 1 : -1;\n",rv+="for ("+this.iterant.value+" = "+initial_val+"; "+terminator+" > "+initial_val+" ? "+this.iterant.value+" <= "+terminator+" : "+this.iterant.value+" >= "+terminator+"; "+this.iterant.value+" += "+incrementor+") {\n")):(scope[iterator]="no closures",scope[terminator]="no closures",rv+=""+terminator+" = "+this.iterable.js()+";\n",rv+="for ("+iterator+" = 0; "+iterator+" < "+terminator+".length; "+iterator+"++) {\n",rv+="  "+this.iterant.value+" = "+terminator+"["+iterator+"];\n",null!=this.index_var&&(rv+="  "+this.index_var.value+" = "+iterator+";\n")):"of"===this.type.value?(scope[iterator]="no closures",scope[terminator]="no closures",rv+=""+terminator+" = "+this.iterable.js()+";\n",rv+="for ("+this.iterant.value+" in "+terminator+") {\n",rv+="  if (!"+terminator+".hasOwnProperty("+this.iterant.value+")) {continue;}\n"):"from"===this.type.value&&(scope[iterator]="no closures",scope[terminator]="no closures",null!=this.iterable_to?(use_snippets["range generator"]=snippets["range generator"],rv+=""+terminator+" = new k$rangegen("+this.iterable.js()+", "+this.iterable_to.js()+");\n"):rv+=""+terminator+" = "+this.iterable.js()+";\n",rv+="while (("+this.iterant.value+" = "+terminator+".next()) !== undefined) {\n"),rv+=indent(loop_block_js),rv+="}\n",rv)},Grammar.ForStatement.prototype.js_callbacks=function(iterator,terminator,loop_counter){var rv,loop_callback;if(rv="",null!=this.iterable_to)throw Error("asynchronous for ... to ... loops are not supported");if("from"===this.type.value)throw Error("asynchronous for ... from ... loops are not supported");return"parallel"===(null!=this.execution_style?this.execution_style.value:void 0)?(loop_callback=create_callback(),this.callback=create_callback(),this.loop_block.callback=loop_callback,this.loop_block.original_callback=loop_callback,parfor_cb_stack.push(parfor_cb),parfor_cb=loop_callback,scope[iterator]="no closures",scope[terminator]="no closures",rv+="(function ("+loop_counter+") {\n",rv+="  "+terminator+" = "+this.iterable.js()+";\n",rv+="in"===this.type.value?"  for ("+iterator+" = 0; "+iterator+" < "+terminator+".length; "+iterator+"++) {\n":"  for ("+iterator+" in "+terminator+") {\n",rv+="      "+loop_counter+"++;\n",rv+="      k$async(function ("+this.iterant.value,null!=this.index_var&&(rv+=", "+this.index_var.value),rv+=") {\n",rv+=multi_indent(render_try_blocks(),3),rv+=multi_indent(this.loop_block.js()+this.loop_block.js_closeout(),3),rv+=multi_indent(render_catch_blocks(),3),rv+="in"===this.type.value?"    },"+kthis()+",["+terminator+"["+iterator+"],"+iterator+"]);\n":"    },"+kthis()+",["+iterator+"]);\n",rv+="  }\n",use_snippets.async=snippets.async,rv+="  return "+loop_callback+".apply("+kthis()+");\n",rv+="  function "+loop_callback+"() {\n",rv+="    if (--"+loop_counter+" == 0) return k$async("+this.callback+","+kthis()+");\n",rv+="  }\n",rv+="})(1);\n",rv+="return;\n",rv+="function "+this.callback+"() {\n",rv+=indent(render_try_blocks()),this.parent_block.closeout_callback=this.original_callback,parfor_cb=parfor_cb_stack.pop()):(this.callback=create_callback(),this.loop_block.callback="k$lcb",this.loop_block.original_callback="k$lcb",use_snippets.async=snippets.async,"in"===this.type.value?rv+="return k$async("+loop_counter+","+kthis()+",[0,"+this.iterable.js()+","+this.iterable.js()+"[0]]);\n":(scope[terminator]="no closures",scope[iterator]="no closures",rv+=""+terminator+" = [];\n",rv+="for ("+iterator+" in "+this.iterable.js()+") {if (("+this.iterable.js()+").hasOwnProperty("+iterator+")) {"+terminator+".push("+iterator+")};}\n",rv+="return "+loop_counter+".apply("+kthis()+",[0,"+terminator+","+terminator+"[0]]);\n"),rv+="function "+loop_counter+"(k$i,k$obj,"+this.iterant.value+") {\n",null!=this.index_var&&(rv+="  "+this.index_var.value+" = k$i;\n"),rv+=render_try_blocks(),rv+="  k$i++;\n",rv+="  var k$lcb = function () {if (k$i < k$obj.length) return "+loop_counter+".apply("+kthis()+",[k$i,k$obj,k$obj[k$i]]); else return k$async("+this.callback+","+kthis()+");};\n",rv+=indent(this.loop_block.js()+this.loop_block.js_closeout()),rv+=indent(render_catch_blocks()),rv+="}\n",rv+="function "+this.callback+"() {\n",rv+=indent(render_try_blocks()),this.parent_block.closeout_callback=this.original_callback),rv},Grammar.WhileStatement.prototype.js=function(){var rv;return this.block.in_loop=!0,this.block.in_conditional=this.in_conditional,rv="until"===this.specifier.value?"while (!("+this.expr.js()+")) {\n":"while ("+this.expr.js()+") {\n",rv+=indent(this.block.js()+this.block.js_closeout()),rv+="}\n",this.callback!==current_callback?this.js_callbacks():rv},Grammar.WhileStatement.prototype.js_callbacks=function(){var rv,while_wrapper,expr_js;return rv="",while_count+=1,while_wrapper="kw$"+while_count,this.callback=create_callback(),this.block.callback="k$lcb",this.block.original_callback="k$lcb",use_snippets.async=snippets.async,rv+="return "+while_wrapper+"();\n",rv+="function "+while_wrapper+"() {\n",rv+=render_try_blocks(),expr_js=this.expr.js(),"until"===this.specifier.value&&(expr_js="!("+expr_js+")"),rv+="  var k$lcb = function () {if ("+expr_js+") return "+while_wrapper+".apply("+kthis()+"); else return k$async("+this.callback+","+kthis()+");};\n",rv+=indent(this.block.js()+this.block.js_closeout()),rv+=indent(render_catch_blocks()),rv+="}\n",rv+="function "+this.callback+"() {\n",rv+=indent(render_try_blocks()),this.parent_block.closeout_callback=this.original_callback,rv},Grammar.LoopControlStatement.prototype.js=function(){return""+this.control.value+";\n"},Grammar.Block.prototype.js=function(){var previous_cb,rv,statement,statement_js,ki$13,kobj$13;for(null==this.callback&&(this.callback=current_callback),null==this.original_callback&&(this.original_callback=current_callback),previous_cb=current_callback,this.callbacks=[],rv="",this.indent_level=0,kobj$13=this.statements,ki$13=0;kobj$13.length>ki$13;ki$13++)statement=kobj$13[ki$13],statement.parent_block=this,statement.callback=this.callback,statement.original_callback=this.original_callback,statement.in_conditional=this.in_conditional,statement.in_loop=this.in_loop,statement_js=statement.js(),rv+="\n"!==statement_js[0]||"\n\n"!==rv.slice(-2)&&0!==rv.length?multi_indent(statement_js,this.indent_level):multi_indent(statement_js.slice(1),this.indent_level),current_callback!==previous_cb&&(this.indent_level+=1,this.callbacks.unshift(this.callback),this.callback=current_callback,previous_cb=current_callback);return this.callbacks.length>0&&null!=scope.k$next&&(rv+=multi_indent("var k$done = (typeof k$next == 'function') ? k$next : function () {}; k$next=function () {}; return k$done();\n",this.indent_level+1)),rv},Grammar.Block.prototype.js_closeout=function(){var rv,callback,ki$14,kobj$14;for(rv="",null!=this.closeout_callback&&0!==this.callbacks.length&&(this.in_conditional||this.in_loop)&&(use_snippets.async=snippets.async,rv+=multi_indent("return k$async("+this.closeout_callback+","+kthis()+");\n",this.indent_level)),kobj$14=this.callbacks,ki$14=0;kobj$14.length>ki$14;ki$14++)callback=kobj$14[ki$14],rv+=multi_indent(render_catch_blocks(),this.indent_level),rv+=multi_indent("}\n",this.indent_level-1);return rv},Grammar.ParenExpression.prototype.js=function(){return"("+this.expr.js()+")"},Grammar.IndexExpression.prototype.js=function(){return"["+this.expr.js()+"]"},Grammar.IndexExpression.prototype.js_existence=function(accessor,undefined_unary,invert){return this.exisential?check_existence_wrapper(accessor,undefined_unary,invert):""},Grammar.RangeExpression.prototype.js=function(){return use_snippets.range=snippets.range,"k$range("+this.from_expr.js()+","+this.to_expr.js()+")"},Grammar.ListExpression.prototype.js=function(){var rv,item,ki$15,kobj$15;if(null==this.comprehension){for(rv=[],kobj$15=this.items,ki$15=0;kobj$15.length>ki$15;ki$15++)item=kobj$15[ki$15],rv.push(item.js());return rv=rv.join(", "),"["+rv+"]"}return this.comprehension.js()},Grammar.ListComprehension.prototype.js=function(){var rv;return use_snippets["array list comprehension"]=snippets["array list comprehension"],scope[this.iterant.value]="closures ok",rv="k$comprl("+this.iterable.js()+",function (k$i) {"+this.iterant.value+" = k$i; return "+this.iter_expr.js()+";}",null!=this.conditional&&(rv+=",function ("+this.iterant.value+") {return "+this.conditional.js_bool()+";}"),rv+=")"},Grammar.ObjectComprehension.prototype.js=function(){var init,rv;return use_snippets["object list comprehension"]=snippets["object list comprehension"],init="",null!=this.property_iterant&&(scope[this.property_iterant.value]="closures ok",init+=""+this.property_iterant.value+" = k$p;"),null!=this.value_iterant&&(scope[this.value_iterant.value]="closures ok",init+=""+this.value_iterant.value+" = k$v;"),rv="k$compro("+this.iterable.js()+",function (k$p,k$v) {"+init+" return "+this.iter_expr.js()+";}",null!=this.conditional&&(rv+=",function (k$p,k$v) {"+init+" return "+this.conditional.js_bool()+";}"),rv+=")"},Grammar.MapItem.prototype.js=function(){return""+this.key.value+": "+this.val.js()},Grammar.MapExpression.prototype.js=function(){var rv,item,ki$16,kobj$16;for(rv=[],kobj$16=this.items,ki$16=0;kobj$16.length>ki$16;ki$16++)item=kobj$16[ki$16],rv.push(item.js());return rv=rv.join(", "),"{"+rv+"}"},Grammar.FunctionExpression.prototype.js=function(){var rv;if("task"===this.specifier.value&&(this.callback="k$next"),null!=this.name&&null!=this.bind_to){if("method"===this.specifier.value&&"initialize"===this.name.value)throw Error("late binding for constructors is not supported");return push_class(),class_def={name:this.bind_to.js(),code:"",args:[],has_constructor:!1},rv=this.js_class_member(),pop_class(),rv}return class_defs.length>0&&null!=this.name?"method"===this.specifier.value&&"initialize"===this.name.value?(class_def.code+=this.js_constructor(),""):this.js_class_member():this.js_bare_function()},Grammar.FunctionExpression.prototype.js_bare_function=function(){var rv;return rv="function ",null!=this.name&&(rv+=this.name.value),rv+this.js_body()},Grammar.FunctionExpression.prototype.js_class_member=function(){var rv;return rv="method"===this.specifier.value||"task"===this.specifier.value?""+class_def.name+".prototype."+this.name.value+" = function ":""+class_def.name+"."+this.name.value+" = function ",rv+this.js_body()},Grammar.FunctionExpression.prototype.js_constructor=function(){var rv,argument;return class_def.has_constructor=!0,rv="function "+class_def.name,class_def.args=[],class_def.arguments=k$comprl(this.arguments,function(k$i){return argument=k$i}),rv+=this.js_body(class_def.args),null!=this.callback?class_def.arguments.push(this.callback):void 0,rv},Grammar.FunctionExpression.prototype.js_body=function(){var rv,default_arg_js,arg_names,argument,arg_name,ki$17,kobj$17,block_code,ki$18,kobj$18;for(rv="",default_arg_js="",push_scope(),null!=this.callback&&(scope.k$next="no closures",scope.k$this="closures ok"),arg_names=k$comprl(this.arguments,function(k$i){return argument=k$i,(null!=argument.name?argument.name.value:void 0)||argument}),kobj$17=arg_names,ki$17=0;kobj$17.length>ki$17;ki$17++)arg_name=kobj$17[ki$17],scope[arg_name]="argument";for(block_code=this.block.js(!0)+this.block.js_closeout(),kobj$18=this.arguments,ki$18=0;kobj$18.length>ki$18;ki$18++)argument=kobj$18[ki$18],null!=argument.default&&(default_arg_js+="if ("+argument.name.value+" == null",null!=this.callback&&(default_arg_js+=" || "+argument.name.value+" == k$next"),default_arg_js+=") "+argument.name.value+" = "+argument.default.js()+";\n");return null!=this.callback?(use_snippets.async=snippets.async,use_snippets["get callback"]=snippets["get callback"],block_code="var k$next = k$getcb(arguments);\nk$this = this;\n"+default_arg_js+"try {\n"+indent(block_code)):block_code=default_arg_js+block_code,rv+=indent(pop_scope(block_code,!1)),null!=this.callback&&(rv+="  } catch (k$err) {if (k$next) {return k$async(k$next,k$this,[k$err]);} else {throw k$err;}}\n",rv+="  return k$next ? k$async(k$next,k$this) : void 0;\n"),rv="("+arg_names.join(", ")+") {\n"+rv+"}"},Grammar.FunctionCall.prototype.js=function(as_list){var rv,argument,ki$19,kobj$19;for(rv=[],kobj$19=this.arguments,ki$19=0;kobj$19.length>ki$19;ki$19++)argument=kobj$19[ki$19],rv.push(argument.js());return null!=this.callback_name?rv.push(this.callback_name):void 0,rv=rv.join(", "),as_list?"["+rv+"]":"("+rv+")"},Grammar.FunctionCall.prototype.js_existence=function(accessor,undefined_unary,invert){return this.exisential?check_existence_wrapper(accessor,undefined_unary,invert):""},Grammar.FunctionCallArgument.prototype.js=function(){return this.val.js()},Grammar.ClassDefinition.prototype.js=function(){var block_code,rv;return push_scope(),push_class(),class_def.name=this.name.value,class_def.parent=null!=this.parent?this.parent.value:void 0,block_code=this.block.js()+this.block.js_closeout(),block_code=pop_scope(block_code,!1),rv="\n"+class_def.code,""!==(null!=class_def.code)&&(rv+="\n"),class_def.has_constructor||(rv+="function "+class_def.name+"() {\n",null!=this.parent&&(rv+="  return "+this.parent.value+".prototype.constructor.apply(this,arguments);\n"),rv+="}\n"),null!=this.parent?(rv+="__extends("+this.name.value+","+this.parent.value+");\n\n",use_snippets.inherits=snippets.inherits):rv+="\n",rv+=block_code,pop_class(),rv},Grammar.TryCatch.prototype.js=function(){var rv;return try_block_stack.unshift(this),this.try_block.in_conditional=!0,this.try_block.in_loop=this.in_loop,null==this.original_callback&&(this.original_callback=this.callback),rv=this.js_no_callbacks(),this.callback!==current_callback?(this.callback=create_callback(),this.closeout_callback=this.callback,rv=this.js_callbacks()):try_block_stack.shift(),rv},Grammar.TryCatch.prototype.js_no_callbacks=function(){var rv;return rv=this.js_wrapper_try(),this.try_block.original_callback=this.original_callback,rv+=multi_indent(this.try_block.js()+this.try_block.js_closeout(),try_block_stack.length),rv+=this.js_wrapper_catch()},Grammar.TryCatch.prototype.js_callbacks=function(){var rv;return rv=this.js_wrapper_try(),this.try_block.original_callback=this.callback,rv+=multi_indent(this.try_block.js()+this.try_block.js_closeout(),try_block_stack.length),rv+=this.js_wrapper_catch(),rv+="function "+this.callback+"() {\n",try_block_stack.shift(),rv+=indent(render_try_blocks()),this.parent_block.closeout_callback=this.original_callback,rv},Grammar.TryCatch.prototype.js_wrapper_try=function(){var rv;return rv="try {\n"},Grammar.TryCatch.prototype.js_wrapper_catch=function(){var rv;return null!=try_block_stack[0]&&(try_block_stack[0].in_catch=!0),rv="}",null!=this.catch_block?(rv+=" catch ("+((null!=this.identifier?this.identifier.value:void 0)||"k$e")+") {\n",rv+=indent(this.catch_block.js()+this.catch_block.js_closeout())):(rv+=" catch (k$e) {",(null!=parfor_cb||null!=this.closeout_callback)&&(rv+="\n")),null!=parfor_cb?(use_snippets.async=snippets.async,rv+=indent("return k$async("+parfor_cb+","+kthis()+");\n")):null!=this.closeout_callback&&(use_snippets.async=snippets.async,rv+=indent("return k$async("+this.closeout_callback+","+kthis()+");\n")),rv+="}\n",null!=try_block_stack[0]&&(try_block_stack[0].in_catch=!1),rv},Grammar.SuperStatement.prototype.js=function(){var rv;return null==class_def.parent?"":(rv=""+class_def.parent+".prototype.constructor.apply("+kthis()+",",rv+=null!=this.accessor?this.accessor.js(!0):"arguments",rv+=");\n")},Grammar.WaitForStatement.prototype.js=function(){var prefix,rv,number,tvalue_js,rv_block,arg_i,argument,ki$20,kobj$20,try_count;if(null!=try_block_stack[0]?try_block_stack[0].in_catch:void 0)throw Error("wait fors not supported in catch blocks");for(prefix=this.parent_block.bare?"":"return ",this.new_callback=create_callback(),null!=this.rvalue?(this.rvalue.callback_args=this.lvalue,this.rvalue.accessors[this.rvalue.accessors.length-1].callback_name=this.new_callback,rv=""+prefix+this.rvalue.js()+";\n"):(number=this.tvalue.number_constant(),null!=number?tvalue_js=""+1e3*number:(tvalue_js=this.tvalue.js(),tvalue_js="("+this.tvalue.js()+")*1000"),rv=""+prefix+"setTimeout("+this.new_callback+","+tvalue_js+");\n"),null!=this.conditional&&(rv=this.conditional.js(rv,!1),rv+=""+prefix+this.new_callback+"();\n"),rv_block="",arg_i=this.no_errors?0:1,kobj$20=(null!=this.lvalue?this.lvalue.arguments:void 0)||[],ki$20=0;kobj$20.length>ki$20;ki$20++)argument=kobj$20[ki$20],rv_block+=""+argument.base.value+" = arguments["+arg_i+"];\n",null==scope[argument.base.value]&&(scope[argument.base.value]="closures ok"),arg_i+=1;
return this.block.in_conditional=this.in_conditional,this.block.in_loop=this.in_loop,rv_block+=this.block.js(),rv+="function "+this.new_callback+"() {\n",try_count=try_block_stack.length+1,"undefined"!=typeof try_block&&null!==try_block&&(try_count+=1),rv+=indent(render_try_blocks()),this.no_errors||(rv+=multi_indent("if (arguments[0] != null) throw arguments[0];\n",try_count)),rv+=multi_indent(rv_block,try_count),this.in_conditional||this.in_loop?(use_snippets.async=snippets.async,rv+=multi_indent(""+prefix+"k$async("+this.parent_block.original_callback+","+kthis()+");\n",this.block.indent_level+try_count)):scope.k$next&&(use_snippets.async=snippets.async,rv+=multi_indent(""+prefix+"k$next ? k$async(k$next,"+kthis()+") : void 0;\n",this.block.indent_level+try_count)),rv+=this.block.js_closeout()},Grammar.WaitForExpression.prototype.js=function(){var rv_block,arg_i,argument,ki$21,kobj$21,rv;for(rv_block="",this.new_callback=create_callback(),arg_i=this.no_errors?0:1,kobj$21=(null!=this.lvalue?this.lvalue.arguments:void 0)||[],ki$21=0;kobj$21.length>ki$21;ki$21++)argument=kobj$21[ki$21],rv_block+=""+argument.base.value+" = arguments["+arg_i+"];\n",null==scope[argument.base.value]&&(scope[argument.base.value]="closures ok"),arg_i+=1;return this.rvalue.callback_args=this.lvalue,this.rvalue.accessors[this.rvalue.accessors.length-1].callback_name=this.new_callback,rv=""+this.rvalue.js()+";\n",null!=this.conditional&&(rv=this.conditional.js(rv,!1,"k$async("+this.callback+","+kthis()+");\n")),rv+="function "+this.new_callback+"() {\n",use_snippets.async=snippets.async,this.no_errors||(rv+="  if (arguments[0] != null) {\n",rv+="    "+this.error_holder+"["+this.error_index+"] = arguments[0];\n",rv+="    return k$async("+this.callback+","+kthis()+");\n",rv+="  }\n"),rv+=indent(rv_block),rv+="  k$async("+this.callback+","+kthis()+");\n",rv+="}\n"},Grammar.RunInParallelBlock.prototype.js=function(){var loop_counter,loop_errors,rv,wf_index,wait_for,ki$22,kobj$22;for(this.callback=create_callback(),loop_counter="klc$"+for_count,loop_errors="kle$"+for_count,for_count+=1,scope[loop_counter]="no closures",scope[loop_errors]="no closures",rv=""+loop_counter+" = "+this.wait_fors.length+";\n"+loop_errors+" = [];\n",wf_index=0,kobj$22=this.wait_fors,ki$22=0;kobj$22.length>ki$22;ki$22++)wait_for=kobj$22[ki$22],wait_for.callback=this.callback,wait_for.parent_block=this.parent_block,wait_for.error_holder=loop_errors,wait_for.error_index=wf_index,rv+=""+wait_for.js(),wf_index+=1;return rv+="function "+this.callback+"() {\n",rv+="  if (--"+loop_counter+") return;\n",rv+=indent(render_try_blocks()),rv+=multi_indent("  for (var "+loop_errors+"i = 0; "+loop_errors+"i < "+wf_index+"; "+loop_errors+"i++) { if ("+loop_errors+"["+loop_errors+"i]) throw "+loop_errors+"; }\n",try_block_stack.length),this.parent_block.closeout_callback=this.original_callback,rv},Grammar.UnpackStatement.prototype.js=function(){var source_obj,rv,item,obj_property,variable,var_js,ki$23,kobj$23;for(source_obj="kobj$"+for_count,scope[source_obj]="no closures",for_count+=1,rv=""+source_obj+" = "+this.source.js()+";\n",kobj$23=this.unpack_list.members,ki$23=0;kobj$23.length>ki$23;ki$23++)item=kobj$23[ki$23],obj_property=item[0],variable=null!=item[1]?item[1]:item[0],var_js=variable.value||variable.js(),scope[var_js]="closures ok",rv+=""+var_js+" = "+source_obj+"."+obj_property.js()+";\n";return rv},snippets={"in":"var k$indexof = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };",inherits:"var __hasProp = {}.hasOwnProperty, __extends = function (child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }","array list comprehension":'var k$comprl = function (iterable,func,cond) {var o = []; cond = cond || function () {return true;}; if (iterable instanceof Array || typeof iterable.length == "number") {for (var i=0;i<iterable.length;i++) {if (cond(iterable[i])) {o.push(func(iterable[i]));}}} else if (typeof iterable.next == "function") {var i; while ((i = iterable.next()) != null) {if (cond(i)) {o.push(func(i));}}} else {throw "Object is not iterable";}return o;};',"object list comprehension":"var k$compro = function (obj,func,cond) {var o = []; cond = cond || function () {return true;}; for (var k in obj) {if (cond(k,obj[k])) {o.push(func(k,obj[k]));}} return o;}",async:'var k$async = (typeof process === "undefined" || !(process.nextTick)) ? (function (fn,self,args) {setTimeout(function () {fn.apply(self,args);}, 0);}) : (function (fn,self,args) {process.nextTick(function () {fn.apply(self,args);});});',"get callback":'var k$getcb = function (args) {return typeof args[args.length-1] == "function" ? args[args.length-1] : function () {}};',range:"var k$range = function (start,stop,step) {step = step || (start > stop ? -1 : 1);for (var rv=[]; step>0?start<=stop:start>=stop; start+=step) rv.push(start);return rv;};","delete":'var k$del = function (arr,indices) {if (typeof indices == "number") {arr.splice(indicies,1);} else {indices.sort(); for (var i = indices.length-1; i >= 0; i--) arr.splice(indices[i],1);}}',"range generator":"var k$rangegen = function (a,b) {this.v = a; this.next = (a < b) ? function () {if (this.v <= b) return this.v++;} : function () {if (this.v >= b) return this.v--;};}"}})();