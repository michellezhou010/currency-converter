angular.module('app', [])

    .directive('currencyConverter', function(){
        var directive = {
            controller: CurrencyConverterController,
            controllerAs: 'cc',
            restrict: 'EA',
            templateUrl: ''
        };

        return directive;
    });

    function CurrencyConverterController($http, $scope) {

    var self = this;
    this.errorMessage = '';

    this.currencies = [ 'CAD', 'EUR', 'USD' ];
    this.baseAmount = 0;
    this.baseCurrency = 'CAD';
    this.convertedAmount = 0;
    this.convertedCurrency = 'USD';
    this.conversionRate = 0;
    this.conversionRates = {};

    this.error = function(message) {
        this.errorMessage = message;
    };

    this.getConversionRate = function(){
        $http.get('http://api.fixer.io/latest', {
            params: { base: this.baseCurrency }
        }).then( function(res) {
            self.conversionRates = res.data.rates;
            self.convertAmount();
        }).catch( function() {
            self.error('Could not reach Fixer.io API');
        });
    };

    this.convertAmount = function() {
        if (this.baseCurrency == this.convertedCurrency) {
            this.conversionRate = 1;
        } else {
            this.conversionRate = this.conversionRates[this.convertedCurrency];
        }

        var inputTest = this.baseAmount * this.conversionRate;

        if ( isNaN(inputTest) ) {
            this.convertedAmount = '';
            this.error('Please enter a numeric input');
        } else {
            this.error('');
            this.convertedAmount = inputTest.toFixed(2);
        }

    };

    this.getConversionRate();
    }
