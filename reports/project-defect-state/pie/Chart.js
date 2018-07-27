Ext.define('PieChart', {
    xtype: 'piechart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'PieCalculator'
    ],

    testfield: 'testField',

    config: {
        chartConfig: {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                events: {
                    load: function(event) {
                        var total = this.series[0].data[0].total;
                        this.setTitle(null, {text: '<h2>Total: ' + total + '</h2>'});
                    }
                }
            },
            subtitle: {
                useHTML: true,
                y: 50
            },
            tooltip: { // what shows up on mouseover
                headerFormat: '',
                pointFormat: '<b>{point.name}:</b> {point.percentage:.1f}% ({point.y}/{point.total})'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}:</b> {point.y}',
                        style: {
                            color: 'black'
                        },
                        useHTML: true
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '65%']
                },
            }
        },
        calculatorType: 'PieCalculator',
    },

    constructor: function(config) {
        config = config || {};
        this.mergeConfig(config);

        // initilizes Calculator.js
        this.callParent([this.config]);

        console.log('chart.js', this);
    }
});
