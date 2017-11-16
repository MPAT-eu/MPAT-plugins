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
 * AUTHORS:
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\PostTypes;

interface AssetInterface {
	
	/**
	 * Given data from the remote asset, set asset properties
	 * @ return boolean true if data is set successfully, false otherwise
	 */
	public function setData( $remoteData );
	
	/**
	 * Return the post_type of the WP_Post type associated to the remote asset
	 * @return string post_type associated to the AssetInterface
	 */
	public function getPostType();
	
	/**
	 * Given a remote ID check if whether an associated WP_POST exists or not
	 */
	public function hasPost();
	
	/**
	 * Given a remote ID returns the associated post ID
	 * @return integer id of the associated post for the remote asset
	 */
	public function getPostID();
	
	/**
	 * Given a remote ID returns the associated WP_Post
	 * @return \WP_Post associated post for the remote asset
	 */
	public function getPost( );
	
	/**
	 * Store asset in wp database as a post. Custom post types also supported.
	 * @return integer post_id ID of the associated post, null if save operation failed
	 */
	public function savePost();
	
	/**
	 * Delete associated post from wp database.
	 * @return bool true if delete succeded, false otherwise
	 */
	public function deletePost();
}