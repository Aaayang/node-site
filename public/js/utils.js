const Utils = function() {
    function ajax({url, data={}, type="POST"}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: type,
                data: data,
                dataType: 'json',
                success: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
    return {
        ajax
    }
}();