$(function () {
    const Admin = function () {
        function init() {
            this.$classifyAdd = $('#js-classify-add');
            this.bindEvent();
        }
        function bindEvent() {
            // this.classifyAdd();
        }
        function classifyAdd() {
            this.$classifyAdd.on('submit', function (e) {
                e.preventDefault();
                // 可以这样发送表单格式的数据
                $.post('/admin/classifyadd', $(this).serialize(), function(res) {
                    if(!res.code) {
                        
                    }
                });
            });
        }
        return {
            init,
            bindEvent
        };
    }();

    Admin.init();
});