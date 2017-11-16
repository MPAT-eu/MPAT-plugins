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
 **/
namespace MPAT\Settings;

class FormHelper {

 	static function input_button_select_field_render( $args = array() ) {

		$default = array(
				"option_name" => "",
				"field_name" => "",
				"available_values" => array()
		);
		$args = array_merge($default, $args);
		$options = get_option( $args['option_name'] );
		$option_field_name = $options[$args["field_name"]];
		$value = isset($option_field_name) ? $option_field_name : "";
		//echo $options;
		?>
			<?php foreach ($args['available_values'] as $key => $label) : ?>
			<label><?php echo $key ?></label>
				<input
					class="button blue_white"
					type="radio"
					<?php echo checked( $value, 1 ); ?>
					name='<?php echo $args['option_name'] ?>[<?php echo $args['field_name'] ?>]'
					value="<?php echo $key ?>"
				/>
	        <?php endforeach; ?>
		<?php
	}   
	
	static function button_select_field_render( $args = array() ) {

		$default = array(
				"option_name" => "",
				"field_name" => "",
				"available_values" => array()
		);
		$args = array_merge($default, $args);
		$options = get_option( $args['option_name'] );
		$currentValue = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		//echo $options;
		?>
			<?php foreach ($args['available_values'] as $key => $label) : ?>
				<button
					class="button blue_white"
					type="submit"
					name='<?php echo $args['option_name'] ?>[<?php echo $args['field_name'] ?>]'
					value="<?php echo $key ?>"
					formmethod="post"
					formaction="../options.php?field_name='<?php echo $args["field_name"] ?>"
				>
					<?php echo $label ?>
				</button>
	        <?php endforeach; ?>
		<?php
	}   
	
	static function button_field_render ( $args ) {
		$default = array(
				"option_name" => "",
				"field_name" => "",
				"default_value" => ""
		);
		$args = array_merge($default, $args);
		$options = get_option( $args["option_name"] );		
		$value = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		?>
		<button
			class="button blue_white"
			type="button"
			name='<?php echo $args["option_name"] ?>[<?php echo $args["field_name"] ?>]'
			value='<?php echo $value; ?>'
			placeholder='<?php echo $args["default_value"]?>'
		>
			<?php echo $args["title"]; ?>
		</button>
		<?php
	}
		
	static function text_field_render ( $args ) {
		$default = array(
				"option_name" => "",
				"field_name" => "",
				"default_value" => ""
		);
		$args = array_merge($default, $args);
		$options = get_option( $args["option_name"] );		
		$value = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		?>
		<input type='text' name='<?php echo $args["option_name"] ?>[<?php echo $args["field_name"] ?>]' value='<?php echo $value; ?>' placeholder='<?php echo $args["default_value"]?>'>
		<?php
	}
		
	static function checkbox_field_render ( $args ) { 
		$default = array(
				"option_name" => "",
				"field_name" => "",
				"default_value" => ""
		);
		$args = array_merge($default, $args);
		$options = get_option( $args["option_name"] );		
		$value = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		?>
		<input type='checkbox' name='<?php echo $args["option_name"] ?>[<?php echo $args["field_name"] ?>]' <?php checked( $value, 1 ); ?> value='1'>
		<?php
	
	}
		
	static function radio_field_render( $args ) { 

		$args = array_merge($default, $args);
		$options = get_option( $args["option_name"] );
		$value = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		?>
		<input type='radio' name='<?php echo $args["option_name"] ?>[<?php echo $args["field_name"] ?>]' <?php checked( $value, 1 ); ?> value='1'>
		<?php
	
	}
	
	static function select_field_render( $args = array() ) {

		$default = array(
				"option_name" => "",
				"field_name" => "",
				"available_values" => array()
		);
		$args = array_merge($default, $args);
		$options = get_option( $args['option_name'] );
		$currentValue = isset($options[$args["field_name"]]) ? $options[$args["field_name"]] : "";
		?>
			<select name='<?php echo $args['option_name'] ?>[<?php echo $args['field_name'] ?>]'>
	        <?php foreach ($args['available_values'] as $key => $label) : ?>
				<option value='<?php echo $key ?>' <?php selected( $key, $currentValue, 1 ); ?>><?php echo $label ?></option>
	        <?php endforeach; ?>
			</select>
		<?php
	
	}
}
