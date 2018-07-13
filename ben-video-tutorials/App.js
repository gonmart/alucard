Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    myStore: undefined,
    myGrid: undefined,

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
        this._loadIterations();
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
        let iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Iteration',
            operation: '=',
            value: iterationValue
        });

        //Sets filters for data that limit to user selection
        let severityFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Severity',
            operation: '=',
            value: severityValue
        });

        //Sets filters to use both user selections
        return iterationFilter.and(severityFilter);
    },

    //Uses selected items from combobox to populate grid with data
    _loadData: function () {
        let selectedIterRef = this.down('#iteration-combobox').getRecord().get('_ref');
        let selectedSeverityValue = this.down('#severity-comboBox').getRecord().get('value');

        //Sets filters for data that limit to user selection
        let myFilters = this._getFilters(selectedIterRef, selectedSeverityValue);

        //If the store exists, load new data
        if (this.alucardStore) {
            this.alucardStore.setFilter(myFilters);
            this.alucardStore.load();
        }
        //Or else Create a fresh grid/store of data
        else {
            this.alucardStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function (alucardStore, alucardData, success) {
                        console.log('got data!', alucardStore, alucardData, success);
                        if (!this.alucardGrid) {
                            this._createGrid(alucardStore);
                        }
                    },
                    scope: this
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
            });
        }
    },

    //Creates a new grid with specified columns
    _createGrid: function (alucardStore) {
        this.alucardGrid = Ext.create('Rally.ui.grid.Grid', {
            store: alucardStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });
        this.add(this.alucardGrid);
    }

});
