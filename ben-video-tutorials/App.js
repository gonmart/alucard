Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        console.log('Our First App woot!');
        this._loadData();
    },

    _loadData: function() {

        let alucardStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(alucardStore, alucardData, success) {
                    console.log('got data!', alucardStore, alucardData, success);
                    this._loadGrid(alucardStore);
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState']
        });
    },

    _loadGrid: function(alucardStore) {
        let alucardGrid = Ext.create('Rally.ui.grid.Grid', {
            store: alucardStore,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState'
            ]
        });

        this.add(alucardGrid);

    }

});
