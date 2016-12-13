(function() {
  
  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);

    function homeCtrl () {
      console.log('Home controller is running '+ process.env.MY_SECRET);
    }

})();