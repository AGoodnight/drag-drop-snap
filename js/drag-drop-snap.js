;(function(){

	DragDropSnap = function(container,drags,drops,solution,draggablesArray,orientation){

		function relPosition(t,d){
			// Calculate the snapping coordinates
			// -----------------------------------
			var c = parseInt(t.vars.i)+1;  
			var d = parseInt(d[1])+1;

			var mult;
			var v;

			if( c > d ){
				mult = -1;
				v = c-d;
			}else if(c < d){
				mult = 1;
				v = d-c;
			}else if(c==d){
				mult = 1;
				v = 0;
			}

			return v*mult;
		};

		function whichDrop(t,j){

			for(var i in drops){
				if(t.hitTest(drops[i])){
					if(j){
						return i
					}else{
						return drops[i];
					}
				}
			}
		};

		for(var i in drags){

			draggablesArray[i] = Draggable.create(drags[i],{
				type:"x,y",
				bounds:container,

				// ----------------------------
				// PRIMARY FUNCTION
				// ----------------------------
				onRelease:function(e){

					var thisDrop = whichDrop(this);

					if(thisDrop !== undefined){
						
						// Make this variable an Array with a number to reference in our functions
						// -------------------------------------------------------------------------
						thisDrop = [getNode(thisDrop), whichDrop(this,true)];

						if(this.hitTest(thisDrop[0])){

							// Get computed margins, for our snapping function
							// -------------------------------------------------
							var _left = parseInt(computedStyle(thisDrop[0][0],'margin-left'));
							var _right = parseInt(computedStyle(thisDrop[0][0],'margin-right'));
							var _top = parseInt(computedStyle(thisDrop[0][0],'margin-top'));
							var _bottom = parseInt(computedStyle(thisDrop[0][0],'margin-bottom'));

							var _x, _y, oy;

							// We made an internal function of Draggable public so we could get some data for snapping
							// -----------------------------------------------------------------------------------------

							switch(orientation){
								case 'hori':
									_x = (Draggable.parseRect(thisDrop[0]).width+(_left+_right))*relPosition(this,thisDrop);
									_y = (Draggable.parseRect(thisDrop[0]).top-_top);
									oy = Draggable.parseRect(thisDrop[0]).height+_top/2
								break;
								case 'vert':
									_x = (Draggable.parseRect(thisDrop[0]).left-_left);
									_y = (Draggable.parseRect(thisDrop[0]).height+(_top+_bottom))*relPosition(this,thisDrop);
									oy = _y
								break;
								default:
									_x = (Draggable.parseRect(thisDrop[0]).width+(_left+_right))*relPosition(this,thisDrop);
									_y = (Draggable.parseRect(thisDrop[0]).top-_top);
									oy = Draggable.parseRect(thisDrop[0]).height+_top/2
								break;
							};
							
							// Set the div to the coordinates
							TweenLite.to(this._eventTarget,.1,{x:_x,y:_y});

							// Is this drop the right answer?
							// ------------------------------
							if(parseInt(thisDrop[1]) === solution[this.vars.i]-1 ){
								TweenLite.to(this._eventTarget,.4,{backgroundColor:'#222222'})
								this.vars._solved = true;
							}else{
								TweenLite.to(this._eventTarget,.4,{backgroundColor:'#e24b16'})
								this.vars._solved = false
							}

							// Is the Drag and Drop Solved?
							// ------------------------------
							if(isSolved(draggablesArray)){
								jig('.block').hop({stagger:.1,offsetY:oy,repeat:1,speed:.7}).play();
							}

						};
					}else{

						// Well Duh...
						// ------------
						TweenLite.to(this._eventTarget,.4,{backgroundColor:'#e24b16'});
						this.vars._solved = false;
					}
				}
			});

			// the position of our Draggable instance in the draggables array
			draggablesArray[i][0].vars.i = i;

		};
	};
	function isSolved(what){
		
		var g = 0;
		console.log(what)
		for(var i in what){
			if(what[i][0].vars._solved){
				g++
			}
		}

		if(g==what.length){
			return true;
		}else{
			return false;
		}
	};

})();