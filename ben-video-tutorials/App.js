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

        this.add(pulldownContainer);
        this._loadProjects();
        this._loadData();
    },


    _loadProjects: function () {
        // creates data store containing the list of projects & Ids
        var projectList = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [
                {"name": "All", "value": "208447136196"},
                {"name": "Global", "value": "208449426736"},
                {"name": "Shop", "value": "208450167952"},
                {"name": "Account Management", "value": "208449406576"},
                {"name": "PUB", "value": "208449434348"},
                {"name": "TechOps", "value": "222502039964"},
            ]
        });

        // create the custom combo box, attached to the projects data store
        var projectComboBox = Ext.create('Ext.form.ComboBox', {
            itemId: 'project-combobox',
            fieldLabel: 'Defects by Capability',
            labelAlign: 'right',
            store: projectList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            renderTo: Ext.getBody(),
            width: 300,
            listeners: {
                ready: this._loadData,
                select: this._loadData,
                scope: this
            }
        });

        this.down('#pulldown-container').add(projectComboBox);
    },

    _loadData: function () {
        let selectedProject = this.down('#project-combobox').getValue();

        console.log("selected Value: ", selectedProject);

        //Sets filters for data that limit to user selection
        //let userSelection = this._getFilters(selectedProject);

        //If the store exists, load new data
        if (this.alucardStore) {
            this.alucardStore.context.project = this._getProjectContext(selectedProject);
            this.alucardStore.load();
        }
        //Else Create a fresh grid/store of data
        else {
            this.alucardStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                context: {
                    project: this._getProjectContext(selectedProject),
                    projectScopeDown: true,
                    projectScopeUp: false
                },
                //filters: myFilters,
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
        this.alucardGrid = Ext.create('Rally.ui.grid.Grid', {
            store: alucardStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
            ]
        });
        this.add(this.alucardGrid);
    },

    _getProjectContext: function (userSelection) {
        let myProject = '/project/' + userSelection;
        let defaultProject = '/project/208447136196';

        console.log('My Project: ', myProject);
        if (!userSelection)
        {
            myProject = defaultProject;
        }

        return myProject;
    },

    _filters: {
        //SHOP ************************************************
        shop: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) Shop (OneSite)"
        }),
        shopCod: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Shop_CoD"
        }),
        shopCore: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Shope_Core"
        }),
        //*****************************************************

        //Pub *************************************************
        pub: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) PUB (OneSite)"
        }),
        pubCod: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_CoD"
        }),
        pubMonkeys: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_Frozen Monkeys"
        }),
        pubPeppers: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "Chilana Peppers"
        }),
        avengers: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "PUB_Avengers"
        }),
        //*****************************************************


        //TechOps *********************************************
        techOps: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) TechOps (OneSite)"
        }),
        techcloudSecOps: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "TO_CloudSecOps"
        }),
        techCD: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "TO_Continuous Delivery"
        }),
        techAutomation: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "TO_Automation"
        }),
        techprodSupport: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "TO_Prod Support"
        }),
        //Global ***********************************************
        global: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) Global (OneSite)"
        }),
        globalCore: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_Core"
        }),
        globalGlobe: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_Globetrotters"
        }),
        globalAustin: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_RZF-Austin"
        }),
        globalRockers: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_Rockers"
        }),
        globalSpartans: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_Spartans"
        }),
        globalCOD: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "GL_CoD"
        }),
        //*****************************************************

        //Account Management***********************************
        accMngnt: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "(c) Account Management (OneSite)"
        }),
        accMngnt200Ok: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "ACC_200_OK_SUCCESS"
        }),
        accMngntDothraki: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "ACC_Dothraki"
        }),
        accMngntRR: Ext.create('Rally.data.wsapi.Filter', {
            property: 'Project.Name',
            operator: '=',
            value: "ACC_RoadRunners"
        }),
    }
});

/*(c) Account Management (OneSite)
ACC_200_OK_SUCCESS
ACC_Dothraki
ACC_RoadRunners*/

//Creates a combobox for users to select different Iterations
/*loadIterations: function () {
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
},*/

//Creates a combobox for users to select different Severities
/*_loadSeverities: function () {
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

},*/
// make and retrieve filters based on user selected values


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


