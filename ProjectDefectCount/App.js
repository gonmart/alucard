Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    globalStore: undefined,
    shopStore: undefined,
    accountStore: undefined,
    pubStore: undefined,
    techOpsStore: undefined,
    all: -1,
    global: -1,
    shop: -1,
    account: -1,
    pub: -1,
    tech: -1,
    countStore: undefined,
    pieChart: undefined,
    context: {projectScopeDown: true},

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
                    me.techOps = me.techOpsStore.count();
                    console.log('techOpsStore Loaded', me.techOpsStore.count());
                    me._createCountStore();
                },
                scope: me
            },
        });
        me.globalStore.load();
    },
    
    _createCountStore: function() {
        let me= this;
        Ext.define('DefectsCounter', {
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
        });
        console.log('CountStore: ', me.countStore2);
        me._getPie();
    },
//!**********************************************************************************\\
//!*     Creates a basic chart and loads the count of defects based on store        *\\
//!**********************************************************************************\\
    _getPie: function () {
        let me = this;

        me.pieChart = Ext.create('Ext.chart.Chart', {
            renderTo: Ext.getBody(),
            width: 500,
            height: 400,
            animate: true,
            store: me.countStore2,
            theme: 'Base:gradients',
            series: [{
                type: 'pie',
                angleField: 'count',
                showInLegend: true,
                tips: {
                    trackMouse: true,
                    width: 140,
                    height: 28,
                    renderer: function(storeItem, item) {
                        // calculate and display percentage on hover
                        var total = 0;
                        me.countStore2.each(function(rec) {
                            me.all = total += rec.get('count');
                        });
                        this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('count') / total * 100) + '%');
                    }
                },
                highlight: {
                    segment: {
                        margin: 20
                    }
                },
                label: {
                    field: 'name',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial'
                }
            }]
        });
        me.add(me.pieChart);
    },
});

