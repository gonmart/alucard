Ext.define('CustomChartApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: 'fit',

    config: {
        // Edit these fields for easy config
        defaultSettings: {
            types: 'Defect',
            chartType: 'columnchart',
            aggregationField: 'State',
            aggregationType: 'count',
            bucketBy: 'Date',
            stackField: 'State',
            // This value is passed to data store filter, not storeconfig
            context: {
                project: "208449406576" // account management
            },

            title: "Account Management"
        },
    },

    launch: function() {
        console.log("Im Launching!");
        Rally.data.wsapi.ModelFactory.getModels({
            types: 'Defect'
        }).then({
            success: this._onModelsLoaded,
            scope: this
        });
    },

    // Assert type model for this app
    _onModelsLoaded: function(models) {
        console.log("Got models!");
        this.Models = _.values(models);
        console.log("Models...", this.Models);
        let stackingSetting = this._getStackingSetting();
        let stackingField = stackingSetting && this.Models.getField('State');

        if (this._shouldLoadAllowedStackValues(stackingField)) {
            stackingField.getAllowedValueStore().load().then({
                success: function(records) {
                    this.stackValues = _.invoke(records, 'get', 'StringValue');
                    this._addChart();
                },
                scope: this
            });
        } else {
            this._addChart();
        }
        console.log("ADDED CHART!");
    },

    _shouldLoadAllowedStackValues: function(stackingField) {
        var hasAllowedValues = stackingField && stackingField.hasAllowedValues(),
            shouldLoadAllowedValues = hasAllowedValues && (
                _.contains(['state', 'rating', 'string'], stackingField.getType()) ||
                stackingField.getAllowedValueType() === 'state' ||
                stackingField.getAllowedValueType() === 'flowstate'
            );
        return shouldLoadAllowedValues;
    },

    _getStackingSetting: function() {
        var chartType = this.getSetting('chartType');
        console.log("Chart Type: ", chartType);
        console.log("this: ", this);
        return chartType !== 'piechart' ? this.getSetting('stackField') : null;
    },
    // Add chart to this app
    _addChart: function() {
        console.log("Trying to load chart!");
        let context = this.getContext(),
            modelNames = _.pluck(this.models, 'typePath'),
            gridBoardConfig = {
                xtype: 'rallygridboard',
                toggleState: 'chart',
                chartConfig: this._getChartConfig(),
                context: context,
                modelNames: modelNames,
            };

        // initializes Chart.js
        this.add(gridBoardConfig);
    },

    _getChartConfig: function() {
        console.log("Trying to get chartConfigs!");

        let chartType = this.getSetting('chartType'),
            config = {
                xtype: chartType,
                chartColors: [
                    "#FF8200", // $orange
                    "#F6A900", // $gold
                    "#FAD200", // $yellow
                    "#8DC63F", // $lime
                    "#1E7C00", // $green_dk
                    "#337EC6", // $blue_link
                    "#005EB8", // $blue
                    "#7832A5", // $purple,
                    "#DA1884",  // $pink,
                    "#C0C0C0" // $grey4
                ],
                storeConfig: {
                    context: {
                        project: '/project/' + this.config.defaultSettings.context.project
                    },
                    limit: Infinity,
                    fetch: this._getChartFetch(),
                    sorters: this._getChartSort(),
                    pageSize: 2000,
                },
                calculatorConfig: {
                    calculationType: this.getSetting('aggregationType'),
                    field: this.getSetting('aggregationField'),
                    bucketBy: chartType === 'piechart' ? null : this.getSetting('bucketBy')
                },
                chartConfig: {
                    title: {
                        text: '<h2>' + this.config.defaultSettings.title + '<h2>',
                        useHTML: true
                    },
                }
            };

        // This app only works with Defect model type
        config.storeConfig.models = 'Defect';
        config.storeType = 'Rally.data.wsapi.artifact.Store';

        console.log("I got the config I think!...", config);
        return config;
    },

    // Returns an array for organizing data with FormattedID, Name, and custom field
    _getChartFetch: function() {
        console.log("Trying to getChartFetch!");

        return ['FormattedID', 'Name', this.getSetting('aggregationField')];
    },

    // Defined to sort chart fields in ascending order for consistency
    _getChartSort: function() {
        console.log("Trying to getchartSort!");

        let model = this.models[0],
            field = model.getField(this.getSetting('aggregationField')),
            sorters = [];

        if (field && field.getType() !== 'collection' && field.sortable) {
            sorters.push({
                property: this.getSetting('aggregationField'),
                direction: 'ASC'
            });
        }
        return sorters;
    },
});