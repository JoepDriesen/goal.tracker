var gh_storage,
    cat_dict = {},
    goal_dict = {};

function esp(event) {
	if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;
}


function sort_ordinal( a, b ) {

	if ( typeof( a.completed ) !== 'undefined' && typeof( b.completed ) !== 'undefined' ) {
		
		if ( a.completed() && !b.completed() )
			return 1;
		if ( b.completed() && !a.completed() )
			return -1;
			
	}

	if ( typeof( a.json.ordinal ) === 'undefined' )
		a.json.ordinal = 0
	if ( typeof( b.json.ordinal ) === 'undefined' )
		b.json.ordinal = 0
		
	if ( a.json.ordinal === b.json.ordinal )
		return ( ( a.json.name == b.json.name ) ? 0 : ( ( a.json.name > b.json.name ) ? 1 : -1 ) );
		
	return a.json.ordinal > b.json.ordinal;

}

function create_category() {

    $( '#modallabel-create-cat' ).text( 'Create New Category' );
	$( '#updating-cat-id' ).val( '' );
	$( '#input-cat-name' ).val( '' );
    $( '#input-cat-ordinal' ).val( '-1' );
	$( '#btn-create-cat' ).text( 'Create' );
	
	$( '#modal-create-cat' ).modal( 'show' );
	
}

function delete_category( category_id ) {

	if ( confirm( 'Are you sure you wish to delete this category?\nThis will also delete all goals belonging to this category.' ) )
		$.when( gh_storage.removeObject( category_id ) ).then( function() {
			
			location.reload();
			
		} );
	
}

function demote_category( category_id ) {

	var cat = cat_dict[ category_id ];
	cat.json.ordinal = typeof( cat.json.ordinal ) !== 'undefined' ? parseInt( cat.json.ordinal ) + 1 : 0

	$.when( gh_storage.saveObject( cat.json,  ['category'], category_id ) ).then( function() { location.reload(); } );
}

function promote_category( category_id ) {

	var cat = cat_dict[ category_id ];
	cat.json.ordinal = typeof( cat.json.ordinal ) !== 'undefined' ? parseInt( cat.json.ordinal ) - 1 : 0

	$.when( gh_storage.saveObject( cat.json,  ['category'], category_id ) ).then( function() { location.reload(); } );
		
}

function update_category( category_id ) {

    var cat = cat_dict[ category_id ];

    $( '#modallabel-create-cat' ).text( 'Update Category' );
	$( '#updating-cat-id' ).val( category_id );
	$( '#input-cat-name' ).val( cat.json.name );
    $( '#input-cat-ordinal' ).val( cat.json.ordinal );
	$( '#btn-create-cat' ).text( 'Update' );
	
	$( '#modal-create-cat' ).modal( 'show' );
	
}

function create_goal() {

    $( '#modallabel-create-goal' ).text( 'Create New Goal' );
    $( '#updating-goal-id' ).val( '' );
    $( '#input-goal-name' ).val( '' );
    $( '#input-goal-deadline' ).val( '' );
    $( '#input-goal-category' ).val( '' ).change();
    $( '#input-goal-type' ).val( 'boolean' ).change();
    $( '#input-goal-parent' ).val( '' ).change();
    $( '#input-goal-ordinal' ).val( '-1' );
    $( '#btn-create-goal' ).text( 'Create' );

    $( '#modal-create-goal' ).modal( 'show' );

}

function delete_goal( goal_id ) {

	if ( confirm( 'Are you sure you wish to delete this goal?\nThis will also delete all subgoals.' ) )
		$.when( gh_storage.removeObject( goal_id ) ).then( function() {
			
			location.reload();
			
		} );
	
}

function demote_goal( goal_id ) {

	var goal = goal_dict[ goal_id ];
	goal.json.ordinal = typeof( goal.json.ordinal ) !== 'undefined' ? parseInt( goal.json.ordinal ) + 1 : 0

	$.when( gh_storage.saveObject( goal.json,  ['goal'], goal_id ) ).then( function() { location.reload(); } );
	
}

function promote_goal( goal_id ) {

	var goal = goal_dict[ goal_id ];
	goal.json.ordinal = typeof( goal.json.ordinal ) !== 'undefined' ? parseInt( goal.json.ordinal ) - 1 : 0

	$.when( gh_storage.saveObject( goal.json,  ['goal'], goal_id ) ).then( function() { location.reload(); } );
	
}

