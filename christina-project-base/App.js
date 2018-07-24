// Custom Rally App that can sort OneSite defects by project name
//
// Note: user must default in the "OneSite" workspace
// and check "Project Scope Up" and "Project Scope Down"

Ext.define("CustomApp", {
    extend: "Rally.app.App",
    componentCls: "app",

    // general layout skeleton
    items: [
        {
            xtype: "container",
            itemId: "pulldown-container",
            layout: {
                type: "hbox",
                align: "stretch"
            }
        }
    ],

    // app level ref to store & grid for easy access
    defectStore: undefined,
    defectGrid: undefined,

    // application entry point
    launch: function () {
        var me = this;

        // initialize project pulldown selection
        me._loadProjects();
    },

    // create and load a pulldown of specific project names
    _loadProjects: function () {
        var me = this;

        console.log("this", this);

        // create the custom combo box, attached to the projects data store
        var projectComboBox = Ext.create("Ext.form.ComboBox", {
            itemId: "project-combobox",
            fieldLabel: "Defects by Project",
            labelAlign: "right",
            store: this._loadProjectList(),
            queryMode: "local",
            displayField: "name",
            valueField: "projectId", // search and filter with this attribute
            renderTo: Ext.getBody(),
            width: 300,
            listeners: {
                ready: me._loadData,
                select: me._loadData,
                scope: me
            }
        });

        this.down("#pulldown-container").add(projectComboBox);
    },

    // creates data store containing the list of projects & Ids
    _loadProjectList: function () {
        var projectList = Ext.create("Ext.data.Store", {
            fields: ["name", "projectId"],
            data: [
                {
                    name: "OneSite",
                    projectId: "208447136196"
                },
                {
                    name: "(c) Account Management",
                    projectId: "208449406576"
                },
                {
                    name: "(c) Global",
                    projectId: "208449426736"
                },
                {
                    name: "(c) Microsites",
                    projectId: "236274794884"
                },
                {
                    name: "- - MS_Join Experience",
                    projectId: "236274807456"
                },
                {
                    name: "(c) PUB",
                    projectId: "208449434348"
                },
                {
                    name: "(c) Shop",
                    projectId: "208450167952"
                },
                {
                    name: "- - Shop_CoD",
                    projectId: "208453611560"
                },
                {
                    name: "Shop_Core",
                    projectId: "208454338752"
                },
                {
                    name: "(c) TechOps",
                    projectId: "222502039964"
                }
            ]
        });
        return projectList;
    },

    // construct filters for projects given project name
    _getFilters: function (projectId) {
        var projectFilter = Ext.create("Rally.data.wsapi.Filter", {
            property: "Project",
            operator: "=",
            value: "/project/" + projectId
        });

        // filters for defects in child and child-child projects
        var scopeFilter = Ext.create("Rally.data.wsapi.Filter", {
            property: "Project.Parent",
            operator: "=",
            value: "/project/" + projectId
        }).or(Ext.create("Rally.data.wsapi.Filter", {
            property: "Project.Parent.Parent",
            operator: "=",
            value: "/project/" + projectId
            })
        );

        // only show unclosed defects
        var tmoFilter = Ext.create("Rally.data.wsapi.Filter", {
            property: "Project.Parent",
            operator: "=",
            value: "/project/" + projectId
        });

        return projectFilter.or(scopeFilter);
        //return projectFilter;
    },

    // get data from Rally
    _loadData: function () {
        var me = this;

        // lookup what user chose from pulldown
        var selectedProject = this.down("#project-combobox").getValue();

        var myFilters = this._getFilters(selectedProject);

        // if store exists, just load new data
        if (me.defectStore) {
            me.defectStore.setFilter(myFilters);
            me.defectStore.load();

            // create store
        } else {
            me.defectStore = Ext.create("Rally.data.wsapi.Store", {
                model: "Defect",
                context: {
                    projectScopeDown: true,
                    projectScopeUp: true
                },
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function (myStore, myData, success) {
                        console.log("got data!", myStore, myData);

                        // create grid if it does not exist yet
                        if (!me.defectGrid) {
                            me._createGrid(myStore);
                        }
                    },
                    scope: me
                },
                fetch: [
                    "FormattedID",
                    "Project",
                    "Name",
                    "Priority",
                    "State",
                    "Severity",
                    "Iteration"
                ]
            });
        }
    },

    // create and show a grid of given defect
    _createGrid: function (myDefectStore) {
        var me = this;

        me.defectGrid = Ext.create("Rally.ui.grid.Grid", {
            store: myDefectStore,
            columnCfgs: [
                "FormattedID",
                "Project",
                "Name",
                "Priority",
                "State",
                "Severity",
                "Iteration"
            ]
        });

        me.add(me.defectGrid);
    }
});
