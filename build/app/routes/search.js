var search = require('../controllers/search');
var cors = require('cors');

module.exports = {
  configure: function (app) {

    app.route('/search').post(search.searchAction);
    app.route('/lunr').get(search.lunrAction);
  }
};
//# sourceMappingURL=search.js.map
