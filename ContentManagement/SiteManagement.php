<?php
/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lacaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 **/
namespace MPAT\ContentManagement;

class SiteManagement {

    protected static $instance = NULL;

    public static function init() {
    	add_filter( 'manage_sites_action_links', 'MPAT\ContentManagement\SiteManagement::add_clone_link', null, 2 );
    	add_filter( 'manage_sites_action_links', 'MPAT\ContentManagement\SiteManagement::add_publish_link', null, 2 );
    	add_action('admin_action_clone_blog', 'MPAT\ContentManagement\SiteManagement::clone_blog');
    	add_action('admin_action_publish_blog', 'MPAT\ContentManagement\SiteManagement::publish_blog');
    }
    
    private static function get_main_blog_id() {
        if (function_exists('get_network')){ // WP 4.6+
            return get_network()->site_id;
        } else {
            global $current_site;
            global $wpdb;
            $query = $wpdb->prepare ( "SELECT `blog_id` FROM `$wpdb->blogs` WHERE `domain` = '%s' AND `path` = '%s' ORDER BY `blog_id` ASC LIMIT 1", $current_site->domain, $current_site->path );
            return $wpdb->get_var ( $query );      
        }    
    }
    
  
    public static function publish_blog() {

    	if (isset($_GET["blog_id"]) && !empty($_GET["blog_id"])){
    		$blog_id = $_GET["blog_id"];
    	}else{
    		wp_redirect(network_admin_url( "sites.php"));
    	}

    	
    	$published_blog_id = get_blog_option($blog_id, "mpat_published_id");
    	
    	switch_to_blog( $published_blog_id );
    	$published_blog_url = get_site_url($published_blog_id);
    	$published_blogname = basename($published_blog_url);
    	
    	$time = time();
    	/* *** replace urls of published blog *** */
    	self::replace_blog_urls($published_blog_id, $published_blogname."-old-".$time, $published_blog_url, $published_blog_url."-old-".$time);
    	update_blog_public( "1", "0" );
    	
    	
    	/* *** replace urls of cloned blog *** */
    	switch_to_blog( $blog_id );
    	$cloned_blog_url = get_site_url($blog_id);
    	self::replace_blog_urls($blog_id, $published_blogname, $cloned_blog_url, $published_blog_url);
    	
    	update_blog_public( "0", "1" );
    	
    	/* *** adjust mpat_published_id option *** */
    	add_blog_option($published_blog_id, 'mpat_published_id', $blog_id);
    	delete_blog_option($blog_id, 'mpat_published_id');
    	
    	
    	/* *** Restores main blog *** */
    	$main_blog_id = self::get_main_blog_id();
    	switch_to_blog( $main_blog_id );
    	wp_redirect(network_admin_url( "sites.php"));
    	
    }
    
    private function replace_blog_urls($blog_id, $new_blogname, $old_url, $new_url){
    	// Replace URLs and paths in the DB
    	$old_url = str_ireplace(array('http://', 'https://'), '://', $old_url);
    	$new_url = str_ireplace(array('http://', 'https://'), '://', $new_url);
    	
    	global $wpdb;
    	$prefix = $wpdb->base_prefix;
    	$prefix_escaped = str_replace('_','\_',$prefix);
    	
    	// List all tables for the default blog,
    	$tables_q = $wpdb->get_results("SHOW TABLES LIKE '" . $prefix_escaped . $blog_id . "\_%'");
    	foreach($tables_q as $table){
    		$in_array = get_object_vars($table);
    		$tables[] =  current($in_array);
    		unset($in_array);
    	}
    	
    	self::cloner_db_replacer( array($old_url), array($new_url), $tables);
    	
    	$path = get_current_site()->path.$new_blogname."/";
    	
    	//replace path in wordpress blogs table
    	$wpdb->query("UPDATE ".$prefix ."blogs SET path = '".$path . "' WHERE blog_id = ".$blog_id);
    }
    

