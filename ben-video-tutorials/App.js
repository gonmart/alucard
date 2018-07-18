Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    myStore: undefined,
    myGrid: undefined,
    context: {projectScopeDown: true},

    items: [
        {
            xtype: 'container',
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        }
    ],

    //App starts here
    launch: function () {

        let me = this;

        //Creates horizontal layout dropdown menus
        console.log('loading app...');
        me._loadProjects();
    },


    _loadProjects: function () {
        let me = this;
        // creates data store containing the list of projects & Ids
        console.log('called loadProjects');
        let projectList = Ext.create('Ext.data.Store', {
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
        let projectComboBox = Ext.create('Ext.form.ComboBox', {
            itemId: 'project-combobox',
            fieldLabel: 'Defects by Capability',
            labelAlign: 'right',
            store: projectList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            width: 300,
            renderTo: Ext.getBody(),
            listeners: {
                ready: me._loadFields,
                select: me._loadData,
                scope: me
            }
        });
        this.down('#pulldown-container').add(projectComboBox);
        console.log('added project combobox');
    },

    _loadFields: function () {
        let me = this;
        // creates data store containing the list of projects & Ids
        let fieldList = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [
                {"name": "State", "value": "State"},
                {"name": "Severity", "value": "Severity"},
                {"name": "Priority", "value": "Priority"},
                {"name": "Environment", "value": "Environment"},
                {"name": "Trend", "value": "Trend"},
            ]
        });

        // create the custom combo box, attached to the projects data store
        let fieldComboBox = Ext.create('Ext.form.ComboBox', {
            itemId: 'field-combobox',
            fieldLabel: 'Defect Fields',
            labelAlign: 'right',
            store: fieldList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            width: 300,
            renderTo: Ext.getBody(),
            listeners: {
                ready: me._loadData(),
                select: me._loadProperties,
                scope: me
            }
        });
        this.down('#pulldown-container').add(fieldComboBox);
    },

    _loadProperties: function () {
        let me = this;
        console.log('called loadProperties');
        let selectedField = this.down('#field-combobox').getValue();

        let propertyCombobox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            itemId: 'property-combobox',
            model: 'Defect',
            field: selectedField,
            fieldLabel: 'Defects by Property',
            labelAlign: 'right',
            width: 300,
            renderTo: Ext.getBody(),
            listeners: {
                select: me._loadData,
                scope: me
            }
        });

        this.down('#pulldown-container').add(propertyCombobox);
    },

    /*_loadSelections() {
        let selectedField = this.down('#field-combobox').getValue();
        let selectedProperty = this.down('#property-combobox').getValue();
        let ready;
        if(this.down('#field-combobox').getValue() && this.down('#property-combobox').getValue()) { ready = true}
        let propertyFilter = this._getFilters(selectedField, selectedProperty);
        return {
            ready:ready,
            filter: propertyFilter
        }
    },*/
    _loadData: function () {
        let selectedProject = this.down('#project-combobox').getValue();

        //Sets filters for data that limit to user selection
        //If the store exists, load new data
        if (this.alucardStore) {
            this.alucardStore.context.project = this._getProjectContext(selectedProject);
            /*if (this._loadSelections.ready) {
                this.alucardStore.setFilter(this._loadSelections.filter);
            }*/
            /*else {
                console.log('filter has not been set');
            }*/
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

    /*_getFilters: function(field, property) {
        myfilter = Ext.create('Rally.data.wsapi.Filter', {
            property: field,
            operator: '=',
            value: property
        });
    },*/

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
        if (!userSelection) {
            myProject = defaultProject;
        }

        return myProject;
    },
});



