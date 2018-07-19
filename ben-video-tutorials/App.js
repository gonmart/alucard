Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    myStore: undefined,
    myGrid: undefined,
    context: {projectScopeDown: true},

    //************************************************************************************
    //*     Creates combobox and data store to provide requested defect fields           *
    //************************************************************************************
    launch: function () {
        let me = this;
        //Creates horizontal layout dropdown menus
        let pulldownContainer = Ext.create('Ext.container.Container', {
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        });

        me.add(pulldownContainer);
        me._loadProjects();
        me._loadFields();
        me._loadData();
    },

    //**********************************************************************************\\
    //*     Creates combobox and data store for the user to select a project           *\\
    //**********************************************************************************\\
    _loadProjects: function () {
        let me = this;
        // creates data store containing the list of projects & Ids
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
            value: '208447136196',
            width: 300,
            listeners: {
                ready: me._loadData,
                select: me._loadData,
                scope: me
            }
        });
        me.down('#pulldown-container').add(projectComboBox);
    },

    //**********************************************************************************\\
    //*     Creates combobox and data store to provide requested defect fields         *\\
    //**********************************************************************************\\
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
                select: me._loadProperties,
                scope: me
            }
        });
        me.add(fieldComboBox);
    },
    //**********************************************************************************\\
    //*    Combobox that contains a list of properties from Field Combobox Selection   *\\
    //**********************************************************************************\\
    _loadProperties: function () {
        let me = this;
        let selectedField = this.down('#field-combobox').getValue();//get field value

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

        me.down('#pulldown-container').add(propertyCombobox);
    },

    //**********************************************************************************\\
    //*      Loads data to populate the grid. Currently manages data logic.            *\\
    //**********************************************************************************\\
    _loadData: function () {
        let me = this;

        let selectedProject;

        //if the store has already been loaded... get context
        if (me.alucardStore) {
            me.alucardStore.context.project = me._getProjectContext();
            me._loadFilters(me.alucardStore);
            me.alucardStore.load();
        }
        //Else Create a fresh grid/store of data
        else {
            me.alucardStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                context: {
                    project: me._getProjectContext(selectedProject),
                    projectScopeDown: true,
                    projectScopeUp: false
                },
                listeners: {
                    load: function (alucardStore) {
                        if (!this.alucardGrid) {
                            me._createGrid(alucardStore);
                        }
                    },
                    scope: me
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration', 'Project']
            });
        }
    },


//******************************************************************************************\\
//*                                    WORKER FUNCTIONS                                    *\\
//******************************************************************************************\\



    //**********************************************************************************\\
    //*                    creates and sets the filter from selections                 *\\
    //**********************************************************************************\\
    _loadFilters(store) {
        let me = this;

        let selectedField;
        let selectedProperty;
        if (me.down('#field-combobox').getValue() && me.down('#property-combobox').getValue()) {
            selectedField = me.down('#field-combobox').getValue();
            selectedProperty = me.down('#property-combobox').getValue();

            console.log(selectedField, selectedProperty);
            let myFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: selectedField,
                operator: '=',
                value: selectedProperty
            });

            store.clearFilter(true);
            store.setFilter(myFilter);
            console.log('just passed the filter');
        }
    },

//**********************************************************************************\\
//*                    Creates a new grid with specified columns                   *\\
//**********************************************************************************\\
    _createGrid: function (alucardStore) {
        this.alucardGrid = Ext.create('Rally.ui.grid.Grid', {
            store: alucardStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
            ]
        });
        this.add(this.alucardGrid);
    }
    ,

//**********************************************************************************\\
//*       sets project context(scope) and provides default if none selected        *\\
//**********************************************************************************\\
    _getProjectContext: function () {

        let userSelection = this.down('#project-combobox').getValue();
        let myProject = '/project/' + userSelection;
        let defaultProject = '/project/208447136196';
        if (!userSelection) {
            myProject = defaultProject;
        }

        return myProject;
    }

});