     public static function clone_blog() {

     	if (isset($_GET["clone_from"]) && !empty($_GET["clone_from"])){
     		$old_blog_id = $_GET["clone_from"];
     	}else{
     		wp_redirect(network_admin_url( "sites.php"));
     	}
     	
     	$current_site = get_current_site(); 
     	$old_title = get_site_url( $old_blog_id);
     	$old_title = basename($old_title);
     	
     	//create new cloned blog
		$domain  = $current_site->domain;
		$new_title = $old_title."-clone-". time();
		$path = $current_site->path.$new_title;
		$user_id = get_current_user_id();
		$meta="";
		$site_id = $current_site->id;
		
     	$blog_id = wpmu_create_blog( $domain, $path, $new_title, $user_id, $meta, $site_id );
     	
     	//save data useful later
        $main_blog_id = self::get_main_blog_id();
        $id_default_blog = $old_blog_id;

        if (!$id_default_blog) { return false; }

        $old_url = get_site_url($id_default_blog);

        //switch to cloned blog and copy tables from parent
        switch_to_blog( $blog_id );

        $new_url = get_site_url();
        $new_name = get_bloginfo('title','raw');
        $admin_email = get_bloginfo('admin_email','raw');
        
        global $wpdb;
        $prefix = $wpdb->base_prefix;
        $prefix_escaped = str_replace('_','\_',$prefix);

        // List all tables for the default blog
        $tables_q = $wpdb->get_results("SHOW TABLES LIKE '" . $prefix_escaped . $id_default_blog . "\_%'");

        foreach($tables_q as $table){
            $in_array = get_object_vars($table);
            $old_table_name = current($in_array);
            $tables[] = str_replace($prefix . $id_default_blog . '_', '', $old_table_name);
            unset($in_array);
        }

        // Replace tables from the new blog with the ones from the default blog
        foreach($tables as $table){
            $new_table = $prefix . $blog_id . '_' . $table;

            $old_table = $prefix . $id_default_blog . '_' . $table;

            unset($queries);
            $queries = array();

            $queries[] = "DROP TABLE IF EXISTS " . $new_table ;
            $queries[] = "CREATE TABLE " . $new_table . " LIKE " . $old_table;
            $queries[] = "INSERT INTO " . $new_table . " SELECT * FROM " . $old_table;

            foreach($queries as $query){
                $wpdb->query($query);
            }

            $new_tables[] = $new_table;
        }

        $wp_uploads_dir = wp_upload_dir();
        $base_dir = $wp_uploads_dir['basedir'];
        
        //base_url used to create uploads urls.
        $base_url = $wp_uploads_dir['baseurl'];
        $relative_base_url = str_ireplace(get_home_path(), '', $base_url);

        // I need to get the previous folder before the id, just in case this is different to 'sites'
        $dirs_relative_base_dirs = explode('/',$relative_base_url);
        $sites_dir = $dirs_relative_base_dirs[count($dirs_relative_base_dirs)-2];
        
        
        $old_uploads = str_ireplace('/'.$sites_dir.'/'.$blog_id, '/'.$sites_dir.'/'.$id_default_blog, $relative_base_url);
        $new_uploads = $relative_base_url;

        $old_url = str_ireplace(array('http://', 'https://'), '://', $old_url);
        $new_url = str_ireplace(array('http://', 'https://'), '://', $new_url);
       
        self::cloner_db_replacer( array($old_url,$old_uploads), array($new_url,$new_uploads), $new_tables);

        // Update Title
        update_option('blogname',$new_name);

        // Update Email
        update_option('admin_email',$admin_email);

        // Copy Files
        $old_uploads = str_ireplace('/'.$sites_dir.'/'.$blog_id, '/'.$sites_dir.'/'.$id_default_blog, $base_dir);
        $new_uploads = $base_dir;
        
        self::cloner_recurse_copy($old_uploads, $new_uploads);

        // User Roles
        $user_roles_sql = "UPDATE $prefix" . $blog_id . "_options SET option_name = '$prefix" . $blog_id . "_user_roles' WHERE option_name = '$prefix" . $id_default_blog . "_user_roles';";
        $wpdb->query($user_roles_sql);

        // Copy users
        $users = get_users('blog_id='.$id_default_blog);
        
        
        foreach($users as $user){
            $all_meta = array_map( 'MPAT\ContentManagement\SiteManagement::user_array_map', get_user_meta( $user->ID ) );
            foreach ($all_meta as $metakey => $metavalue) {
                $prefix_len = strlen($prefix . $id_default_blog);

                $metakey_prefix = substr($metakey, 0, $prefix_len);
                if($metakey_prefix == $prefix . $id_default_blog) {
                    $raw_meta_name = substr($metakey,$prefix_len);
                    update_user_meta( $user->ID, $prefix . $blog_id . $raw_meta_name, maybe_unserialize($metavalue) );
                }
            }

        }
        
        add_option('mpat_published_id', $old_blog_id);

        // Restores main blog
        switch_to_blog( $main_blog_id );
        wp_redirect(network_admin_url( "sites.php"));
    }

    static function user_array_map( $a ){ return $a[0]; }

    static function add_clone_link( $actions, $blog_id ) {     
        $main_blog_id = self::get_main_blog_id();
        if($main_blog_id != $blog_id):
        	$actions['clone'] = '<a href="'. network_admin_url('sites.php').'?action=clone_blog&amp;clone_from='. $blog_id . '">Clone</a>';
        endif;
        return $actions;
    }
    
