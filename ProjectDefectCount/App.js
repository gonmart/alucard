Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    globalStore: undefined,
    shopStore: undefined,
    accountStore: undefined,
    pubStore: undefined,
    techOpsStore: undefined,
    global: -1,
    shop: -1,
    account: -1,
    pub: -1,
    tech: -1,
    all: undefined,
    countStore: undefined,
    pieChart: undefined,
    context: {projectScopeDown: true},
    totalDialog: undefined,

    launch: function () {
        let me = this;
        me._loadStores();
    },

    _loadStores: function () {
        let me = this;
        let myFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'State',
            operator: '<=',
            value: 'Resolved'
        });
        me.globalStore = Ext.create('Rally.data.wsapi.Store', {
            itemId: 'all-store',
            model: 'Defect',
            limit: 'Infinity',
            filters: myFilter,
            context: {
                project: '/project/' + '208449426736',
                projectScopeDown: true,
                projectScopeUp: false
            },
            fetch: ['Project'],
            listeners: {
                load: function () {
                    me.global = me.globalStore.count();
                    me.shopStore.load();
                    console.log('globalStore Loaded', me.globalStore.count());
                },
                scope: me
            },
        });
        me.shopStore = Ext.create('Rally.data.wsapi.Store', {
            itemId: 'all-store',
            model: 'Defect',
            limit: 'Infinity',
            filters: myFilter,
            context: {
                project: '/project/' + '208450167952',
                projectScopeDown: true,
                projectScopeUp: false
            },
            fetch: ['Project'],
            listeners: {
                load: function () {
                    me.shop = me.shopStore.count();
                    me.accountStore.load();
                    console.log('shopStore Loaded', me.shopStore.count());
                },
                scope: me
            },
        });
        me.accountStore = Ext.create('Rally.data.wsapi.Store', {
            itemId: 'all-store',
            model: 'Defect',
            limit: 'Infinity',
            filters: myFilter,
            context: {
                project: '/project/' + '208449406576',
                projectScopeDown: true,
                projectScopeUp: false
            },
            fetch: ['Project'],
            listeners: {
                load: function () {
                    me.account = me.accountStore.count();
                    me.pubStore.load();
                    console.log('accountStore Loaded', me.accountStore.count());
                },
                scope: me
            },
        });
        me.pubStore = Ext.create('Rally.data.wsapi.Store', {
            itemId: 'all-store',
            model: 'Defect',
            limit: 'Infinity',
            filters: myFilter,
            context: {
                project: '/project/' + '208449434348',
                projectScopeDown: true,
                projectScopeUp: false
            },
            fetch: ['Project'],
            listeners: {
                load: function () {
                    me.pub = me.pubStore.count();
                    me.techOpsStore.load();
                    console.log('pubStore Loaded', me.pubStore.count());
                },
                scope: me
            },
        });
        me.techOpsStore = Ext.create('Rally.data.wsapi.Store', {
            itemId: 'all-store',
            model: 'Defect',
            limit: 'Infinity',
            filters: myFilter,
            context: {
                project: '/project/' + '222502039964',
                projectScopeDown: true,
                projectScopeUp: false
            },
            fetch: ['Project'],
            listeners: {
                load: function () {
                    me.tech = me.techOpsStore.count();
                    console.log('techOpsStore Loaded', me.techOpsStore.count());
                    //me.countStore2.load();
                    me._getPie();
                },
                scope: me
            },
        });

        /*Ext.define('DefectsCounter', {
            extend: 'Ext.data.Model',
            fields: ['name', 'count']
        });
        me.countStore2 = Ext.create('Ext.data.Store', {
            model: 'DefectsCounter',
            data: [
                {
                    'name': 'Global', 'count': me.global
                },
                {
                    'name': 'Shop', 'count': me.shop
                },
                {
                    'name': 'AcctMngnt', 'count': me.account
                },
                {
                    'name': 'PUB', 'count': me.pub
                },
                {
                    'name': 'TechOps', 'count': me.techOps
                },
            ],
        });*/

        me.globalStore.load();
    },


//!**********************************************************************************\\
//!*     Creates a basic chart and loads the count of defects based on store        *\\
//!**********************************************************************************\\
    _getPie: function () {
        let me = this;

        me.pieChart = Ext.create('Rally.ui.chart.Chart', {
            chartConfig: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    events: {
                        load: function() {
                            let total = this.series[0].data[0].total;
                            this.setSubTitle(total);
                        }
                    }
                },
                title: {
                    text: 'Defects By Project (Not Closed)',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16',
                    },
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '12',
                                color: 'black'
                            },
                            format: '<b>{point.name}</b>: {point.y}'
                        },
                        colors: ['#f66db3', '#e62689', '#a10053', '#078A14', '#E8200D'],
                        //showInLegend: true
                    }
                },
                series: [{
                    name: 'Defects Count',
                    colorByPoint: true,
                    data: [
                        ['Global', me.global],
                        ['Shop', me.shop],
                        ['AcctMngnt', me.account],
                        ['PUB', me.pub],
                        ['TechOps', me.tech],
                    ]
                }]
            },
            chartData: {
                series: [{
                    name: 'Defects Count',
                    colorByPoint: true,
                    data: [
                        ['Global', me.global],
                        ['Shop', me.shop],
                        ['AcctMngnt', me.account],
                        ['PUB', me.pub],
                        ['TechOps', me.tech],
                    ]
                }]
            },
        });
        console.log(me.pieChart.chartData);
        me.add(me.pieChart);
        me.all =  me.global + me.pub + me.account + me.shop + me.tech;
        //me._createDialog();
    },

    /*_createDialog: function () {
        let me = this;
        let number = me.all;
        me.totalDialog = Ext.create('Rally.ui.dialog.Dialog', {
            autoShow: true,
            draggable: true,
            width: 150,
            height: 100,
            title: 'Total Defects',
            renderTo: Ext.getBody(),
            style: {
                borderColor:'#000000',
                borderStyle:'solid',
                borderWidth:'3px',
                backgroundColor: '(245, 245,220,.5)',
               // borderRadius: '100px',
                padding: '10px',
                paddingTop: '40px',
                fontSize: '8px',
                fontAlign: 'center',
                color: '#fce0ee',
                //marginLeft: '25%',
                //marginBottom: '1px'
            },
            items: [{
                xtype: 'text',
                text: number,
                degrees: 0,
                style: {
                    fontSize: '18px',
                }
            }],
        });
        me.add(me.totalDialog);
    }*/
});

let a = [
    '#fce0ee',
    '#f6b3d5',
    '#f66db3',
    '#eb4d9e',
    '#e62689',
    '#e20074',
    '#df006c',
    '#ba0060',
    '#d60057',
    '#a10053'
];
let b = [
    '#E3B721',
    '#E3B721',
    '#51D85E',
    '#078A14',
    '#E8200D',
    '#E8200D',
    '#E8200D',
    '#E8200D',
    '#E8200D',
    '#E8200D'
];

let c = [
    '#ffffff',
    '#f2f2f2',
    '#e8e8e8',
    '#cccccc',
    '#9b9b9b',
    '#6A6A6A',
    '#4c4c4c',
    '#333333',
    '#262626',
    '#000000'
];