function update_goal( goal_id ) {

    var goal = goal_dict[ goal_id ];

    $( '#modallabel-create-goal' ).text( 'Update Goal' );
    $( '#updating-goal-id' ).val( goal_id );
    $( '#input-goal-name' ).val( goal.json.name );
    $( '#input-goal-deadline' ).val( goal.json.deadline );
    $( '#input-goal-category' ).val( goal.json.category ).change();
    $( '#input-goal-type' ).val( goal.json.type ).change();
    $( '#input-goal-parent' ).val( goal.json.parent ).change();
    $( '#input-goal-ordinal' ).val( goal.json.ordinal );
    $( '#btn-create-goal' ).text( 'Update' );

    $( '#modal-create-goal' ).modal( 'show' );

}

function update_cumul_values( goal_id ) {

    var goal = goal_dict[ goal_id ];

    $( '#updating-cumul-goal-id' ).val( goal_id );
    $( '#input-cumul-current-value' ).val( goal.json.current_value );
    $( '#input-cumul-max-value' ).val( goal.json.max_value );

    $( '#modal-update-cumul-values' ).modal( 'show' );
    
}

function update_bool_values( goal_id ) {

    var goal = goal_dict[ goal_id ];

    $( '#updating-bool-goal-id' ).val( goal_id );
	$( '#input-bool-current-value' ).bootstrapSwitch( 'state', goal.current_value === 'on' ?  true : false );

    $( '#modal-update-bool-values' ).modal( 'show' );
    
}

function update_perc_values( goal_id ) {

    var goal = goal_dict[ goal_id ];

    $( '#updating-perc-goal-id' ).val( goal_id );
    $( '#input-perc-current-value' ).val( goal.json.current_value );

    $( '#modal-update-perc-values' ).modal( 'show' );
    
}

function get_username( cb ) {
    
    var github_username = localStorage.getItem( 'github_username' );
    
    if ( github_username )
        return cb( github_username );
    
    $( '#input-modal .modal-title' ).text( "Specify Github Username" );
    $( '#input-modal input' ).val( "" );
    $( '#input-modal input' ).attr( "placeholder", "Username" );
    $( '#input-modal input' ).attr( "type", "text" );
    $( '#input-modal' ).modal( 'show' );
    $( '#input-modal button' ).one( 'click', function() {
        github_username = $( '#input-modal input' ).val();
        localStorage.setItem( 'github_username', github_username );
        $( '#input-modal' ).one( 'hidden.bs.modal', function() {
            return cb( github_username );
        })
        $( '#input-modal' ).modal( 'hide' );
    } );
}

function get_password( cb ) {
    
    var github_password = localStorage.getItem( 'github_password' );

    if ( github_password )
        return cb( github_password );
    
    $( '#input-modal .modal-title' ).text( "Specify Github Password" );
    $( '#input-modal input' ).val( "" );
    $( '#input-modal input' ).attr( "placeholder", "Password" );
    $( '#input-modal input' ).attr( "type", "password" );
    $( '#input-modal' ).modal( 'show' );
    $( '#input-modal button' ).one( 'click', function() {
        github_password = $( '#input-modal input' ).val();
        localStorage.setItem( 'github_password', github_password );
        $( '#input-modal' ).one( 'hidden.bs.modal', function() {
            return cb( github_password );
        })
        $( '#input-modal' ).modal( 'hide' );
    } );
}

function get_repo( cb ) {
    
    var github_repo = localStorage.getItem( 'github_repo' );

    if ( github_repo )
        return cb( github_repo );
    
    $( '#input-modal .modal-title' ).text( "Specify Github Repository to use as Database" );
    $( '#input-modal input' ).val( "" );
    $( '#input-modal input' ).attr( "placeholder", "Repository" );
    $( '#input-modal input' ).attr( "type", "text" );
    $( '#input-modal' ).modal( 'show' );
    $( '#input-modal button' ).one( 'click', function() {
        github_repo = $( '#input-modal input' ).val();
        localStorage.setItem( 'github_repo', github_repo );
        $( '#input-modal' ).one( 'hidden.bs.modal', function() {
            return cb( github_repo );
        })
        $( '#input-modal' ).modal( 'hide' );
    } );
}

