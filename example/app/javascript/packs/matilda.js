import 'matilda_core/theme.less'

// Support component names relative to this directory:
var matildaCoreRequireContext = require.context('../../../vendor/matilda_core', true);
var ReactRailsUJS = require('react_ujs');
ReactRailsUJS.useContext(matildaCoreRequireContext);