    static function add_publish_link( $actions, $blog_id ) {
    
    	$main_blog_id = self::get_main_blog_id();
    	switch_to_blog( $blog_id );
    	if(get_option("mpat_published_id")){
	    	if($main_blog_id != $blog_id):
	    		$actions['publish'] = '<a href="'. network_admin_url('sites.php').'?action=publish_blog&amp;blog_id='. $blog_id . '">Publish</a>';
	    	endif;
    	}
    	switch_to_blog( $main_blog_id );
    	return $actions;
    }


/* SEARCH AND REPLACE for WP DBs */
	private static function cloner_recursive_unserialize_replace( $from = '', $to = '', $data = '', $serialised = false ) {
	    // some unseriliased data cannot be re-serialised eg. SimpleXMLElements
	    try {
	
	        if ( is_string( $data ) && ( $unserialized = @unserialize( $data ) ) !== false ) {
	        	
	            $data = self::cloner_recursive_unserialize_replace( $from, $to, $unserialized, true );
	        }
	
	        elseif ( is_array( $data ) ) {
	            $_tmp = array( );
	            foreach ( $data as $key => $value ) {
	                $_tmp[ $key ] = self::cloner_recursive_unserialize_replace( $from, $to, $value, false );
	            }
	
	            $data = $_tmp;
	            unset( $_tmp );
	        }
	
	        elseif ( is_object( $data ) ) {
	            $_tmp = $data; 
	            $props = get_object_vars( $data );
	            foreach ( $props as $key => $value ) {
	                $_tmp->$key = self::cloner_recursive_unserialize_replace( $from, $to, $value, false );
	            }
	
	            $data = $_tmp;
	            unset( $_tmp );
	        }
	
	        else {
	            if ( is_string( $data ) )
	                $data = str_replace( $from, $to, $data );
	        }
	
	        if ( $serialised )
	            return serialize( $data );
	
	    } catch( Exception $error ) {
	
	    }
	
	    return $data;
	}
	
	
	private static function cloner_db_replacer( $search = '', $replace = '', $tables = array( ) ) {
	
	    global $wpdb;
	
	    $guid = 1;
	    $exclude_cols = array();
	
	    if ( is_array( $tables ) && ! empty( $tables ) ) {
	        foreach( $tables as $table ) {
	
	            $columns = array( );
	
	            // Get a list of columns in this table
	            $fields = $wpdb->query( 'DESCRIBE ' . $table );
	            if ( ! $fields ) {
	                continue;
	            }
	            
	            $columns_gr = $wpdb->get_results( 'DESCRIBE ' . $table );
	
	            foreach($columns_gr as $column){
	                $columns[ $column->Field ] = $column->Key == 'PRI' ? true : false;
	            }
	
	            // Count the number of rows we have in the table if large we'll split into blocks, This is a mod from Simon Wheatley
	            $row_count = $wpdb->get_var( 'SELECT COUNT(*) FROM ' . $table );          
	            if ( $row_count == 0 )
	                continue;
	
	            $page_size = 50000;
	            $pages = ceil( $row_count / $page_size );
	
	            for( $page = 0; $page < $pages; $page++ ) {
	
	                $current_row = 0;
	                $start = $page * $page_size;
	                $end = $start + $page_size;
	                // Grab the content of the table
	                $data = $wpdb->query( sprintf( 'SELECT * FROM %s LIMIT %d, %d', $table, $start, $end ) );
	
	                $rows_gr = $wpdb->get_results( sprintf( 'SELECT * FROM %s LIMIT %d, %d', $table, $start, $end ) );
	
	                foreach($rows_gr as $row) {
	
	                    $current_row++;
	
	                    $update_sql = array( );
	                    $where_sql = array( );
	                    $upd = false;
	
	                    foreach( $columns as $column => $primary_key ) {
	                        if ( $guid == 1 && in_array( $column, $exclude_cols ) )
	                            continue;
	
	                        $edited_data = $data_to_fix = $row->$column;
	
	                        // Run a search replace on the data that'll respect the serialisation.
	                        $edited_data = self::cloner_recursive_unserialize_replace( $search, $replace, $data_to_fix );
	
	                        if ( $edited_data != $data_to_fix) {
	                            $update_sql[] = $column . ' = "' . esc_sql( $edited_data ) . '"';
	                            $upd = true;
	                        }
	                        if ( $primary_key )
	                            $where_sql[] = $column . ' = "' . esc_sql( $data_to_fix ) . '"';
	                    }
	                    if ( $upd && ! empty( $where_sql )) {
	                        $sql = 'UPDATE ' . $table . ' SET ' . implode( ', ', $update_sql ) . ' WHERE ' . implode( ' AND ', array_filter( $where_sql ) );
	                        $result = $wpdb->query( $sql );   
	                    }
	                }
	            }
	        }
	    }
	}
	
	
	/* RECURSIVELY COPY a directory. */
	private static function cloner_recurse_copy($src, $dst) {
		
	    $dir = opendir($src); 
	    
	    if(!$dir || !is_dir($src)) {
	    	// when no media were uploaded on the original site, meaning that the upload folder
	    	// does not exist yet, we  ignore folder cloning
			return;
	    }
	
	    if (!file_exists($dst)) {
	        mkdir($dst);
	    }
	    while(false !== ( $file = readdir($dir)) ) {
	        if (( $file != '.' ) && ( $file != '..' )) {
	            if ( is_dir($src . '/' . $file) ) {
	                self::cloner_recurse_copy($src . '/' . $file,$dst . '/' . $file);
	            }
	            else {
	                copy($src . '/' . $file,$dst . '/' . $file);
	            }
	        }
	    } 
	
	    closedir($dir);
	}
}