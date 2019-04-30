sap.ui.jsview("sap.ui.demo.todo.view.App", {
    getControllerName: function() {
        "use strict";
        return "sap.ui.demo.todo.controller.App";
    },
    createContent: function(oController) {
        "use strict";
        this.rb = this.getModel("i18n").getResourceBundle();
        var searchField = new sap.m.SearchField(this.createId("searchTodoItemsInput"), {
            width: "100%",
            liveChange: [oController.onSearch, oController]
        });

        var todoInp = new sap.m.Input(this.createId("addTodoItemInput"), {
            value: "{/newTodo}",
            placeholder: this.rb.getText("INPUT_PLACEHOLDER"),
            change: [oController.addTodo, oController]
        }).addStyleClass("todoInput");

        var oItemTemplate = new sap.m.CustomListItem({
            selected: "{completed}",
            content: new sap.m.Input({
                enabled: "{=!${completed}}",
                value: "{title}"
            })
        }).addStyleClass("todoListItem");

        var todoList = new sap.m.List(this.createId("todoList"), {
            mode: "MultiSelect",
            growing: true,
            growingScrollToLoad: true,
            showNoData: false,
            showSeparators: "None",
            rememberSelections: false,
            infoToolbar: new sap.m.Toolbar({
                content: new sap.m.Label(this.createId("itemsLeftLabel"), {
                    text: "{= ${/itemsLeftCount} === 1 ? ${/itemsLeftCount} + ' ' + ${i18n>ITEM_LEFT} : ${/itemsLeftCount} + ' ' + ${i18n>ITEMS_LEFT} }"
                })
            }),
            items: {
                path: "/todos",
                template: oItemTemplate,
                events: {
                    change: function() {
                        oController.updateItemsLeftCount.apply(oController, arguments);
                    }
                }
            }
        });

        var page = new sap.m.Page(this.createId("sampleTodo"), {
            title: this.rb.getText("TITLE"),
            backgroundDesign: "Solid",
            content: [todoInp, todoList],
            subHeader: new sap.m.Toolbar({
                content: searchField
            }),
            footer: new sap.m.Bar({
                contentMiddle: [new sap.m.SegmentedButton({
                    selectedKey: "all",
                    selectionChange: [oController.onFilter, oController],
                    items: [new sap.m.SegmentedButtonItem(this.createId("filterButton-all"), {
                        text: "All",
                        key: "all"
                    }), new sap.m.SegmentedButtonItem(this.createId("filterButton-active"), {
                        text: "Active",
                        key: "active"
                    }), new sap.m.SegmentedButtonItem(this.createId("filterButton-completed"), {
                        text: "Completed",
                        key: "completed"
                    })]
                }).addStyleClass("sapMSegmentedButtonNoAutoWidth")],
                contentRight: [new sap.m.Button(this.createId("clearCompleted"), {
                    enabled: "{/itemsRemovable}",
                    icon: "sap-icon://delete",
                    text: "{i18n>CLEAR_COMPLETED}",
                    press: [oController.clearCompleted, oController]
                })]
            })
        });

        var shell = new sap.m.Shell({
            app: page
        });
        return shell;
    }
});