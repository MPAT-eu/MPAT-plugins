# Dynamic components in mpat
Creation of components in mpat is now managed dynamically, the scope is create a component and make it automatically discoverable by mpat.

## What’s new in mpat
A ComponentLoader.js has been created and placed in react_src folder with methods that allow to insert, delete and make changes on components, this class is used both in the frontend and in the backend for internal and external components. It provides the following methods:

* `registerComponent(type, classes)`
* `getComponents()` returns `components`
* `getComponentByType(type)` returns `component`
* `unregisterComponent(type)`                         
* `overrideComponent(type, new_classes)`                      
* `renderComponent(type, element, params)` returns React.createElement    

Where parameters are:

* **Type** (string) – the component name such as Menu or Gallery.
* **Classes** (object) – component definition, all standard react solutions (namely functions, React.createClass() factory and ES6 classes) are supported, while ES6 classes are recommended for readability and uniformity. Three properties are managed: `edit`, `view` and `preview`. Each of them contains the definition for the respective representation of the MPAT component.
* **New_classes** (object) – same structure as Classes param but used to override existing components.
* **Element** (string) – specify the representation of the component. Managed values are `edit`, `view` or `preview`.
* **Params** (object) – it contains the properties of a component, such as id, context and component.
* **Components** (object) – array of objects describing the registered components.
* **Component** (object) – object which describes a given component.

## Usage examples

**registerComponent** function is used by all the core components to register themselves in MPAT core. Typical usage is: 
```javascript    
    componentLoader.registerComponent('text', {
        edit: editView,
        preview
    }); 
```
**getComponents** function is used by the ComponentEditor core component in the ContentEditView method, to get all registered components and populate the component selection field.

    componentLoader.getComponents();

**renderComponent** function is used, among others, in the backend to load `preview` and `edit` representation of MPAT components in the admin UI. `getContentTypeView` and `getContentTypePreview` functions call renderComponent as follow:
```javascript
    const render = componentLoader.renderComponent(type, 'preview', {id, data});
    return render;
```
**getComponentByType** function is used in the frontend to retrieve a component definition and render it in the page. Another usage could be be when third party components share (parts of) representations from core components and thus prefer to include core components rather than reinventing the wheel. i.e.: specific component define two galleries, resulting in a custom component which include to core galleries.

**overrideComponent** function can be used when the clients requirements involve high customization of existing components. i.e.: brand galleries include both carousel and thumbnails. Data structure and edit view are the same as gallery component from MPAT core, but `preview` and `view` representations are overriden to reflect brand values.

## Export of core libraries
In order to allow third parties to interact with MPAT core and register custom components, the functions described above are exported in both backend (Admin.jsx) and frontend (Core.jsx) the following way:
```javascript
    module.exports = {
        React,
        ReactDOM,
        componentAPI: componentLoader,
        KeyBindingAPI : {
            registerHandlers, 
            unregisterHandlers
        }
    }
```
How to use the exported modules to register new components is subject of the next chapters.

##Register a core component

This guide starts from the assumption that the developer is already used to React components definition. 
After having defined the component file, it has to be included in the dedicated entry together with other core components and functions in `webpack.config.js` file.
```javascript    
    mpat_core: ["./frontend/components/MenuContent.jsx",    
                "./frontend/core.jsx",
                ],
    mpat_admin: ["./backend/components/contenttypes/Menu.jsx",
                 "./backend/admin.jsx"
                ]
```    
Due to webpack limitations, core.jsx and admin.jsx have to be the last elements in arrays, otherwise the their modules would not be exported correctly.

Moving to the component definition, since the component is part of the core, `ComponentLoader` can be included in the ES6 way as follow:

    import {componentLoader} from "../../../ComponentLoader";

Component can be registered as follow (next example refers to backend but the same applies to frontend):
```javascript
    componentLoader.registerComponent("menu",
        edit: MenuEdit,
        preview: MenuPreview, {
        }, {
            isHotSpottable: true,
            isScrollable: false,
            isNavigable: true,
            isStylable: true
        }    
    });
```
MenuEdit and MenuPreview can be the classes or functions that define the component and must be declared without export.
 

##Register a component in external plugins

Since wp external plugins do not share the same context of MPAT core webpack config, they need to import componentLoader from the global variables `mpat_admin.componentAPI` and `mpat_core.componentAPI` exported by MPAT core, as follow:
```javascript
    externals: {
        'react-backend': "mpat_admin.React",
        'react-frontend' : "mpat_core.React",
        'component-loader-backend' : "mpat_admin.componentAPI",
        'component-loader-frontend' : 'mpat_core.componentAPI',
        'keyBinding' : 'mpat_core.KeyBindingAPI', 
    }
```
If in `mpat_admin` and in `mpat_core` other classes, such as React and keyBinding, have been exported, they can be also imported here as well.
Then, it is possible to import the instance of ComponentLoader using webpack externals, without curly brackets:
```javascript
    import React from "react-backend";
    import componentLoader from "component-loader-backend";
```
Plugin must follow the rules previously described for internal components, so define Edit, View and Preview classes and register them with registerComponent function.

Be aware that JS files from third party wordpress plugins have to be loaded after mpat_core files.
Standard wordpress rules for script priority apply.