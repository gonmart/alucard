Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    myStore: undefined,
    myGrid: undefined,
    context: {projectScopeDown: true},
    //App starts here
    launch: function () {

        //Creates horizontal layout dropdown menus
        let pulldownContainer = Ext.create('Ext.container.Container', {
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        });

        /*var emptyProjectList;


        let getMyProjects = (function (allProjects, navPrefProjects) {
            if (navPrefProjects && allProjects) {
                return navPrefProjects.keySeq().map(function (oid) {
                    return allProjects.get('/project/' + oid);
                });
            }
            console.log(emptyProjectList);
        });*/

        //getMyProjects();
        this.add(pulldownContainer);
        //this._loadIterations();
        this._loadData();
    },

    //Creates a combobox for users to select different Iterations
    _loadIterations: function () {
        let iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            itemId: 'iteration-combobox',
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            width: 310,
            listeners: {
                ready: function (combobox) {
                    //this._loadData();
                    this._loadSeverities();
                },
                select: function (combobox, records) {
                    this._loadData();
                },
                scope: this
            }
        });

        this.down('#pulldown-container').add(iterComboBox);
    },

    //Creates a combobox for users to select different Severities
    _loadSeverities: function () {
        let severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            itemId: 'severity-comboBox',
            fieldLabel: 'Severity',
            labelAlign: 'right',
            width: 220,
            model: 'Defect',
            field: 'Severity',
            listeners: {
                ready: function (combobox) {
                    this._loadData();
                },
                select: function (combobox, records) {
                    this._loadData();
                },
                scope: this
            }
        });

        this.down('#pulldown-container').add(severityComboBox);

    },
    // make and retrieve filters based on user selected values
    _getFilters: function (iterationValue, severityValue) {
        let userSelection;

        //SHOP ************************************************
        let shop = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) Shop (OneSite)"
        });
        let shopCod = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Shop_CoD"
        });
        //Sets filters for data that limit to user selection
        let shopCore = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Shope_Core"
        });
        //*****************************************************

        //Pub *************************************************
        let pub = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) PUB (OneSite)"
        });
        let pubCod = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_CoD"
        });
        let pubMonkeys = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_Frozen Monkeys"
        });
        let pubPeppers = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Chilana Peppers"
        });
        let avengers = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_Avengers"
        });
        //*****************************************************


        //TechOps *********************************************
        let techOps = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) TechOps (OneSite)"
        });
        let techcloudSecOps = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "unknown"
        });
        let techCD = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "TO_Continuous Delivery"
        });


        //Sets filters to use both user selections
        return pub.or(pubCod).or(pubMonkeys).or(pubPeppers);
    },

    //Uses selected items from combobox to populate grid with data
    _loadData: function () {

        //let selectedIterRef = this.down('#iteration-combobox').getRecord().get('_ref');
        //let selectedSeverityValue = this.down('#severity-comboBox').getRecord().get('value');

        //Sets filters for data that limit to user selection
        let myFilters = this._getFilters();

        //If the store exists, load new data
        if (this.alucardStore) {
            //this.alucardStore.setFilter(myFilters);
            this.alucardStore.load();
        }
        //Or else Create a fresh grid/store of data
        else {
            /*console.log("I've reached this point!");
            this.alucardStore = Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
                models: ['Defect'],
                autoLoad: true,
                enableHierarchy: true,
                filters: Ext.create('Rally.data.wsapi.Filter', {
                    property: 'Parent',
                    operator: '=',
                    value: "/project/208449406576"
                }),
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration', 'Project']
            }).then({
                    success: function (alucardStore, data, success, filters) {
                        console.log('got data!', alucardStore, data, success, 'Filters!: ', filters);
                        if (!this.alucardGrid) {
                            this._createGrid(alucardStore);
                        }
                    },
                    scope: this
                }
            );*/
            /*        }
                },*/

            this.alucardStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                context: {projectScopeDown: true},
                filters: myFilters,
                /*filters: Ext.create('Rally.data.wsapi.Filter', {
                    property: 'Project.Name',
                    operator: 'like',
                    value: "pub"
                }),*/
                listeners: {
                    load: function (alucardStore, data, success, filters) {
                        console.log('got data!', alucardStore, data, success, 'Filters!: ', filters);
                        if (!this.alucardGrid) {
                            this._createGrid(alucardStore);
                        }
                    },
                    scope: this
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration', 'Project']
            });
        }
    },

    //Creates a new grid with specified columns
    _createGrid: function (alucardStore) {
        console.log('creating Grid');
        /*this.add({
            xtype: 'rallytreegrid',
            store: alucardStore,
            context: this.getContext(),
            enableInlineAdd: true,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
            ]
        });*/
        /*this.alucardGrid = Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
            models: ['Defect'],
            autoLoad: true,
            enableHierarchy: true
        }).then({
            success: function (store) {
                Console.log("grid was created!");
                Ext.create('Ext.Container', {
                    items: [{
                        xtype: 'rallytreegrid',
                        columnCfgs: [
                            'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
                        ],
                        store: alucardStore
                    }],
                });
                this.add(this.alucardStore);
            },
            scope: this*/


        this.alucardGrid = Ext.create('Rally.ui.grid.Grid', {
            store: alucardStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
            ]
        });
        this.add(this.alucardGrid);
    }

});
