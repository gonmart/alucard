Ext.define('CustomChartApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: 'fit',

    config: {
        // Edit these fields for easy config
        defaultSettings: {
            types: 'Defect',
            chartType: 'piechart',
            aggregationField: 'State',
            aggregationType: 'count', 
            context: {
                project: "/project/208449406576"
            }
        }
    },

    launch: function() {
        Rally.data.wsapi.ModelFactory.getModels({
            types: 'Defect'
        }).then({
            success: this._onModelsLoaded,
            scope: this
        });
    },

    // Assert type model for this app
    _onModelsLoaded: function(models) {
        this.models = _.values(models);    
        this._addChart();
    },

    // Add chart to this app
    _addChart: function() {
        var context = this.getContext(),
            modelNames = _.pluck(this.models, 'typePath'),
            gridBoardConfig = {
                xtype: 'rallygridboard',
                toggleState: 'chart',
                chartConfig: this._getChartConfig(),
                
                context: context,
                modelNames: modelNames,
                storeConfig: {
                    filters: this._getFilters()
                }
            };

        // initializes Chart.js
        this.add(gridBoardConfig);
    },

    _getChartConfig: function() {
        var chartType = this.getSetting('chartType'),
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
                    context: this.getContext().getDataContext(),
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
                // TODO: Fix this to work with defaultSettings
                chartConfig: {
                    title: {text: this.context.getProject().Name}
                }
            };

        // This app only works with Defect model type
        config.storeConfig.models = 'Defect';
        config.storeType = 'Rally.data.wsapi.artifact.Store';
        
        return config;
    },

    // construct filters using project from default settings
    _getFilters: function () {
        var projectFilter = Ext.create("Rally.data.wsapi.Filter", {
            property: "Project",
            operator: "=",
            value: this.config.defaultSettings.context.project
        });

        // filters for defects in child and child-child projects
        var scopeFilter = Ext.create("Rally.data.wsapi.Filter", {
            property: "Project.Parent",
            operator: "=",
            value: this.config.defaultSettings.context.project
        }).or(Ext.create("Rally.data.wsapi.Filter", {
            property: "Project.Parent.Parent",
            operator: "=",
            value: this.config.defaultSettings.context.project
            })
        );
        return projectFilter.or(scopeFilter);
    },

    // Returns an array for organizing data with FormattedID, Name, and custom field
    _getChartFetch: function() {
        return ['FormattedID', 'Name', this.getSetting('aggregationField')];
    },

    // Defined to sort chart fields in ascending order for consistency
    _getChartSort: function() {
        var model = this.models[0],
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
