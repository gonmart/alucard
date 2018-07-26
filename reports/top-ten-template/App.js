/***************************************************************************************************************
 * Instructions:                                                                                                *
 *   -Snapshot Store: One store with constructor that takes three objects: filter, context, and sort            *
 *       Call store method will call calculator method passing itself.                                          *
 *   -Calculator: This will do the data manip and limit results to ten(I think)                                 *
 *       Calculator method will call the chart method to make and add a highchart to display data.              *
 *   -Chart:  Will take calculator and config.chartType to make the chart. There will be different chart        *
 *       method for each chart.                                                                                 *
 *                                                                                                              *
 *   Directions: Customize the appConfig with the appropriate input                                             *
 *                                                                                                              *
 *   appConfig: {                                                                                               *
 *       hasGrid: Boolean                                                                                       *
 *       model: String                                                                                          *
 *       columns: String array of grid properties(leave null if only getting chart)                             *
 *       filters: Give this an array of three strings. Or multiple arrays for complex filters.                  *
 *       context: Enter Project.project from the project object to pass the scope.                              *
 *       chartType: Enter String to specify the chart type (this will call the appropriate constructor          *
 *       sorters: Array of array of strings to specify the property/direction of sorting, exp [['ID','ASC']]    *
 *   },                                                                                                         *
 *                                                                                                              *
 *                                                                                                              *
 *   Filter Operators:                                                                                          *
 *                                                                                                              *
 *       =        |  equals                                                                                     *
 *       !=       |  does not equal                                                                             *
 *       >        |  greater than                                                                               *
 *       <        |  less than                                                                                  *
 *       >=       |  greater than or equal                                                                      *
 *       <=       |  less than or equal                                                                         *
 *       contains |  contains                                                                                   *
 *       in       |  shorthand for or                                                                           *
 *       exists   |  has a field                                                                                *
 *                                                                                                              *
 *       Note: operators are not case sensitive                                                                 *
 *       Declared Arrays NEED TO BE WRAPPED IN ARRAYS!!!  example: [['data1', ['data2']] (Except Fetch)         *
 *                                                                                                              *
 * *************************************************************************************************************/
Ext.define('CustomApp', {
    extend: 'Rally.app.App', componentCls: 'app',

    appConfig: {
        hasGrid: null,
        model: null,
        columns: null,
        filters: null, //Give this an array of three strings. Or multiple arrays for complex filters.
        context: {
            project: '/project' + '20844942636',
            projectScopeDown: true,
            projectScopeUp: false
        },
        chartType: null,
        sorters: null
    },

    appConfigDebug: {
        hasGrid: true,
        model: 'Defect',
        columns: ['Name', 'ScheduleState'],
        filters: [['State', '<=', 'Resolved']],
        context: {
            project: '/project/208449426736',
            projectScopeDown: true,
            projectScopeUp: false
        },
        chartType: 'Pie',
        sorters: [['ObjectID', 'ASC']]
    },

    launch: function () {
        let me = this;
        me._createStore(me.appConfigDebug)
    },

    _createStore: function (configs) {
        let me = this;
        let myStore = me.globalStore = Ext.create('Rally.data.wsapi.Store', {
            model: configs.model,
            context: configs.context,
            pageSize: 10,
            limit: 10,
            sorters: me._setSorters(configs),
            filters: me._setFilters(configs),
            fetch: configs.columns,
            listeners: {
                load: function (store, data, success) {
                    me.add(myStore);
                    console.log('Store Loaded!...', myStore);
                    if(configs.hasGrid) {
                        me._setGrid(configs, myStore);
                    }
                    else me._setChart(configs);
                },
            }
        });
        myStore.load();
    },

    _setFilters: function (configs) {
        let me = this;
        let filters = [];

        configs.filters.forEach(function (array) {
                filters.push(Ext.create('Rally.data.wsapi.Filter', {
                    property: array[0],
                    operator: array[1],
                    value: array[2]
                }));
            }
        );
        console.log('Filters:...', filters);

        return filters;
    },

    _setSorters: function (configs) {
        let me = this;
        let sorters = [];

        configs.sorters.forEach(function (array) {
                sorters.push({
                    property: array[0],
                    direction: array[1]
                });
            }
        );
        console.log('Sorters:...', sorters);
        return sorters;
    },

    _setGrid: function (configs, store) {
        let me = this;
        let myGrid = Ext.create('Ext.Container', {
            items: [{
                xtype: 'rallygrid',
                columnCfgs: configs.columns,
                store: store,
                limit: 10,
                showPagingToolbar: false,
            }],
            renderTo: Ext.getBody(),
        });
        me.add(myGrid);
        me._setChart(configs, store);
    },

    _setChart: function(configs, store) {
        let me = this;

        let myChart = me._constructChart(configs, store);

        console.log(myChart);
    },

    _constructChart: function (configs,store) {
        return 'How cool!';
    }
});