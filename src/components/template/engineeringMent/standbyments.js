export default {
    name: 'standbyMent',
    created() {
        this.init();
    },
    data() {
        return {
            table_data : [],

            page_list : {
                page_num : 1,
                page_size : 10,
                total : 0
            },

            search_info : {
                spare_nm : undefined,
                inv_sts : undefined
            },

            add_info : {
                spareNm : undefined,
                unit : undefined,
                dicName : undefined,
                dicValue : undefined,
                secInv : undefined,
                invAlarm : undefined,
            },

            select_op : [],

            eqp_typ : "01",
            batch_ids : undefined,
            is_has_id : undefined,
            diag_title : undefined,
            search_pageNum : undefined,
            search_pageSize : undefined,
            is_disabled : false,
            sale_change_name : "first",
            new_custom : false,
        }
    },
    methods: {
        init() {
            this.reset();
            this.getTableData();
        },

        getTableData() {
            let that = this;

            this.$ajaxWrap({
                type: "post",
                url: "/spare/queryList",
                data: {
                    pageNum: "1",
                    pageSize: "10"
                },
                success(res) {
                    that.loadTable(res.data);
                }
            })
        },

        searchTableData() {
            let that = this;
            this.$ajaxWrap({
                type: "post",
                url: "/spare/queryList",
                data: {
                    spareNm : that.search_info.spare_nm,
                    invSts : that.search_info.inv_sts,
                    pageNum: that.search_pageNum || "1",
                    pageSize: that.search_pageSize || "10"
                },
                success(res) {
                    that.loadTable(res.data);
                }
            })
        },

        loadTable(data) {
            let that = this;
            this.table_data = data.page.list;
            this.page_list.page_num = data.page.pageNum;
            this.page_list.page_size = data.page.pageSize;
            this.page_list.total = data.page.total;
        },

        // 重置
        reset() {
            this.$clearObject(this.search_info);
        },

        // 刷新  
        refresh() {
            this.$clearObject(this.search_info);
            this.searchTableData();
        },

        deleteIds() {
            let that = this;
            if(!this.batch_ids) {
                this.$message({
                    message: "请选择删除的数据",
                    type:"warning"
                });
                return;
            };

            this.$confirm("你确定删除么？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(function() {
                that.$ajaxWrap({
                    type: "get",
                    url: "/spare/deleteByIds",
                    data: {
                        ids : that.batch_ids
                    },
                    success(res) {
                        that.$message({
                            message: res.tipMsg,
                            type: "success"
                        });
                        that.new_custom = false;
                        that.searchTableData(res.data);
                    }
                }) 
            }).catch(function() {});
        },

        // 弹框
        toAdd(id) {
            let that = this;
            this.diag_title = "新增备件"
            this.is_has_id = id;

            this.$clearObject(this.add_info);
            this.$ajaxWrap({
                    type: "get",
                    url: "/equipment/getSelects",
                    data: {
                        key : "unit"
                    },
                    success(res) {
                        that.select_op = res.data.dicData;
                    }
                })
            if(id) {
                this.diag_title = "修改备件"
                this.$ajaxWrap({
                    type: "get",
                    url: "/spare/getObject",
                    data: {
                        id : id
                    },
                    success(res) {
                        that.add_info = res.data.data;
                        console.log(that.add_info)
                    }
                })
            }
            this.new_custom = true;
        },

        // 保存
        saveInfo() {
            let that = this;
            var _operationType = (this.is_has_id ? "update" : "add");
            var _flag = 
                !that.add_info.spareNm || 
                !that.add_info.unit || 
                !that.add_info.secInv || 
                !that.add_info.invAlarm;
            if(_flag) {
                this.$message({
                    message: "请将信息填写完整",
                    type: "warning"
                });
                return;
            };

            this.$ajaxWrap({
                type: "post",
                url: "/spare/save",
                data: {
                    operationType : _operationType,
                    spareNm : that.add_info.spareNm,
                    spareId : that.is_has_id,
                    unit : that.add_info.unit,
                    secInv : that.add_info.secInv,
                    invAlarm : that.add_info.invAlarm,
                },
                success(res) {
                    that.$message({
                        message: res.tipMsg,
                        type: "success"
                    });
                    that.new_custom = false;
                    that.refresh();
                }
            })  
        },

        // 删除
        deleteId(id) {
            let that = this;
            this.$confirm("你确定删除么？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(function() {
                 that.$ajaxWrap({
                    type: "get",
                    url: "/spare/deleteById",
                    data: {
                        id : id
                    },
                    success(res) {
                        that.$message({
                            message: res.tipMsg,
                            type: "success"
                        });
                        that.new_custom = false;
                        that.searchTableData(res.data);
                    }
                }) 
            }).catch(function() {});
        },

        // 复选框勾选
        handleSelectionChange(val) {
            var batch_ids = [];
            if(val.length > 0) {
                for (var i = 0; i < val.length; i++) {
                    batch_ids.push(val[i].spareId);
                }
                this.batch_ids = batch_ids.join(",");
            }else{
                this.batch_ids = undefined;
            }
        },

        // table切换
        changeTableActive(val) {
            this.show_other = (val.name == "first" || !val ? true : false);
            switch (val.name) {
                case "first":
                    this.eqp_typ = "01";
                    this.getTableData();
                    break;
                case "second":
                    this.eqp_typ = "02";
                    this.getTableData();
                    break;
                case "third":
                    this.eqp_typ = "03";
                    this.getTableData();
                    break;
                case "fourth":
                    this.eqp_typ = "04";
                    this.getTableData();
                    break;
                case "fifth":
                    this.eqp_typ = "05";
                    this.getTableData();
                    break;
                case "other":
                    this.eqp_typ = "06";
                    this.getTableData();
                    break;
            }
        },

        // 点击关闭
        closeDialog() {
            var that = this;
            this.$confirm("你确定关闭么？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(function() {
                that.new_custom = false;
            }).catch(function() {});
        },

        searchFormData(pageval, pagesize) {
            var that = this;
            if (pagesize === "num") {
                that.search_pageNum = pageval || that.page_list.page_num;
                that.search_pageSize = that.page_list.page_size;
            } else {
                that.search_pageNum = that.page_list.page_num;
                that.search_pageSize = pageval || that.page_list.page_size;
            }
            that.searchTableData();
        },

        // 分页
        handleSizeChange(val) {
            if (this.table_data.length) {
                this.searchFormData(val, "size");
            };
        },
        // -----------------------------------------------------------------------------------------------------------------------------------      
        handleCurrentChange(val) {
            if (this.table_data.length) {
                this.searchFormData(val, "num");
            };
        },
    },
}