function get_key( cb ) {
    
    var encryption_passphrase = localStorage.getItem( 'encryption_passphrase' );

    if ( encryption_passphrase )
        return cb( encryption_passphrase );
    
    $( '#input-modal .modal-title' ).text( "Specify Encryption Passphrase" );
    $( '#input-modal input' ).val( "" );
    $( '#input-modal input' ).attr( "placeholder", "Encryption Passphrase" );
    $( '#input-modal input' ).attr( "type", "password" );
    $( '#input-modal' ).modal( 'show' );
    $( '#input-modal button' ).one( 'click', function() {
        encryption_passphrase = $( '#input-modal input' ).val();
        localStorage.setItem( 'encryption_passphrase', encryption_passphrase );
        $( '#input-modal' ).one( 'hidden.bs.modal', function() {
            return cb( encryption_passphrase );
        })
        $( '#input-modal' ).modal( 'hide' );
    } );
}
	

	
$( function() {
    
    $( '.bg-image' ).css( 'background-image', 'url("img/' + parseInt( Math.floor( Math.random() * 12 ) ) + '.jpg")' );
    $( '.bg-image' ).fadeIn( 1000 );
    
    $( '#input-modal' ).on( 'shown.bs.modal', function() {
        $( '#input-modal input' ).focus();
    } );
 
    get_username( function( username ) {
        get_password( function( password ) {
            get_repo( function( repo ) {
                get_key( function( key ) {
                    gh_storage = githubEncryptedStorage( {
                        github_username: username,
                        github_password: password,
                        github_repo: repo,
                        
                        encryption_passphrase: key,
                    } );
                    
                    get_categories();
                } );
            } );
        } );
    } );
    
    $( '#clear-credentials a' ).click( function() {
        localStorage.removeItem( 'github_username' );
        localStorage.removeItem( 'github_password' );
        localStorage.removeItem( 'github_repo' );
        localStorage.removeItem( 'encryption_passphrase' );
        location.reload();
    })
 
    $( '.datepicker' ).datepicker();
	$( '#input-bool-current-value' ).bootstrapSwitch( {
		onText: 'Completed',
		onColor: 'success',
		
		offText: 'In Progress',
		offColor: 'primary',
	} );
	
	$( "#btn-create-cat" ).click( function() {
	
		var updating_id = $( '#updating-cat-id' ).val();
		
		$.when( gh_storage.saveObject( {
			name: $( '#input-cat-name' ).val(),
			ordinal: $( '#input-cat-ordinal' ).val(),
		},  ['category'], updating_id === '' ? undefined : updating_id ) ).then( function() {
			$( '#modal-create-cat' ).modal( 'hide' );
			
			location.reload();
		} );
	
	} );
	
	$( "#btn-create-goal" ).click( function() {
	
		var updating_id = $( '#updating-goal-id' ).val();
		
		$.when( gh_storage.saveObject( {
			name: $( '#input-goal-name' ).val(),
			deadline: $( '#input-goal-deadline' ).val(),
			category: $( '#input-goal-category' ).val(),
			type: $( '#input-goal-type' ).val(),
			parent: $( '#input-goal-parent' ).val(),
			ordinal: $( '#input-goal-ordinal' ).val(),
			
		},  ['goal'], updating_id === '' ? undefined : updating_id ) ).then( function() {
			$( '#modal-create-goal' ).modal( 'hide' );
			
			location.reload();
		} );
	
	} );

    $( "#btn-update-bool-values" ).click( function() {

        var updating_id = $( '#updating-bool-goal-id' ).val();
		var goal = goal_dict[ updating_id ];

        $.when( gh_storage.saveObject( {
			name: goal.json.name,
			deadline: goal.json.deadline,
			category: goal.json.category,
			type: goal.json.type,
			parent: goal.json.parent,
			ordinal: goal.json.ordinal,
			
            current_value: $( '#input-bool-current-value' ).val(),
        }, ['goal'], updating_id === '' ? undefined : updating_id ) ).then( function() {
            $( '#modal-update-bool-values' ).modal( 'hide' );

            location.reload();
        } );
    } );
	
    $( "#btn-update-cumul-values" ).click( function() {

        var updating_id = $( '#updating-cumul-goal-id' ).val();
		var goal = goal_dict[ updating_id ];

        $.when( gh_storage.saveObject( {
            name: goal.json.name,
			deadline: goal.json.deadline,
			category: goal.json.category,
			type: goal.json.type,
			parent: goal.json.parent,
			
            current_value: $( '#input-cumul-current-value' ).val(),
            max_value: $( '#input-cumul-max-value' ).val(),
        }, ['goal'], updating_id === '' ? undefined : updating_id ) ).then( function() {
            $( '#modal-update-cumul-values' ).modal( 'hide' );

            location.reload();
        } );
    } );
	
    $( "#btn-update-perc-values" ).click( function() {

        var updating_id = $( '#updating-perc-goal-id' ).val();
		var goal = goal_dict[ updating_id ];

        $.when( gh_storage.saveObject( {
            name: goal.json.name,
			deadline: goal.json.deadline,
			category: goal.json.category,
			type: goal.json.type,
			parent: goal.json.parent,
			
            current_value: $( '#input-perc-current-value' ).val(),
        }, ['goal'], updating_id === '' ? undefined : updating_id ) ).then( function() {
            $( '#modal-update-perc-values' ).modal( 'hide' );

            location.reload();
        } );
    } );
	
	function get_categories() {
        
        $.when( gh_storage.objects( ['category'] ) ).then( function( objects ) {

            objects = objects.sort( sort_ordinal );

            var $goals = $( '#goals' );
            var $cat_template = $( '#panel-category-template' );
            var $goal_group_template = $( '#panel-goal-group-template' );
            var $goal_template = $( '#item-goal-template' );
            var $subgoal_group_template = $( '#submenu-goal-group-template' );
            var $subsubgoal_group_template = $( '#subsubmenu-goal-group-template' );

            for ( var c_i = 0; c_i < objects.length; c_i++ ) {

                var cat = objects[c_i];
                cat_dict[ cat.id ] = cat;

                $cat = $cat_template.clone();
                $cat.hide();
                $cat.removeClass( 'template' );
                $cat.find( 'a.cat-name	' ).text( cat.json.name );
                $cat.attr( 'id', 'panel-category-' + cat.id );
                $cat.data( 'category-id', cat.id )

                $goals.append( $cat );
                $cat.fadeIn( 500 );

                $( '#input-goal-category').append( '<option value="' + cat.id + '">' + cat.json.name + '</option>' );

            }

            $.when( gh_storage.objects( ['goal'] ) ).then( function( goals ) {

                var goals_remaining = goals.slice( 0 );
                var categories = {};
                var i = 0;
                while ( goals_remaining.length > 0 ) {

                    i++;
                    if ( i > 1000 )
                        break;

                    var goal = goals_remaining.pop();

                    if ( goal.json.parent !== '' && typeof( goal_dict[ goal.json.parent ] ) === 'undefined' ) {

                        goals_remaining.push( goal );
                        continue;

                    }

                    goal_dict[ goal.id ] = goal;

                    if ( goal.json.type == 'group' )
                        $( '#input-goal-parent' ).append( '<option value="' + goal.id + '">' + goal.json.name + '</option>' );

                    if ( typeof( categories[ goal.json.category ] ) === 'undefined' )
                        categories[ goal.json.category ] = [];

                    if ( goal.json.parent === '' )
                        categories[ goal.json.category ].push( goal );
                    else
                        goal_dict[ goal.json.parent ].children.push( goal );

                    goal.children = [];

                }

                for ( g_i in goal_dict ) {

                    var goal = goal_dict[ g_i ];

                    if ( goal.json.type == 'group' )
                        goal.completed = function() {
                            return this.children.every( function( g_c ) {
                                return g_c.completed();
                            } );
                        };

                    else if ( goal.json.type == 'boolean' )
                        goal.completed = function() { 
                            return this.json.current_value === 'on'; 
                        };

                    else if ( goal.json.type == 'cumulative' )
                        goal.completed = function() { 
                            return this.json.current_value === this.json.max_value; 
                        };

                    else if ( goal.json.type == 'percentage' )
                        goal.completed = function() { 
                            return this.json.current_value === '100'; 
                        };

                }

                for ( g_i in goal_dict )
                    goal_dict[ g_i ].children = goal_dict[ g_i ].children.sort( sort_ordinal );

                var add_goal = function( goal, $parent_el ) {

                    var $goal = $goal_template.clone();
                        $goal.removeClass( 'template' );
                        $goal.attr( 'id', 'item-goal-' + goal.id );
                        $goal.data( 'goal-id', goal.id );
                        $goal.prepend( '<span class="pull-left goal-name">' + goal.json.name + '</span>' );

                        if ( goal.json.type == 'group' )
                            $goal.append( '<span class="pull-right">' + goal.children.filter( function( g ) {
                                return g.completed();
                            } ).length + '/' + goal.children.length + '</span>' );

                        else if ( goal.json.type == 'cumulative' )
                            $goal.append( '<a class="pull-right goal-status" onclick="update_cumul_values( $( this ).parent().data( \'goal-id\' ) );">' + ( goal.json.current_value ? goal.json.current_value : 0 ) + '/' + ( goal.json.max_value ? goal.json.max_value : 0 ) + '</a>' + 
                                    '<div class="progress-wrapper pull-right"><span class="progress"><span class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style="width: ' + ( 100 * goal.json.current_value / goal.json.max_value ) + '%"></span></span></div>' );

                        else if ( goal.json.type == 'percentage' )
                            $goal.append( '<a class="pull-right goal-status" onclick="update_perc_values( $( this ).parent().data( \'goal-id\' ) );">' + ( goal.json.current_value ? goal.json.current_value : 0 ) + '%</a>' +
                                    '<div class="progress-wrapper pull-right"><span class="progress"><span class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style="width: ' + goal.json.current_value + '%"></span></span></div>' );

                        else if ( goal.json.type == 'boolean' )
                            $goal.append( '<a class="pull-right goal-status" onclick="update_bool_values( $( this ).parent().data( \'goal-id\' ) );">' + ( goal.completed() ? 'Completed!' : 'In Progress' ) + '</a>' );

                        if ( goal.completed() )
                            $goal.addClass( 'success' );

                        if ( goal.json.deadline !== '' ) {
                            if ( $goal.find( '.progress-wrapper' ).length <= 0 )
                                $goal.append( '<div class="progress-wrapper pull-right"></div>' );

                            var deadline = Date.parse( goal.json.deadline );
                            var now = Date.now(); 
                            $goal.find( '.progress-wrapper' ).append( '<span class="progress"><span class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" style="width: 50%"></span>50 days remaining</span></div>' );

                            if ( $goal.find( '.progress-wrapper .progress' ).length > 1 )
                                $goal.find( '.progress-wrapper' ).addClass( 'double' );

                        }

                        $parent_el.append( $goal );

                };

                for ( var cat in categories ) {

                    var goals = categories[cat];

                    var $cat_panel = $( '#panel-category-' + cat );

                    var $goal_group = $goal_group_template.clone();
                    $goal_group.removeClass( 'template' );
                    $goal_group.attr( 'id', 'panel-group-' + cat );
                    $cat_panel.append( $goal_group );

                    for ( var g_i = 0; g_i < goals.length; g_i++ ) {

                        var goal = goals[g_i];

                        add_goal( goal, $goal_group.find( '.list-group' ) );

                        if ( goal.children.length > 0 ) {

                            var $subgoal_group = $subgoal_group_template.clone();
                            $subgoal_group.removeClass( 'template' );
                            $subgoal_group.attr( 'id', 'submenu-goal-group-' + goal.id );

                            $goal_group.find( '.list-group' ).append( $subgoal_group );

                            for ( var g_c_i = 0; g_c_i < goal.children.length; g_c_i++ ) {

                                var subgoal = goal.children[g_c_i];

                                add_goal( subgoal, $subgoal_group );

                                if ( subgoal.children.length > 0 ) {

                                    var $subsubgoal_group = $subsubgoal_group_template.clone();
                                    $subsubgoal_group.removeClass( 'template' );
                                    $subsubgoal_group.attr( 'id', 'subsubmenu-goal-group-' + subgoal.id );

                                    $subgoal_group.append( $subsubgoal_group );

                                    for ( var g_c_c_i = 0; g_c_c_i < subgoal.children.length; g_c_c_i++ ) {

                                        var subsubgoal = subgoal.children[g_c_c_i];

                                        add_goal( subsubgoal, $subsubgoal_group );

                                    }

                                }

                            }

                        }

                    }

                }

            } );

        }, function() {
            
            $( '#create-buttons' ).fadeOut( 500, function() {
                
                $( '#credentials-error' ).fadeIn( 1000 );
                
            } );
            
        } );
        
    }
	
} );
